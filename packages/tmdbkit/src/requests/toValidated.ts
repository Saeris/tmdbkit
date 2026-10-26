import {
  type GenericSchema,
  type GenericSchemaAsync,
  type InferInput,
  type InferOutput,
  isOfKind,
  safeParseAsync,
  summarize
} from "valibot";

/**
 * Wrap a fetcher so its input and output are validated with valibot schemas.
 * The returned proxy parses the input before calling the target and parses the
 * result before resolving, throwing a readable error on either failure.
 *
 * @__NO_SIDE_EFFECTS__
 */
export const toValidated = <
  S extends GenericSchema | GenericSchemaAsync | null = null,
  O extends GenericSchema | GenericSchemaAsync | null = null,
  R = void
>(
  fn: (config: InferInput<NonNullable<S>>, options?: unknown) => Promise<R>,
  input?: S | null,
  output?: O | null
): ((
  config: InferInput<NonNullable<S>>
) => Promise<InferOutput<NonNullable<O>>>) =>
  new Proxy(fn, {
    apply: async (target, _thisArg, [config, options]) => {
      // Validate the fetcher args before fetching.
      if (input && isOfKind(`schema`, input)) {
        const { issues } = await safeParseAsync(input, config);
        if (issues) {
          throw new Error(
            `Failed to parse input schema: ${input.reference.name}\n\n${summarize(issues)}`
          );
        }
      }

      const result = await target(config, options);

      // Validate the result of the fetch call before returning.
      if (output && isOfKind(`schema`, output)) {
        const { issues } = await safeParseAsync(output, result);
        if (issues) {
          throw new Error(
            `Failed to parse output schema: ${output.reference.name}\n\n${summarize(issues)}`
          );
        }
      }

      return result as InferOutput<NonNullable<O>>;
    }
  });
