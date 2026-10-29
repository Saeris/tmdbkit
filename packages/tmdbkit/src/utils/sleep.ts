/**
 * The error a sleep rejects with when its signal aborts: the signal's own reason when that is an `Error` (by default a `DOMException` named `AbortError`), so callers can tell an abort from a failure by `name`.
 */
const abortError = (signal: AbortSignal): Error => {
  const reason: unknown = signal.reason;
  return reason instanceof Error
    ? reason
    : new DOMException(
        typeof reason === `string` ? reason : `This operation was aborted`,
        `AbortError`
      );
};

/**
 * Sleep for a given number of milliseconds. When a `signal` is given, the sleep rejects as soon as it aborts, so a cancelled request doesn't sit out a rate-limit or retry wait.
 */
export const sleep = async (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError(signal));
      return;
    }
    const onAbort = (): void => {
      clearTimeout(timer);
      if (signal) reject(abortError(signal));
    };
    const timer = setTimeout(
      () => {
        signal?.removeEventListener(`abort`, onAbort);
        resolve();
      },
      Math.max(0, ms)
    );
    signal?.addEventListener(`abort`, onAbort, { once: true });
  });
