import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AbuseReportService {
  private redis = new Redis(6379, 'localhost');

  async report(ip: string, reason: string) {
    await this.redis.lpush(
      'abuse_reports',
      JSON.stringify({ ip, reason, time: Date.now() }),
    );
  }
}
