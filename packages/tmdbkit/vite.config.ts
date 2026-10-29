import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      build: { command: `vp pack`, cache: true },
      dev: { command: `vp pack --watch`, cache: false }
    }
  },
  pack: {
    // tmdbkit runs in Node and in browsers/webviews (it only needs `fetch` and `URL`), so target the language level rather than a Node version.
    target: `es2022`,
    // Unbundled, as in discordkit: every source file becomes its own dist file so the `./*` deep-import export map resolves 1:1 against src/.
    entry: [
      `src/**/*.ts`,
      `!src/**/__mocks__/**`,
      `!src/**/__tests__/**`,
      `!src/**/*.spec.ts`
    ],
    unbundle: true,
    dts: true,
    // Keep every dependency external so third-party code and types aren't inlined under our publish surface. (discordkit's vite-plus 0.2.9 spells this `skipNodeModulesBundle`; tsdown in vite-plus 1.4 renamed it `neverBundle`.)
    deps: { neverBundle: true }
  }
});
