import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll
} from "vite-plus/test";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  API_KEY_ENV_VAR,
  TmdbSession,
  TOKEN_ENV_VAR,
  type SessionRequest
} from "../TmdbSession.js";

const server = setupServer();
const url = new URL(`https://api.themoviedb.org/3/movie/11`);
const GET: SessionRequest = { method: `GET` };

/**
 * Serve `url` with `reply` and record every request that reaches the network, so a test can count dispatches and inspect what was sent. `reply` receives the 0-based attempt number.
 */
const serve = (
  reply: (attempt: number) => Response | Promise<Response>
): Request[] => {
  const received: Request[] = [];
  server.use(
    http.get(url.href, async ({ request }) => {
      received.push(request.clone());
      return reply(received.length - 1);
    })
  );
  return received;
};

/** Serve `url` with responses the test releases one at a time, to observe how many requests are in flight at once. */
const serveHeld = (): { received: Request[]; release: () => void } => {
  const held: (() => void)[] = [];
  const received = serve(
    async () =>
      new Promise<Response>((resolve) => {
        held.push(() => {
          resolve(HttpResponse.json({}));
        });
      })
  );
  return { received, release: () => held.shift()?.() };
};

// Fake only the clocks the session reads. msw schedules its own work with microtasks and immediates, which must keep running.
const useFakeClock = (): void => {
  vi.useFakeTimers({ toFake: [`setTimeout`, `clearTimeout`, `Date`] });
};

