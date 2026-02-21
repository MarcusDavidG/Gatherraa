import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RATE_LIMIT_TIERS } from '../constants/rate-limit-tiers';

@Injectable()
export class RateLimitService {
  private redis = new Redis(6379, 'localhost');

  async checkRateLimit(key: string, tier: keyof typeof RATE_LIMIT_TIERS) {
    const { limit, ttl } = RATE_LIMIT_TIERS[tier];

    const now = Date.now();
    const windowStart = now - ttl * 1000;

    const redisKey = `rate:${key}`;

    await this.redis.zremrangebyscore(redisKey, 0, windowStart);

    const requestCount = await this.redis.zcard(redisKey);

    if (requestCount >= limit) {
      return {
        allowed: false,
        remaining: 0,
        limit,
      };
    }

    await this.redis.zadd(redisKey, now, `${now}-${Math.random()}`);
    await this.redis.expire(redisKey, ttl);

    return {
      allowed: true,
      remaining: limit - requestCount - 1,
      limit,
    };
  }
}