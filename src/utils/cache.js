import { redis } from "../config/redisConfig.js";

export async function getOrSetCache(key, fetchFn, ttlSeconds = 60) {
  const cached = await redis.get(key);

  if (cached) {
    console.log("FEED CACHE HIT:", key);
    return JSON.parse(cached);
  }

  console.log("FEED CACHE MISS:", key);

  const freshData = await fetchFn();

  await redis.set(key, JSON.stringify(freshData), "EX", ttlSeconds);

  return freshData;
}
export async function clearByPattern(pattern) {
  const stream = redis.scanStream({
    match: pattern,
    count: 100
  });

  for await (const keys of stream) {
    if (keys.length) {
      await redis.del(...keys);
    }
  }
}