import { tmdb } from "./TmdbSession.js";
import { isObject } from "../utils/isObject.js";
import { toCamelKeys } from "../utils/toCamelKeys.js";
import { toSnakeKeys } from "../utils/toSnakeKeys.js";

export type RequestBody = object | null | undefined;

/**
 * The HTTP methods the TMDB REST API uses, and the only ones the typed helpers
 * in `methods.ts` emit. The TMDB data API is read-only, so in practice only
 * `GET` is ever dispatched — the rest exist for completeness.
 */
export type RequestMethod = `GET` | `POST` | `PUT` | `PATCH` | `DELETE`;

/**
 * A structured error thrown when the TMDB API responds with a non-2xx status.
 * TMDB reports failures as `{ status_code, status_message }` in the body.
 */
export class TmdbApiError extends Error {
  readonly status: number;
  readonly statusCode: number;
  readonly statusMessage: string;

  constructor(status: number, statusCode: number, statusMessage: string) {
    super(`TMDB API error ${status} (${statusCode}): ${statusMessage}`);
    this.name = `TmdbApiError`;
    this.status = status;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }
}

export const request = async <T>(
  resource: URL,
  method: RequestMethod = `GET`,
  body?: RequestBody
): Promise<T> => {
  // Fail early with a clear message if no credentials are configured.
  if (!tmdb.hasAuth) {
    tmdb.resolveAuth(); // throws the canonical "No TMDB credentials" error
  }

  /**
   * Serialize the body. TMDB expects snake_case keys, so the (camelCase)
   * request object is converted before it is stringified.
   */
  const serializeBody = (): string | null | undefined => {
    if (!body) return body;
    try {
      return JSON.stringify(toSnakeKeys(body));
    } catch (cause) {
      console.error(`Received malformed request body:\n\n`, { body });
      throw new Error(`Failed to serialize request body!`, { cause });
    }
  };

  // Queue the request through the rate limiter.
  const res = await tmdb.queueRequest(resource, method, serializeBody());

  if (!res.ok) {
    // TMDB reports failures as `{ status_code, status_message }`.
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
    throw new TmdbApiError(res.status, statusCode, statusMessage);
  }

  // Return `void` on `204 No Content` responses.
  if (res.status === 204) {
    // @ts-expect-error
    return;
  }

  // TMDB is snake_case on the wire; convert to camelCase at the boundary so
  // the rest of the app is camelCase.
  return toCamelKeys(await res.json());
};
