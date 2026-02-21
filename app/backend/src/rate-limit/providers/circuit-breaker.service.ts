import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CircuitBreakerService {
  private redis = new Redis(6379, 'localhost');

  async recordFailure(service: string) {
    const key = `circuit:${service}`;
    const failures = await this.redis.incr(key);
    await this.redis.expire(key, 60);

    if (failures > 50) {
      await this.redis.set(`circuit:open:${service}`, '1', 'EX', 60);
    }
  }

  async isOpen(service: string): Promise<boolean> {
    return (await this.redis.exists(`circuit:open:${service}`)) === 1;
  }
}
