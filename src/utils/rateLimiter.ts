// src/utils/rateLimiter.ts
type Entry = { attempts: number; firstAttemptAt: number };

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 20; // per IP in window

const store = new Map<string, Entry>();

export function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry) {
    store.set(ip, { attempts: 1, firstAttemptAt: now });
    return false;
  }
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    // reset window
    store.set(ip, { attempts: 1, firstAttemptAt: now });
    return false;
  }

  entry.attempts += 1;
  store.set(ip, entry);
  return entry.attempts > MAX_ATTEMPTS;
}

export function resetRateLimit(ip: string) {
  store.delete(ip);
}
