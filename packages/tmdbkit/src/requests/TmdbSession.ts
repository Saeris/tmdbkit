import { sleep } from "../utils/sleep.js";
import type { RequestMethod } from "./request.js";

/** Base URL for the TMDB v3 REST API. */
export const endpoint = "https://api.themoviedb.org/3/" as const;

/**
 * Environment variable read for the **API Read Access Token** when no token
 * has been set explicitly. The token is sent as `Authorization: Bearer <token>`
 * and works against both the v3 and v4 endpoints.
 */
export const TOKEN_ENV_VAR = "TMDB_API_TOKEN" as const;

/**
 * Environment variable read for the legacy **v3 API key** when no bearer token
 * is available. Sent as the `?api_key=<key>` query parameter.
 */
export const API_KEY_ENV_VAR = "TMDB_API_KEY" as const;

/**
 * The API Read Access Token from the environment, or `null` when unavailable.
 * `process` is absent on some runtimes (bare Cloudflare Workers), so the
 * lookup is guarded rather than read directly.
 */
export const tokenFromEnv = (): string | null => {
  if (typeof process === `undefined`) return null;
  const token = process.env[TOKEN_ENV_VAR];
  return token === undefined || token === `` ? null : token;
};

/** The legacy v3 API key from the environment, or `null` when unavailable. */
export const apiKeyFromEnv = (): string | null => {
  if (typeof process === `undefined`) return null;
  const key = process.env[API_KEY_ENV_VAR];
  return key === undefined || key === `` ? null : key;
};

interface QueuedRequest {
  resource: URL;
  method: RequestMethod;
  body?: string | null;
  resolve: (value: Response) => void;
  reject: (error: Error) => void;
}

/**
 * The resolved credentials for a single request. A bearer token is preferred
 * (sent as the `Authorization` header); when only a v3 API key is available it
 * is appended to the query string instead.
 */
interface ResolvedAuth {
  authorization?: string;
  apiKey?: string;
}

/**
 * A session against the TMDB API. Holds the credentials (an API Read Access
 * Token and/or a legacy v3 API key) and serializes requests through a client
 * rate limiter that respects TMDB's documented limit of 100 requests per 10
 * seconds per IP, retrying on `429 Too Many Requests`.
 *
 * Unlike a Discord session there is no token exchange or refresh: the API Read
 * Access Token is used directly, and there is no per-user scoping or
 * audit-log machinery because the TMDB data API is read-only.
 */
export class TmdbSession {
  readonly endpoint: string = endpoint;
  /** Maximum `429` retries before the raw response is surfaced. */
  readonly maxRetries: number = 5;

  #bearerToken: string | null = null;
  #apiKey: string | null = null;

  // Client-side rate limit: 100 requests per 10 seconds.
  #limit = 100;
  #window = 10_000; // 10 seconds in ms
  #requestTimestamps: number[] = [];

  #requestQueue: QueuedRequest[] = [];
  #processingQueue = false;

  constructor(options?: { token?: string; apiKey?: string }) {
    if (options?.token) this.setToken(options.token);
    if (options?.apiKey) this.setApiKey(options.apiKey);
  }

  /**
   * Set the **API Read Access Token** (the bare token — no `Bearer ` prefix;
   * it is added for you). This is the preferred credential and works against
   * both the v3 and v4 endpoints.
   */
  setToken = (token: string): this => {
    if (token.length === 0) {
      throw new Error(`Must provide a non-empty string to set the API token`);
    }
    this.#bearerToken = token;
    return this;
  };

  /**
   * Set the legacy **v3 API key**. Used only when no bearer token is present,
   * sent as the `?api_key=` query parameter.
   */
  setApiKey = (key: string): this => {
    if (key.length === 0) {
      throw new Error(`Must provide a non-empty string to set the API key`);
    }
    this.#apiKey = key;
    return this;
  };

  /** Clear all credentials and rate-limit state. */
  clearSession = (): this => {
    this.#bearerToken = null;
    this.#apiKey = null;
    this.#requestTimestamps = [];
    this.#requestQueue = [];
    return this;
  };

