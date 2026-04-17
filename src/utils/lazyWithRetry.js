import { lazy } from 'react';

const RETRY_PREFIX = 'lazy-retry:';
const CHUNK_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /ChunkLoadError/i,
  /dynamically imported module/i,
];

function isRecoverableChunkError(error) {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

export function lazyWithRetry(importer, cacheKey) {
  return lazy(async () => {
    const storageKey = `${RETRY_PREFIX}${cacheKey}`;

    try {
      const module = await importer();

      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(storageKey);
      }

      return module;
    } catch (error) {
      if (
        typeof window !== 'undefined' &&
        isRecoverableChunkError(error) &&
        !window.sessionStorage.getItem(storageKey)
      ) {
        window.sessionStorage.setItem(storageKey, '1');
        window.location.reload();

        return new Promise(() => {});
      }

      throw error;
    }
  });
}
