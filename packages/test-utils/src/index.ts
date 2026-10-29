import { http } from "msw";
import { type SetupServer, setupServer } from "msw/node";
import { Valimock, type ValimockOptions } from "valimock";
import { getTitle } from "valibot";
import type {
  GenericPipeItem,
  GenericPipeItemAsync,
  GenericSchema,
  GenericSchemaAsync,
  InferOutput,
  SchemaWithPipe,
  SchemaWithPipeAsync,
  TitleAction
} from "valibot";

// Structural type matching TmdbSession. Inlined rather than imported so the
// test harness doesn't create an import cycle with the request layer. Any
// class satisfying these two members is assignable here.
interface TmdbSessionLike {
  endpoint: string;
  setToken(token: string): unknown;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Pick<Partial<T>, K>;

type MaybeReadonly<TValue> = TValue | Readonly<TValue>;

type Schema = GenericSchema | GenericSchemaAsync;

type SchemaMaybeWithTitle =
  | Schema
  | SchemaWithPipe<
      MaybeReadonly<
        [
          GenericSchema,
          ...Array<GenericPipeItem | TitleAction<unknown, string>>
        ]
      >
    >
  | SchemaWithPipeAsync<
      MaybeReadonly<
        [
          Schema,
          ...Array<
            | GenericPipeItem
            | GenericPipeItemAsync
            | TitleAction<unknown, string>
          >
        ]
      >
    >;

type GenericSchemaWithPipe<TSchema extends Schema> =
  TSchema extends GenericSchema
    ? SchemaWithPipe<MaybeReadonly<[TSchema, ...GenericPipeItem[]]>>
    : SchemaWithPipeAsync<
        MaybeReadonly<
          [TSchema, ...Array<GenericPipeItem | GenericPipeItemAsync>]
        >
      >;

type SchemaMaybeWithPipe<TSchema extends Schema> = Optional<
  TSchema extends GenericSchema
    ? SchemaWithPipe<MaybeReadonly<[TSchema, ...GenericPipeItem[]]>>
    : SchemaWithPipeAsync<
        MaybeReadonly<
          [TSchema, ...Array<GenericPipeItem | GenericPipeItemAsync>]
        >
      >,
  `pipe`
>;

type CustomMock = (
  schema: SchemaMaybeWithPipe<SchemaMaybeWithTitle>,
  options?: ValimockOptions
) => unknown;

type CreateMockReturn<
  TConfig extends Schema | null,
  TResult extends Schema | null
> = TConfig extends Schema
  ? TResult extends Schema
    ? { config: InferOutput<TConfig>; expected: InferOutput<TResult> }
    : { config: InferOutput<TConfig>; expected: null }
  : TResult extends Schema
    ? { config: null; expected: InferOutput<TResult> }
    : { config: null; expected: null };

/**
 * A test harness that pairs an msw request interceptor with Valimock schema
 * mocking. For each operation it generates a random, schema-valid `config`
 * (input) and `expected` (output), registers an msw handler that returns the
 * serialized `expected` for the given path, and hands both back so a spec can
 * assert the validated round-trip.
 *
 * Adapted from discordkit's MockUtils. The Discord-specific machinery
 * (snowflake ids, bitfield flags) is dropped because the TMDB data API has
 * neither; everything else — the msw lifecycle, Valimock integration, and the
 * JSON round-trip of `expected` — is kept verbatim.
 */
export class MockUtils {
  #customMocks = new Map<
    SchemaMaybeWithPipe<SchemaMaybeWithTitle>,
    CustomMock
  >();

  #session: TmdbSessionLike;
  #msw: SetupServer = setupServer();

  static hasPipe = <TSchema extends Schema>(
    val: SchemaMaybeWithPipe<TSchema>
  ): val is GenericSchemaWithPipe<TSchema> =>
    `pipe` in val && Array.isArray(val.pipe);

  static titlesMatch = (
    schemaA: SchemaMaybeWithPipe<SchemaMaybeWithTitle>,
    schemaB: SchemaMaybeWithPipe<SchemaMaybeWithTitle>
  ): schemaA is typeof schemaB =>
    this.hasPipe(schemaA) &&
    this.hasPipe(schemaB) &&
    getTitle(schemaA) === getTitle(schemaB);

