import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class DdosService {
  private redis = new Redis(6379, 'localhost');

  async detect(ip: string) {
    const key = `ddos:${ip}`;

    const count = await this.redis.incr(key);
    await this.redis.expire(key, 10);

    if (count > 200) {
      await this.redis.set(`blocked:${ip}`, '1', 'EX', 300);
    }
  }

  async isBlocked(ip: string): Promise<boolean> {
    return (await this.redis.exists(`blocked:${ip}`)) === 1;
  }
}