describe(`tmdbSession`, () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: `error` });
  });
  beforeEach(() => {
    // The developer's own credentials must not leak into these tests.
    vi.stubEnv(TOKEN_ENV_VAR, ``);
    vi.stubEnv(API_KEY_ENV_VAR, ``);
  });
  afterEach(() => {
    server.resetHandlers();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });
  afterAll(() => {
    server.close();
  });

  describe(`credentials`, () => {
    it(`sends the read-access token as a Bearer header, never in the query`, async () => {
      const received = serve(() => HttpResponse.json({}));
      await new TmdbSession({ token: `t0ken` }).fetch(url, GET);
      expect(received[0].headers.get(`Authorization`)).toBe(`Bearer t0ken`);
      expect(new URL(received[0].url).searchParams.has(`api_key`)).toBe(false);
    });

    it(`falls back to the v3 key as ?api_key= with no Authorization header`, async () => {
      const received = serve(() => HttpResponse.json({}));
      await new TmdbSession({ apiKey: `k3y` }).fetch(url, GET);
      expect(new URL(received[0].url).searchParams.get(`api_key`)).toBe(`k3y`);
      expect(received[0].headers.has(`Authorization`)).toBe(false);
    });

    // The caller's URL may be logged or reused (TanStack Query keys); the key must only exist on the wire.
    it(`never writes the api key into the caller's URL`, async () => {
      serve(() => HttpResponse.json({}));
      const resource = new URL(url);
      await new TmdbSession({ apiKey: `k3y` }).fetch(resource, GET);
      expect(resource.href).toBe(url.href);
    });

    it(`prefers an explicit token over the environment, and any token over a key`, () => {
      vi.stubEnv(TOKEN_ENV_VAR, `env-token`);
      vi.stubEnv(API_KEY_ENV_VAR, `env-key`);
      expect(new TmdbSession({ apiKey: `k` }).resolveAuth()).toEqual({
        authorization: `Bearer env-token`
      });
      expect(new TmdbSession({ token: `mine` }).resolveAuth()).toEqual({
        authorization: `Bearer mine`
      });
      vi.stubEnv(TOKEN_ENV_VAR, ``);
      expect(new TmdbSession().resolveAuth()).toEqual({ apiKey: `env-key` });
    });

    it(`explains how to configure credentials when there are none`, () => {
      const session = new TmdbSession();
      expect(session.hasAuth).toBe(false);
      expect(() => session.resolveAuth()).toThrow(TOKEN_ENV_VAR);
    });

    it(`rejects empty credentials instead of silently sending none`, () => {
      expect(() => new TmdbSession().setToken(``)).toThrow();
      expect(() => new TmdbSession().setApiKey(``)).toThrow();
    });

    it(`forgets credentials on clearSession`, () => {
      const session = new TmdbSession({ token: `t`, apiKey: `k` });
      session.clearSession();
      expect(session.hasAuth).toBe(false);
    });
  });

  describe(`rate limiting`, () => {
    beforeEach(useFakeClock);

    it(`never dispatches more than the limit within one window`, async () => {
      const received = serve(() => HttpResponse.json({}));
      const session = new TmdbSession({
        token: `t`,
        rateLimit: { requests: 2, perMs: 1000 }
      });

      const all = Promise.all(
        [1, 2, 3].map(async () => session.fetch(url, GET))
      );
      await vi.advanceTimersByTimeAsync(0);
      expect(received).toHaveLength(2);
      expect(session.getQueueSize()).toBe(1);

      await vi.advanceTimersByTimeAsync(999);
      expect(received).toHaveLength(2);

      await vi.advanceTimersByTimeAsync(1);
      expect(received).toHaveLength(3);
      await all;
    });

    // TMDB has no per-route buckets, so serialising requests (as Discord needs) would only cap throughput at 1/latency.
    it(`lets requests overlap instead of waiting for each response`, async () => {
      const { received, release } = serveHeld();
      const session = new TmdbSession({ token: `t` });

      const all = Promise.all(
        [1, 2, 3].map(async () => session.fetch(url, GET))
      );
      await vi.advanceTimersByTimeAsync(0);
      expect(received).toHaveLength(3);
      release();
      release();
      release();
      await all;
    });

    it(`lets an aborted waiter give up its turn without using a slot`, async () => {
      const received = serve(() => HttpResponse.json({}));
      const session = new TmdbSession({
        token: `t`,
        rateLimit: { requests: 1, perMs: 1000 }
      });
      const controller = new AbortController();

      const first = session.fetch(url, GET);
      const cancelled = session.fetch(url, {
        ...GET,
        signal: controller.signal
      });
      const third = session.fetch(url, GET);
      await vi.advanceTimersByTimeAsync(0);
      expect(received).toHaveLength(1);

      controller.abort();
      await expect(cancelled).rejects.toMatchObject({ name: `AbortError` });

      // The cancelled request used no slot: the third goes out when the first's window ends, and nothing else is sent.
      await vi.advanceTimersByTimeAsync(1000);
      expect(received).toHaveLength(2);
      await Promise.all([first, third]);
    });

    it(`rejects nonsensical limits`, () => {
      const session = new TmdbSession();
      expect(() =>
        session.setRateLimit({ requests: 0, perMs: 1000 })
      ).toThrow();
      expect(() =>
        session.setRateLimit({ requests: 1.5, perMs: 1000 })
      ).toThrow();
      expect(() => session.setRateLimit({ requests: 1, perMs: 0 })).toThrow();
    });
  });

  describe(`retries`, () => {
    beforeEach(useFakeClock);

    it(`waits out a 429's Retry-After before trying again`, async () => {
      const received = serve((attempt) =>
        attempt === 0
          ? new HttpResponse(null, {
              status: 429,
              headers: { "Retry-After": `2` }
            })
          : HttpResponse.json({})
      );

      const pending = new TmdbSession({ token: `t` }).fetch(url, GET);
      await vi.advanceTimersByTimeAsync(1999);
      expect(received).toHaveLength(1);
      await vi.advanceTimersByTimeAsync(1);
      expect(received).toHaveLength(2);
      await expect(pending).resolves.toMatchObject({ status: 200 });
    });

    it(`backs off exponentially on 5xx when TMDB gives no Retry-After`, async () => {
      const received = serve((attempt) =>
        attempt < 2
          ? new HttpResponse(null, { status: attempt === 0 ? 503 : 502 })
          : HttpResponse.json({})
      );

      const pending = new TmdbSession({ token: `t` }).fetch(url, GET);
      await vi.advanceTimersByTimeAsync(499);
      expect(received).toHaveLength(1);
      await vi.advanceTimersByTimeAsync(1);
      expect(received).toHaveLength(2);
      await vi.advanceTimersByTimeAsync(999);
      expect(received).toHaveLength(2);
      await vi.advanceTimersByTimeAsync(1);
      expect(received).toHaveLength(3);
      await expect(pending).resolves.toMatchObject({ status: 200 });
    });

    it(`gives up after maxRetries and hands back the last response`, async () => {
      const received = serve(() => new HttpResponse(null, { status: 503 }));
      const session = new TmdbSession({ token: `t` });
      session.maxRetries = 2;

      const pending = session.fetch(url, GET);
      await vi.runAllTimersAsync();
      await expect(pending).resolves.toMatchObject({ status: 503 });
      expect(received).toHaveLength(3);
    });

    // A 404 for an unknown id or a 401 for a bad token fails identically on every attempt; retrying only wastes the rate budget.
    it(`does not retry client errors`, async () => {
      const received = serve(() => new HttpResponse(null, { status: 404 }));
      await expect(
        new TmdbSession({ token: `t` }).fetch(url, GET)
      ).resolves.toMatchObject({ status: 404 });
      expect(received).toHaveLength(1);
    });

    it(`retries network failures`, async () => {
      const received = serve((attempt) =>
        attempt === 0 ? HttpResponse.error() : HttpResponse.json({})
      );

      const pending = new TmdbSession({ token: `t` }).fetch(url, GET);
      await vi.runAllTimersAsync();
      await expect(pending).resolves.toMatchObject({ status: 200 });
      expect(received).toHaveLength(2);
    });

    it(`does not retry a request the caller aborted mid-flight`, async () => {
      const { received } = serveHeld();
      const controller = new AbortController();

      const pending = new TmdbSession({ token: `t` }).fetch(url, {
        ...GET,
        signal: controller.signal
      });
      await vi.advanceTimersByTimeAsync(0);
      expect(received).toHaveLength(1);
      controller.abort();
      await expect(pending).rejects.toMatchObject({ name: `AbortError` });
      await vi.runAllTimersAsync();
      expect(received).toHaveLength(1);
    });

    it(`stops backing off as soon as the caller aborts`, async () => {
      const received = serve(
        () =>
          new HttpResponse(null, {
            status: 429,
            headers: { "Retry-After": `60` }
          })
      );
      const controller = new AbortController();

      const pending = new TmdbSession({ token: `t` }).fetch(url, {
        ...GET,
        signal: controller.signal
      });
      await vi.advanceTimersByTimeAsync(0);
      controller.abort();
      await expect(pending).rejects.toMatchObject({ name: `AbortError` });
      expect(received).toHaveLength(1);
    });
  });
});
