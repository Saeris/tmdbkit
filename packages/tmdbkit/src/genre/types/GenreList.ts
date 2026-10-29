import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { genreSchema } from "../../types/Genre.js";

const _genreListSchema = v.object({ genres: v.array(genreSchema) });

export interface GenreList extends v.InferOutput<typeof _genreListSchema> {}

/**
 * ### Genre List
 *
 * Every movie or TV genre (`getMovieGenres`, `getTvGenres`), which list items reference by `genreIds`.
 */
export const genreListSchema = schema<GenreList>(_genreListSchema);
