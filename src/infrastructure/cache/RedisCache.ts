import { createClient, RedisClientType } from 'redis';
import { ICacheService } from '../../application/interfaces/ICacheService';
import { RedisError } from '../../utils/Errors';
import dotenv from 'dotenv';

dotenv.config();

export class RedisCache implements ICacheService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));

    this.client.connect().catch((err) => {
      console.error('Failed to connect to Redis', err);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      throw new RedisError(`Redis get error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      throw new RedisError(`Redis set error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      throw new RedisError(`Redis del error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}