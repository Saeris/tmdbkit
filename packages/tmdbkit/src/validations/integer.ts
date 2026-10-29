import * as v from "valibot";

/** A whole number. TMDB's ids, counts, sizes and ordinals are integers on the wire; validating that also keeps generated mocks realistic. */
export const integer = v.pipe(v.number(), v.integer());

/** A TMDB numeric id: a positive integer. */
export const tmdbId = v.pipe(v.number(), v.integer(), v.minValue(1));

/** A season or episode number. Season `0` holds a show's specials. */
export const ordinal = v.pipe(v.number(), v.integer(), v.minValue(0));
