import * as v from "valibot";
import { describe, it, expect } from "vite-plus/test";
import { fixtures } from "#fixtures";
import { configurationDetailsSchema } from "../types/ConfigurationDetails.js";
import { imageBaseUrl, imageSizes, imageUrl } from "../imageUrl.js";

describe(`imageUrl`, () => {
  it(`joins the base, the size and the file path`, () => {
    expect(imageUrl(`/abc.jpg`, `w500`)).toBe(
      `https://image.tmdb.org/t/p/w500/abc.jpg`
    );
  });

  it(`defaults to the original size`, () => {
    expect(imageUrl(`/abc.jpg`)).toBe(
      `https://image.tmdb.org/t/p/original/abc.jpg`
    );
  });

  // Schemas type image paths as nullable; passing one straight through must not produce ".../w500null".
  it(`gives null for a missing image`, () => {
    expect(imageUrl(null, `w500`)).toBeNull();
  });

  it(`uses another base when given one`, () => {
    expect(imageUrl(`/abc.jpg`, `w92`, `https://cdn.test/`)).toBe(
      `https://cdn.test/w92/abc.jpg`
    );
  });
});

// The constants are a snapshot of TMDB's configuration. If a re-recording shows TMDB changed its host or sizes, this fails until they're updated.
describe(`imageUrl constants`, () => {
  const [{ body }] = fixtures(`configuration-details`);
  const { images } = v.parse(configurationDetailsSchema, body);

  it(`match the recorded image host`, () => {
    expect(imageBaseUrl).toBe(images.secureBaseUrl);
  });

  it(`match the recorded sizes for every kind of image`, () => {
    expect(imageSizes).toStrictEqual({
      backdrop: images.backdropSizes,
      logo: images.logoSizes,
      poster: images.posterSizes,
      profile: images.profileSizes,
      still: images.stillSizes
    });
  });
});
