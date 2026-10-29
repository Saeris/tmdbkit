/**
 * TMDB's image host (`secureBaseUrl` from `getConfiguration`, recorded 2026-10-28). TMDB says to read it from the configuration; it hasn't changed in years, so it's the default, and `imageUrl` takes another base for anyone who fetches it.
 */
export const imageBaseUrl = `https://image.tmdb.org/t/p/`;

/** The sizes `getConfiguration` lists for each kind of image (recorded 2026-10-28; a spec fails if a re-recording disagrees). `original` is the full-size file. */
export const imageSizes = {
  backdrop: [`w300`, `w780`, `w1280`, `original`],
  logo: [`w45`, `w92`, `w154`, `w185`, `w300`, `w500`, `original`],
  poster: [`w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`],
  profile: [`w45`, `w185`, `h632`, `original`],
  still: [`w92`, `w185`, `w300`, `original`]
} as const;

/** Any size TMDB serves images at. */
export type ImageSize = (typeof imageSizes)[keyof typeof imageSizes][number];

/**
 * ### Image URL
 *
 * Turn an image's `filePath` (e.g. a `posterPath`) into a URL. A `null` path, which TMDB sends when there is no image, gives `null`, so a schema's nullable path can be passed straight in.
 *
 * ```ts
 * imageUrl(movie.posterPath, `w500`); // "https://image.tmdb.org/t/p/w500/…jpg" or null
 * ```
 */
export function imageUrl(
  filePath: string,
  size?: ImageSize,
  base?: string
): string;
export function imageUrl(
  filePath: string | null,
  size?: ImageSize,
  base?: string
): string | null;
export function imageUrl(
  filePath: string | null,
  size: ImageSize = `original`,
  base: string = imageBaseUrl
): string | null {
  return filePath === null ? null : `${base}${size}${filePath}`;
}
