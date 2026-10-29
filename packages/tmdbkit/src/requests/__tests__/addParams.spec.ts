import { describe, it, expect } from "vite-plus/test";
import { addParams } from "../addParams.js";
import { buildURL } from "../buildURL.js";

const query = (params: Parameters<typeof addParams>[1]): string =>
  decodeURIComponent(
    addParams(new URL(`https://example.test/`), params).search
  );

describe(`addParams`, () => {
  it(`converts camelCase keys to TMDB's snake_case`, () => {
    expect(query({ includeAdult: true, primaryReleaseYear: 1999 })).toBe(
      `?include_adult=true&primary_release_year=1999`
    );
  });

  // TMDB reads lists as ONE comma-separated value. Repeated keys (`a=1&a=2`) are silently misread: `append_to_response` would return only one of the appended payloads.
  it(`comma-joins arrays instead of repeating the key`, () => {
    expect(
      query({ appendToResponse: [`credits`, `images`, `external_ids`] })
    ).toBe(`?append_to_response=credits,images,external_ids`);
  });

  it(`passes an OR-joined string through untouched`, () => {
    expect(query({ withGenres: `28|12` })).toBe(`?with_genres=28|12`);
  });

  it(`skips null and undefined values but keeps falsy ones`, () => {
    expect(
      query({ page: 0, includeAdult: false, region: null, language: undefined })
    ).toBe(`?page=0&include_adult=false`);
  });
});

describe(`buildURL`, () => {
  it(`resolves paths against the v3 endpoint with or without a leading slash`, () => {
    expect(buildURL(`/movie/11`).href).toBe(
      `https://api.themoviedb.org/3/movie/11`
    );
    expect(buildURL(`movie/11`).href).toBe(
      `https://api.themoviedb.org/3/movie/11`
    );
  });
});
