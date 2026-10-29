import * as v from "valibot";
import { integer } from "../validations/integer.js";

/**
 * One translation of a title or person: the language and region it's in, plus the translated fields in `data`, whose shape depends on what was translated. Untranslated fields are `""`.
 *
 * @typeParam T - the schema of the translated fields
 */
export const translation = <T extends v.GenericSchema>(
  data: T
): v.GenericSchema<Translation<v.InferOutput<T>>> =>
  // `v.object` infers `data` as `InferInput<T>` on the input side, which TypeScript can't equate with the published `InferOutput<T>`; tmdbkit schemas have no transforms, so they are the same type (see validations/schema.ts).
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  v.object({
    /** ISO 3166-1 region code. */
    iso_3166_1: v.string(),
    /** ISO 639-1 language code. */
    iso_639_1: v.string(),
    /** The language's name in itself. */
    name: v.string(),
    englishName: v.string(),
    data
  }) as unknown as v.GenericSchema<Translation<v.InferOutput<T>>>;

/** The type of one {@link translation}. */
export interface Translation<T> {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  englishName: string;
  data: T;
}

/**
 * The `{ id, translations }` response every translations endpoint returns.
 *
 * @typeParam T - the schema of the translated fields
 */
export const translations = <T extends v.GenericSchema>(
  data: T
): v.GenericSchema<Translations<v.InferOutput<T>>> =>
  v.object({ id: integer, translations: v.array(translation(data)) });

/** The type of a {@link translations} response. */
export interface Translations<T> {
  id: number;
  translations: Array<Translation<T>>;
}
