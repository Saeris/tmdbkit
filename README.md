<div align="center">

# 🎬 tmdbkit

[![npm version][npm_badge]][npm]
[![CI status][ci_badge]][ci]

A type-safe client for [The Movie Database (TMDB)][tmdb] API, with [Valibot][valibot] schemas checked against TMDB's real responses

</div>

---

This repository holds [`@saeris/tmdbkit`][package]: every read endpoint of TMDB's v3 API as a typed function with exported Valibot schemas, a concurrent rate-limited request layer with retries and cancellation, and an image URL helper. **Installation, usage and the full API coverage are in the [package README][package].**

## 🤝 Contributing

The project uses [Vite+][viteplus] (Oxlint + Oxfmt + tsdown + Vitest) and [Bumpy][bumpy] for releases. Start with [`docs/plan.md`][plan] (decisions, phases, what the recorded responses established) and [`AGENTS.md`][agents] (conventions and commit format).

```bash
vp install              # install dependencies
vp check --fix          # format + lint + typecheck (with autofixes)
vp test                 # run Vitest
yarn fixtures:record    # re-record TMDB responses (needs TMDB_API_TOKEN or TMDB_API_KEY in .env)
yarn bumpy add          # create a bump file for your PR
```

This product uses the TMDB API but is not endorsed or certified by TMDB.

## 🥂 License

Released under the [MIT license][license] © [Drake Costa][personal-website].

[npm_badge]: https://img.shields.io/npm/v/@saeris/tmdbkit.svg?style=flat
[npm]: https://www.npmjs.com/package/@saeris/tmdbkit
[ci_badge]: https://github.com/Saeris/tmdbkit/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/Saeris/tmdbkit/actions/workflows/ci.yml
[tmdb]: https://www.themoviedb.org/
[valibot]: https://github.com/fabian-hiller/valibot
[package]: ./packages/tmdbkit/README.md
[viteplus]: https://viteplus.dev/
[bumpy]: https://bumpy.varlock.dev/
[plan]: ./docs/plan.md
[agents]: ./AGENTS.md
[license]: ./LICENSE.md
[personal-website]: https://saeris.gg
