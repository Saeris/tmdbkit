import { describe, it, expect, expectTypeOf } from "vite-plus/test";
import { toCamelKeys } from "../toCamelKeys.js";

describe(`toCamelKeys`, () => {
  it(`converts object snake_case keys to camelCase keys`, () => {
    const actual = toCamelKeys({
      foo_bar: [
        {
          baz_qux: 1234
        }
      ],
      ignoreThis: 5678
    });
    const expected = {
      fooBar: [
        {
          bazQux: 1234
        }
      ],
      ignoreThis: 5678
    };
    expect(actual).toStrictEqual(expected);
  });

  // tmdbkit's public key names: camelCase, except ISO-code keys (TMDB's documented names) and internal leading-underscore keys. Every schema is written against these, so the runtime and the type must agree.
  it(`keeps ISO-code keys and leading-underscore keys as TMDB names them`, () => {
    const actual = toCamelKeys({
      iso_3166_1: `US`,
      iso_639_1: `en`,
      _id: `52fe4`,
      poster_path: `/a.jpg`
    });
    expect(actual).toStrictEqual({
      iso_3166_1: `US`,
      iso_639_1: `en`,
      _id: `52fe4`,
      posterPath: `/a.jpg`
    });
    expectTypeOf(actual).toEqualTypeOf<{
      iso_3166_1: string;
      iso_639_1: string;
      _id: string;
      posterPath: string;
    }>();
  });
});
