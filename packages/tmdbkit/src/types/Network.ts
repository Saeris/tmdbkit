import * as v from "valibot";
import { schema } from "../validations/schema.js";

export const networkEntries = {
  /** the network id */
  id: v.number(),
  /** the path of the network logo */
  logoPath: v.nullish(v.string()),
  /** the name of the network */
  name: v.string(),
  /** the ISO 3166-1 code for the country the network is based in */
  originCountry: v.nullish(v.string())
} as const;

const _networkSchema = v.object(networkEntries);

export interface Network extends v.InferOutput<typeof _networkSchema> {}

/**
 * ### [Network](https://www.themoviedb.org/documentation/api/networks)
 *
 * A TV network that broadcasts a TV show.
 */
export const networkSchema = schema<Network>(_networkSchema);
