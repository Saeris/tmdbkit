import type { GenericSchema, GenericSchemaAsync, InferOutput } from "valibot";
import { buildURL } from "./buildURL.js";
import { request } from "./request.js";
import type { RequestBody, RequestOptions } from "./request.js";
import type { RequestParams } from "./addParams.js";

/**
 * A typed fetcher. When the input schema is `null` the fetcher takes only the per-call {@link RequestOptions}; otherwise it takes the schema's output as its first argument and the options second.
 */
export type Fetcher<
  /** A schema to validate the input arguments of a fetch call */
  S extends GenericSchema | GenericSchemaAsync | null = null,
  /** The return value expected from the fetch call */
  R = void
> = S extends null
  ? (options?: RequestOptions) => Promise<R>
  : (
      config: InferOutput<NonNullable<S>>,
      options?: RequestOptions
    ) => Promise<R>;

/** Perform a `GET` request to the given resource, with optional query params. */
export const get = async <T = void>(
  url: string,
  params?: RequestParams,
  options?: RequestOptions
): Promise<T> => request(buildURL(url, params), `GET`, undefined, options);

/** Perform a `POST` request to the given resource with an optional body. */
export const post = async <T = void>(
  url: string,
  body?: RequestBody,
  options?: RequestOptions
): Promise<T> => request(buildURL(url), `POST`, body, options);

/** Perform a `PUT` request to the given resource with an optional body. */
export const put = async <T = void>(
  url: string,
  body?: RequestBody,
  options?: RequestOptions
): Promise<T> => request(buildURL(url), `PUT`, body, options);

/** Perform a `PATCH` request to the given resource with an optional body. */
export const patch = async <T = void>(
  url: string,
  body?: RequestBody,
  options?: RequestOptions
): Promise<T> => request(buildURL(url), `PATCH`, body, options);

/** Perform a `DELETE` request to the given resource. */
export const remove = async <T = void>(
  url: string,
  options?: RequestOptions
): Promise<T> => request(buildURL(url), `DELETE`, undefined, options);
