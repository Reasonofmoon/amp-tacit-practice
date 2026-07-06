import { lazy } from 'react';

const RETRY_PREFIX = 'lazy-retry:';
const CHUNK_ERROR_PATTERNS = [
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /ChunkLoadError/i,
  /dynamically imported module/i,
];
const memoryRetryKeys = new Set();

function hasRetryKey(storageKey) {
  if (typeof window === 'undefined') {
    return memoryRetryKeys.has(storageKey);
  }

  try {
    return window.sessionStorage.getItem(storageKey) === '1';
  } catch {
    return memoryRetryKeys.has(storageKey);
  }
}

function setRetryKey(storageKey) {
  memoryRetryKeys.add(storageKey);

  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(storageKey, '1');
  } catch {
    // In-memory retry tracking still prevents reload loops when storage is blocked.
  }
}

function clearRetryKey(storageKey) {
  memoryRetryKeys.delete(storageKey);

  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // Storage may be unavailable in private or locked-down browsing contexts.
  }
}

function isRecoverableChunkError(error) {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return CHUNK_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

export function lazyWithRetry(importer, cacheKey) {
  return lazy(async () => {
    const storageKey = `${RETRY_PREFIX}${cacheKey}`;

    try {
      const module = await importer();

      clearRetryKey(storageKey);

      return module;
    } catch (error) {
      if (
        typeof window !== 'undefined' &&
        isRecoverableChunkError(error) &&
        !hasRetryKey(storageKey)
      ) {
        setRetryKey(storageKey);
        window.location.reload();

        return new Promise(() => {});
      }

      throw error;
    }
  });
}
