import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class ApiKeyService {
  private redis = new Redis(6379, 'localhost');

  async validateApiKey(key: string): Promise<string | null> {
    return this.redis.get(`apikey:${key}`);
  }

  async createApiKey(userId: string, tier: string) {
    const apiKey = `key_${Math.random().toString(36).substring(2)}`;
    await this.redis.set(`apikey:${apiKey}`, userId);
    return apiKey;
  }
}
