import { ICacheService } from "../../domain/services/ICacheService";

import { RedisCache } from './RedisCache';

export class ConfigurableCache implements ICacheService {
  private cacheService: ICacheService | null;

  constructor(use_redis?: boolean, redis_url?: string) {
    this.cacheService =
      use_redis ? new RedisCache(redis_url) : null;
  }

  async get(key: string): Promise<string | null> {
    if (this.cacheService) {
      return await this.cacheService.get(key);
    }
    return null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (this.cacheService) {
      await this.cacheService.set(key, value, ttl);
    }
  }

  async del(key: string): Promise<void> {
    if (this.cacheService) {
      await this.cacheService.del(key);
    }
  }
}
