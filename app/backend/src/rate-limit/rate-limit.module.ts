import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RateLimitService } from './providers/rate-limit.service';
import { CircuitBreakerService } from './providers/circuit-breaker.service';
import { DdosService } from './providers/ddos.service';
import { ApiKeyService } from './providers/api-key.service';
import { AbuseReportService } from './providers/abuse-report.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 20,
        },
      ],
    }),
  ],
  providers: [
    RateLimitGuard,
    RateLimitService,
    CircuitBreakerService,
    DdosService,
    ApiKeyService,
    AbuseReportService,
  ],
  exports: [RateLimitService],
})
export class RateLimitModule {}
