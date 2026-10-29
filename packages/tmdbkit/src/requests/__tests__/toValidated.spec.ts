import { describe, it, expect, vi } from "vite-plus/test";
import {
  pipe,
  string,
  minLength,
  maxLength,
  number,
  minValue,
  maxValue,
  type InferOutput
} from "valibot";
import { toValidated } from "../toValidated.js";
import type { RequestOptions } from "../request.js";

describe(`toValidated`, () => {
  describe(`with both input and output schemas`, () => {
    const input = pipe(string(), minLength(1), maxLength(5));
    const output = pipe(number(), minValue(1), maxValue(5));
    const wrap = async (i: string, o: unknown): Promise<unknown> =>
      toValidated(
        async (_: InferOutput<typeof input>) => Promise.resolve(o),
        input,
        output
      )(i);

    it(`resolves when both input and output satisfy their schemas`, async () => {
      await expect(wrap(`valid`, 5)).resolves.toBe(5);
    });

    it(`rejects when input fails its schema`, async () => {
      await expect(wrap(`too-long`, 5)).rejects.toThrow(/input schema/);
    });

    it(`rejects when output fails its schema`, async () => {
      await expect(wrap(`valid`, 10)).rejects.toThrow(/output schema/);
    });
  });

  // Validating input is only worth anything if a bad input never reaches TMDB.
  it(`does not call the fetcher when the input is invalid`, async () => {
    const fetcher = vi.fn<(id: string) => Promise<number>>(async (_: string) =>
      Promise.resolve(1)
    );
    await expect(
      toValidated(fetcher, pipe(string(), minLength(3)), number())(`ab`)
    ).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });

  // Cancellation (mediameta's scrape tasks) depends on the signal reaching the request layer through the wrapper.
  it(`forwards the per-call options to the fetcher`, async () => {
    const fetcher = vi.fn<
      (id: string, options?: RequestOptions) => Promise<number>
    >(async (_: string, options?: RequestOptions) =>
      Promise.resolve(options?.signal?.aborted === false ? 1 : 0)
    );
    const { signal } = new AbortController();
    await expect(
      toValidated(fetcher, string(), number())(`id`, { signal })
    ).resolves.toBe(1);
    expect(fetcher).toHaveBeenCalledWith(`id`, { signal });
  });

  describe(`with only an input schema`, () => {
    const input = pipe(string(), minLength(3));
    const wrap = async (i: string): Promise<void> =>
      toValidated(async (_: string) => Promise.resolve(undefined), input)(i);

    it(`resolves when input satisfies its schema`, async () => {
      await expect(wrap(`abc`)).resolves.toBeUndefined();
    });

    it(`rejects when input fails its schema`, async () => {
      await expect(wrap(`ab`)).rejects.toThrow();
    });
  });

  describe(`with only an output schema`, () => {
    const output = pipe(number(), minValue(0));
    const wrap = async (o: unknown): Promise<unknown> =>
      toValidated(async () => Promise.resolve(o), null, output)();

    it(`resolves when output satisfies its schema`, async () => {
      await expect(wrap(42)).resolves.toBe(42);
    });

    it(`rejects when output fails its schema`, async () => {
      await expect(wrap(-1)).rejects.toThrow();
    });
  });

  describe(`with no schemas`, () => {
    it(`acts as a passthrough proxy`, async () => {
      const sentinel = Symbol(`sentinel`);
      const fn = toValidated(async () => sentinel);
      await expect(fn()).resolves.toBe(sentinel);
    });
  });
});
