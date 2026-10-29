import {
  type GenericSchema,
  type GenericSchemaAsync,
  isOfKind,
  safeParseAsync,
  summarize
} from "valibot";
import type { Fetcher } from "./methods.js";

/**
 * Given a {@link Fetcher} and its input and output Valibot schemas, return a new {@link Fetcher} that validates its input before the request is sent and its result before it resolves. Useful wherever the input comes from outside your app, or wherever you want a TMDB response shape change to fail loudly at the boundary.
 *
 * The resolved value is the fetched value itself (as in discordkit): tmdbkit's schemas have no transforms, so the parsed and fetched values are the same.
 *
 * @__NO_SIDE_EFFECTS__
 */
export const toValidated = <
  S extends GenericSchema | GenericSchemaAsync | null = null,
  R = void
>(
  fn: Fetcher<S, R>,
  input?: S | null,
  output?: GenericSchema<unknown, R> | GenericSchemaAsync<unknown, R>
): Fetcher<S, R> =>
  new Proxy<Fetcher<S, R>>(fn, {
    async apply(target, _, args: unknown[]): Promise<R> {
      // Validate the fetcher args before fetching. Fetchers without an input schema take only the options.
      if (input && isOfKind(`schema`, input)) {
        const { issues } = await safeParseAsync(input, args[0]);
        if (issues) {
          throw new Error(
            `Failed to parse input schema: ${input.reference.name}\n\n${summarize(issues)}`
          );
        }
      }

      // Forward every argument, including the per-call options (signal). `Fetcher<S, R>` is a conditional type, so the proxy target can't be called without erasing it first; the result is `R` by the fetcher's own signature.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const call = target as unknown as (
        ...rest: unknown[]
      ) => Promise<unknown>;
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const result = (await call(...args)) as R;

      // Validate the result of the fetch call before returning.
      if (output && isOfKind(`schema`, output)) {
        const { issues } = await safeParseAsync(output, result);
        if (issues) {
          throw new Error(
            `Failed to parse output schema: ${output.reference.name}\n\n${summarize(issues)}`
          );
        }
      }

      return result;
    }
  });
