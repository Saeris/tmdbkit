import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _tvAlternativeTitlesSchema = v.object({
  id: integer,
  results: v.array(
    v.object({
      /** ISO 3166-1 code of the region that uses the title. */
      iso_3166_1: v.string(),
      title: v.string(),
      /** What kind of title it is, or `""`. */
      type: v.string()
    })
  )
});

export interface TvAlternativeTitles extends v.InferOutput<
  typeof _tvAlternativeTitlesSchema
> {}

/**
 * ### TV Alternative Titles
 *
 * The other titles a TV series is known by, per region (`getTvSeriesAlternativeTitles`). Same data as a movie's, but under `results` rather than `titles`.
 */
export const tvAlternativeTitlesSchema = schema<TvAlternativeTitles>(
  _tvAlternativeTitlesSchema
);