  constructor(
    tmdb: TmdbSessionLike,
    options?: {
      token?: string;
      customMocks?: Array<
        [matcher: SchemaMaybeWithPipe<SchemaMaybeWithTitle>, mockFn: CustomMock]
      >;
      debug?: boolean;
    }
  ) {
    this.#session = tmdb;
    this.#session.setToken(options?.token ?? `test-token`);
    if (options?.customMocks) {
      this.#customMocks = new Map(options.customMocks);
    }
    if (options?.debug) {
      this.#enableDebugging();
    }
    this.#msw.listen({ onUnhandledRequest: `error` });
  }

  #enableDebugging = (): void => {
    this.#msw.events.on(`request:start`, ({ request }) => {
      console.log(`Outgoing request: ${request.method} ${request.url}`);
    });
    this.#msw.events.on(`request:match`, ({ request }) => {
      console.log(`Matched request: ${request.method} ${request.url}`);
    });
    this.#msw.events.on(`response:mocked`, ({ request, response }) => {
      if (response.status !== 200) {
        console.log(
          `Mocked request: ${request.method} ${request.url} received ${response.status} ${response.statusText}`
        );
      }
    });
  };

  setMock = (schema: Schema, mockFn: CustomMock): this => {
    this.#customMocks.set(schema, mockFn);
    return this;
  };

  schema = <TSchema extends Schema>(
    schema: TSchema,
    opts?: Partial<ValimockOptions>
  ): InferOutput<TSchema> =>
    new Valimock({
      ...opts,
      customMocks: {
        custom: (reference): unknown => {
          // Iterate through the provided matchers and return the
          // first valid match
          for (const [target, mockfn] of this.#customMocks) {
            if (MockUtils.titlesMatch(reference, target)) {
              return mockfn(reference);
            }
          }
          throw new Error(
            `Unhandled custom schema: ${getTitle(reference) ?? reference.expects}`
          );
        }
      }
    }).mock(schema);

  // oxlint-disable-next-line eslint/class-methods-use-this
  #serialize = (val: unknown): string | undefined => {
    try {
      return JSON.stringify(val);
    } catch (err) {
      console.error({ val });
      throw new Error(`Failed to serialize value`, { cause: err });
    }
  };

  #createMock(type: keyof typeof http) {
    return <TConfig extends Schema, TResult extends Schema>(
      path: string,
      configSchema?: TConfig | null,
      resultSchema?: TResult | null,
      opts?: Partial<ValimockOptions>
    ): CreateMockReturn<TConfig, TResult> => {
      const config = configSchema ? this.schema(configSchema, opts) : null;
      const mocked = resultSchema ? this.schema(resultSchema, opts) : null;
      const result = this.#serialize(mocked);
      // Round-trip `expected` through JSON so it matches what the fetch
      // response will actually look like on the wire. Without this, the
      // in-memory mock retains `{ field: undefined }` entries that
      // JSON.stringify drops from the response body — and `toStrictEqual`
      // (correctly) distinguishes `{ field: undefined }` from `{}`,
      // producing flakes on any spec with `exact_optional` fields.
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      const expected = result === undefined ? mocked : JSON.parse(result);

      try {
        this.#msw.use(
          http[type](
            new URL(path.replace(/^\//, ``), this.#session.endpoint).href,
            () => {
              try {
                const response = new Response(result ?? null, {
                  status: typeof result === `undefined` ? 204 : undefined,
                  headers: {
                    "Content-Type": `application/json`
                  }
                });
                return response;
              } catch (err) {
                throw new Error(`Failed to create Response!`, { cause: err });
              }
            }
          )
        );
      } catch (err) {
        throw new Error(`Failed to mock request!`, { cause: err });
      }

      const returnValue = { config, expected };
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return returnValue as CreateMockReturn<TConfig, TResult>;
    };
  }

  reset = (): void => {
    this.#msw.resetHandlers();
    this.#msw.close();
    this.#msw.listen({ onUnhandledRequest: `error` });
  };

  request = {
    delete: this.#createMock(`delete`),
    get: this.#createMock(`get`),
    patch: this.#createMock(`patch`),
    post: this.#createMock(`post`),
    put: this.#createMock(`put`)
  };

  [Symbol.dispose](): void {
    this.#msw.resetHandlers();
    this.#msw.close();
  }
}
