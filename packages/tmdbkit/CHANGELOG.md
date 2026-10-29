# Changelog

## 0.1.0
<sub>2026-10-29</sub>

-  *(minor)*
  First release: every read endpoint of TMDB's v3 API (116 operations) as typed functions with exported Valibot schemas, each checked against recorded TMDB responses; a concurrent, rate-limited request layer with retries and AbortSignal cancellation; and an imageUrl helper. Session-scoped endpoints (authentication, account, ratings, list editing) come in a later release.
