// Limitador simples em memória para tentativas de login.
// (Suficiente para uma instância única; em várias instâncias use Redis ou similar.)

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_GLOBAL = 20;
const GLOBAL_KEY = "__global__";

const buckets = new Map<string, Bucket>();

function current(key: string): Bucket {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    const fresh = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, fresh);
    return fresh;
  }
  return bucket;
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const perIp = current(ip);
  const global = current(GLOBAL_KEY);
  const blocked = perIp.count >= MAX_PER_IP || global.count >= MAX_GLOBAL;
  const resetAt = Math.max(
    perIp.count >= MAX_PER_IP ? perIp.resetAt : 0,
    global.count >= MAX_GLOBAL ? global.resetAt : 0,
  );

  return {
    allowed: !blocked,
    retryAfterSeconds: blocked
      ? Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
      : 0,
  };
}

export function recordFailure(ip: string): void {
  current(ip).count += 1;
  current(GLOBAL_KEY).count += 1;
}

export function clearFailures(ip: string): void {
  buckets.delete(ip);
}
