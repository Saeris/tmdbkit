import * as v from "valibot";
import { schema } from "../../validations/schema.js";
import { integer } from "../../validations/integer.js";

const _screenedTheatricallySchema = v.object({
  id: integer,
  results: v.array(
    v.object({
      /** The episode's id. */
      id: integer,
      episodeNumber: integer,
      seasonNumber: integer
    })
  )
});

export interface ScreenedTheatrically extends v.InferOutput<
  typeof _screenedTheatricallySchema
> {}

/**
 * ### Screened Theatrically
 *
 * The episodes of a TV series that were shown in cinemas (`getTvSeriesScreenedTheatrically`).
 */
export const screenedTheatricallySchema = schema<ScreenedTheatrically>(
  _screenedTheatricallySchema
);
