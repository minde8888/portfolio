import { createClient, RedisClientType } from 'redis';
import { ICacheService } from '../../domain/services/ICacheService';
import { RedisError } from '../../utils/Errors';
import dotenv from 'dotenv';

dotenv.config();

export class RedisCache implements ICacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    console.log('Initializing Redis client...');
    console.log(`Redis URL: ${process.env.REDIS_URL || 'redis://localhost:6379'}`);

    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          console.log(`Reconnection attempt ${retries}`);
          if (retries > 10) {
            console.error('Max reconnection attempts reached. Stopping reconnection.');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis client connected successfully');
      this.isConnected = true;
    });

    this.connect().catch(err => {
      console.error('Failed to connect to Redis:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
    });
  }

  private async connect(): Promise<void> {
    try {
      console.log('Attempting to connect to Redis...');
      await this.client.connect();
    } catch (error) {
      this.isConnected = false;
      console.error('Failed to connect to Redis');
      console.error('Connection error details:', JSON.stringify(error, null, 2));
      throw new RedisError(`Failed to connect to Redis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) {
        console.log('Redis not connected. Attempting to reconnect...');
        await this.connect();
      }
      return await this.client.get(key);
    } catch (error) {
      console.error(`Redis get error for key ${key}:`, error);
      throw new RedisError(`Redis get error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (!this.isConnected) {
        console.log('Redis not connected. Attempting to reconnect...');
        await this.connect();
      }
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Redis set error for key ${key}:`, error);
      throw new RedisError(`Redis set error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (!this.isConnected) {
        console.log('Redis not connected. Attempting to reconnect...');
        await this.connect();
      }
      await this.client.del(key);
    } catch (error) {
      console.error(`Redis del error for key ${key}:`, error);
      throw new RedisError(`Redis del error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}