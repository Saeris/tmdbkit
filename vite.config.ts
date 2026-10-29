import { defineConfig } from "vite-plus";
import { lint, fmt, mergeLint } from "@saeris/configs";

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false
  },
  resolve: {
    conditions: ["@saeris/tmdbkit/source"]
  },
  lint: mergeLint(lint, {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // As in discordkit: `scripts/` (fixture recording, codegen) and `__mocks__/` (test helpers) are dev tooling, not shipped library surface. Casting `JSON.parse` output to a declared shape is the point of those scripts.
        files: [`scripts/**/*.ts`, `packages/tmdbkit/src/__mocks__/**/*.ts`],
        rules: {
          "typescript/no-unsafe-type-assertion": `off`,
          "typescript/no-unnecessary-condition": `off`
        }
      }
    ]
  }),
  fmt: {
    ...fmt,
    // Machine-written files the formatter leaves alone: recorded TMDB responses (`yarn fixtures:record`) and the changelogs Bumpy writes on each version PR, since regenerating either would undo any formatting.
    ignorePatterns: [`packages/tmdbkit/fixtures/**`, `**/CHANGELOG.md`]
  }
});
