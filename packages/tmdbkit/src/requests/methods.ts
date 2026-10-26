import type { GenericSchema, GenericSchemaAsync, InferOutput } from "valibot";
import { buildURL } from "./buildURL.js";
import { request } from "./request.js";
import type { RequestParams } from "./addParams.js";

/**
 * A typed fetcher. When the input schema is `null` the fetcher takes no
 * config; otherwise it takes the schema's output as its single argument.
 */
export type Fetcher<
  S extends GenericSchema | GenericSchemaAsync | null = null,
  R = void
> = S extends null
  ? () => Promise<R>
  : (config: InferOutput<NonNullable<S>>) => Promise<R>;

/**
 * Perform a `GET` request to the given resource, with optional query params.
 */
export const get = async <T = void>(
  url: string,
  params?: RequestParams,
  base?: string
): Promise<T> => request(buildURL(url, params, base), `GET`);

/**
 * Perform a `POST` request to the given resource with an optional body.
 */
export const post = async <T = void>(
  url: string,
  body?: object,
  base?: string
): Promise<T> => request(buildURL(url, undefined, base), `POST`, body);

/**
 * Perform a `PUT` request to the given resource with an optional body.
 */
export const put = async <T = void>(
  url: string,
  body?: object,
  base?: string
): Promise<T> => request(buildURL(url, undefined, base), `PUT`, body);

/**
 * Perform a `PATCH` request to the given resource with an optional body.
 */
export const patch = async <T = void>(
  url: string,
  body?: object,
  base?: string
): Promise<T> => request(buildURL(url, undefined, base), `PATCH`, body);

/**
 * Perform a `DELETE` request to the given resource.
 */
export const remove = async <T = void>(
  url: string,
  base?: string
): Promise<T> => request(buildURL(url, undefined, base), `DELETE`);
