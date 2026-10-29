import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _movieAlternativeTitlesSchema = v.object({
  id: integer,
  titles: v.array(
    v.object({
      /** ISO 3166-1 code of the region that uses the title. */
      iso_3166_1: v.string(),
      title: v.string(),
      /** What kind of title it is (e.g. `working title`), or `""`. */
      type: v.string()
    })
  )
});

export interface MovieAlternativeTitles extends v.InferOutput<
  typeof _movieAlternativeTitlesSchema
> {}

/**
 * ### Movie Alternative Titles
 *
 * The other titles a movie is known by, per region (`getMovieAlternativeTitles`).
 */
export const movieAlternativeTitlesSchema = schema<MovieAlternativeTitles>(
  _movieAlternativeTitlesSchema
);
