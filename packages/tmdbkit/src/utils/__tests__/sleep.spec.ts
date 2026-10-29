import { describe, it, expect, vi, afterEach } from "vite-plus/test";
import { sleep } from "../sleep.js";

describe(`sleep`, () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it(`resolves after the given time`, async () => {
    vi.useFakeTimers();
    let done = false;
    const pending = (async (): Promise<void> => {
      await sleep(100);
      done = true;
    })();
    await vi.advanceTimersByTimeAsync(99);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(done).toBe(true);
  });

  // A cancelled scrape must not sit out a long rate-limit or Retry-After wait.
  it(`rejects as soon as its signal aborts, with an AbortError`, async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const pending = sleep(60_000, controller.signal);
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: `AbortError` });
  });

  it(`rejects immediately when the signal is already aborted`, async () => {
    await expect(sleep(60_000, AbortSignal.abort())).rejects.toMatchObject({
      name: `AbortError`
    });
  });

  it(`keeps a custom Error reason so callers can recognise their own abort`, async () => {
    const reason = new Error(`user cancelled`);
    await expect(sleep(10, AbortSignal.abort(reason))).rejects.toBe(reason);
  });
});
