import { ICacheService } from "../../application/interfaces/ICacheService";
import dotenv from "dotenv";
import { RedisCache } from './RedisCache';

dotenv.config();

export class  ConfigurableCache implements ICacheService {
  private cacheService: ICacheService | null;

  constructor() {
    this.cacheService =
      process.env.USE_REDIS === "true" ? new RedisCache() : null;
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
