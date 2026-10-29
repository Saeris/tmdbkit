import { afterAll } from "vite-plus/test";
import { MockUtils } from "@saeris/tmdbkit-test-utils";
import { tmdb } from "../requests/TmdbSession.js";

// Shared MockUtils instance for the whole test suite. The msw server is
// started in the constructor and torn down after every test file so handlers
// registered by one spec never leak into another.
export const mockUtils = new MockUtils(tmdb);

afterAll(() => mockUtils.reset());
