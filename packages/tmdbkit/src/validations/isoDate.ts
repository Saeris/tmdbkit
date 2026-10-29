import * as v from "valibot";

/** A `YYYY-MM-DD` date, as TMDB's date query params expect. */
export const isoDate = v.pipe(v.string(), v.isoDate());
