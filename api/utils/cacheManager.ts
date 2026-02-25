import { redis } from '../queues/redis';

// I invalidate cache keys so reads reflect the latest data
export async function invalidateCache(key: string) {
  await redis.del(key);
}