  /**
   * Whether a request can authenticate right now — either a bearer token or a
   * v3 API key is set (explicitly or via the environment).
   */
  get hasAuth(): boolean {
    return (
      this.#bearerToken !== null ||
      tokenFromEnv() !== null ||
      this.#apiKey !== null ||
      apiKeyFromEnv() !== null
    );
  }

  /**
   * Resolve the credentials to use for a request. An explicit bearer token
   * wins over the environment, and a bearer token wins over a v3 API key.
   *
   * @throws When no credential is available at all.
   */
  resolveAuth = (): ResolvedAuth => {
    const bearer = this.#bearerToken ?? tokenFromEnv();
    if (bearer) return { authorization: `Bearer ${bearer}` };

    const key = this.#apiKey ?? apiKeyFromEnv();
    if (key) return { apiKey: key };

    throw new Error(
      `No TMDB credentials are set, so the request cannot be authorized. Call tmdb.setToken("<API Read Access Token>"), or set ${TOKEN_ENV_VAR} (preferred) / ${API_KEY_ENV_VAR} in the environment.`
    );
  };

  /**
   * Queue a request to be processed with rate limiting.
   */
  queueRequest = async (
    resource: URL,
    method: RequestMethod,
    body?: string | null
  ): Promise<Response> => {
    return new Promise((resolve, reject) => {
      this.#requestQueue.push({ resource, method, body, resolve, reject });
      void this.#processQueue();
    });
  };

  /**
   * Process the request queue, waiting out the client rate limit before each
   * request is dispatched.
   */
  #processQueue = async (): Promise<void> => {
    if (this.#processingQueue) return;
    this.#processingQueue = true;

    while (this.#requestQueue.length > 0) {
      await this.#enforceRateLimit();

      const request = this.#requestQueue.shift();
      if (typeof request === `undefined`) break;

      try {
        const response = await this.#executeRequest(request);
        request.resolve(response);
      } catch (error) {
        if (error instanceof Error) request.reject(error);
      }
    }

    this.#processingQueue = false;

    // A request may have been enqueued while we awaited the last one.
    if (this.#requestQueue.length > 0) void this.#processQueue();
  };

  /**
   * Wait until dispatching another request would stay under the 100 req / 10s
   * limit, using a sliding window of dispatch timestamps.
   */
  #enforceRateLimit = async (): Promise<void> => {
    const now = Date.now();
    this.#requestTimestamps = this.#requestTimestamps.filter(
      (timestamp) => now - timestamp < this.#window
    );

    if (this.#requestTimestamps.length >= this.#limit) {
      const oldest = this.#requestTimestamps[0];
      const waitTime = this.#window - (now - oldest);
      if (waitTime > 0) await sleep(waitTime);
    }
  };

  /**
   * Execute a single request, attaching credentials and retrying on `429`.
   */
  #executeRequest = async (
    request: QueuedRequest,
    retryCount = 0
  ): Promise<Response> => {
    this.#requestTimestamps.push(Date.now());

    const auth = this.resolveAuth();
    const headers: HeadersInit = {};
    if (auth.authorization) headers.Authorization = auth.authorization;
    if (auth.apiKey) {
      request.resource.searchParams.set(`api_key`, auth.apiKey);
    }
    if (request.body) headers[`Content-Type`] = `application/json`;

    const response = await fetch(request.resource.toString(), {
      method: request.method,
      body: request.body,
      headers
    });

    // Handle 429 Too Many Requests: wait out Retry-After and retry.
    if (response.status === 429) {
      if (retryCount >= this.maxRetries) {
        console.error(
          `Max retries (${this.maxRetries}) exceeded for ${request.resource}`
        );
        return response;
      }

      const retryAfter = response.headers.get(`Retry-After`) ?? `1`;
      await sleep(parseFloat(retryAfter) * 1000);
      return this.#executeRequest(request, retryCount + 1);
    }

    return response;
  };

  /** Current queue size (useful for monitoring). */
  getQueueSize = (): number => this.#requestQueue.length;
}

/** Shared session singleton. */
export const tmdb: TmdbSession = new TmdbSession();
