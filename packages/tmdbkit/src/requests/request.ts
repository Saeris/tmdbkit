import { tmdb } from "./TmdbSession.js";
import { isObject } from "../utils/isObject.js";
import { toCamelKeys } from "../utils/toCamelKeys.js";
import { toSnakeKeys } from "../utils/toSnakeKeys.js";

export type RequestBody = object | null | undefined;

/**
 * The HTTP methods the TMDB REST API uses, and the only ones the typed helpers in `methods.ts` emit. Most of TMDB is read-only `GET`; the account, list, rating and session endpoints also `POST` and `DELETE`.
 */
export type RequestMethod = `GET` | `POST` | `PUT` | `PATCH` | `DELETE`;

/**
 * Per-call options a {@link Fetcher} accepts as its last argument and forwards to the request layer.
 */
export interface RequestOptions {
  /** Abort the request: while it waits for a rate-limit slot, while it is in flight, or while it backs off before a retry. */
  signal?: AbortSignal;
}

/**
 * A structured error thrown when the TMDB API responds with a non-2xx status. TMDB reports failures as `{ status_code, status_message }` in the body; `statusCode` is `0` when the body didn't carry one.
 *
 * The message names the method and path but never the query string, which can hold a v3 `api_key`.
 */
export class TmdbApiError extends Error {
  readonly status: number;
  readonly statusCode: number;
  readonly statusMessage: string;

  constructor(
    status: number,
    statusCode: number,
    statusMessage: string,
    request?: { method: RequestMethod; path: string }
  ) {
    const where = request ? ` for ${request.method} ${request.path}` : ``;
    super(`TMDB API error ${status} (${statusCode})${where}: ${statusMessage}`);
    this.name = `TmdbApiError`;
    this.status = status;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }
}

export const request = async <T>(
  resource: URL,
  method: RequestMethod = `GET`,
  body?: RequestBody,
  options?: RequestOptions
): Promise<T> => {
  // Fail early with a clear message if no credentials are configured.
  if (!tmdb.hasAuth) {
    tmdb.resolveAuth(); // throws the canonical "No TMDB credentials" error
  }

  /**
   * Serialize the body. TMDB expects snake_case keys, so the (camelCase) request object is converted before it is stringified.
   */
  const serializeBody = (): string | null | undefined => {
    if (!body) return body;
    try {
      return JSON.stringify(toSnakeKeys(body));
    } catch (cause) {
      throw new Error(`Failed to serialize request body!`, { cause });
    }
  };

  const res = await tmdb.fetch(resource, {
    method,
    body: serializeBody(),
    signal: options?.signal
  });

  if (!res.ok) {
    let statusCode = 0;
    let statusMessage = res.statusText;
    try {
      const err: unknown = await res.json();
      if (isObject(err)) {
        if (typeof err.status_code === `number`) statusCode = err.status_code;
        if (typeof err.status_message === `string`) {
          statusMessage = err.status_message;
        }
      }
    } catch {
      // Body was not JSON — fall back to the status text.
    }
    throw new TmdbApiError(res.status, statusCode, statusMessage, {
      method,
      path: resource.pathname
    });
  }

  // Return `void` on `204 No Content` responses.
  if (res.status === 204) {
    // @ts-expect-error
    return;
  }

  // TMDB is snake_case on the wire; convert to camelCase at the boundary so the rest of the app is camelCase.
  return toCamelKeys(await res.json());
};
