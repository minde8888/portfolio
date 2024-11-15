
import * as crypto from 'crypto';
import { ITokenConfig, TokenEncoding } from '../types';

export class TokenGenerator {
  private readonly config: ITokenConfig;

  constructor(config?: Partial<ITokenConfig>) {
    this.config = {
      minLength: 16,
      defaultEncoding: 'base64url',
      supportedEncodings: ['hex', 'base64', 'base64url'],
      ...config
    };
  }

  public generateTokenSecret(
    length: number = 32,
    encoding?: TokenEncoding
  ): string {
    this.validateLength(length);
    const finalEncoding = encoding || this.config.defaultEncoding;
    this.validateEncoding(finalEncoding);

    try {
      const buffer = crypto.randomBytes(length);
      const token = buffer.toString(finalEncoding);
      return this.truncateToLength(token, length, finalEncoding);
    } catch (error) {
      throw new Error(`Failed to generate token secret: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public generateJti(length: number = 32): string {
    this.validateLength(length);

    try {
      return crypto.randomBytes(length / 2).toString('hex');
    } catch (error) {
      throw new Error(`Failed to generate JTI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateLength(length: number): void {
    if (!Number.isInteger(length) || length < this.config.minLength) {
      throw new Error(`Token length must be an integer >= ${this.config.minLength}`);
    }
  }

  private validateEncoding(encoding: string): void {
    if (!this.config.supportedEncodings.includes(encoding as TokenEncoding)) {
      throw new Error(
        `Invalid encoding. Must be one of: ${this.config.supportedEncodings.join(', ')}`
      );
    }
  }

  private truncateToLength(
    token: string,
    targetLength: number,
    encoding: TokenEncoding
  ): string {
    switch (encoding) {
      case 'hex':
        return token.slice(0, targetLength);
      case 'base64':
      case 'base64url':
        const truncated = token.slice(0, targetLength);
        return truncated.padEnd(Math.ceil(truncated.length / 4) * 4, '=');
      default:
        return token.slice(0, targetLength);
    }
  }

  public getSupportedEncodings(): ReadonlyArray<TokenEncoding> {
    return [...this.config.supportedEncodings];
  }
}