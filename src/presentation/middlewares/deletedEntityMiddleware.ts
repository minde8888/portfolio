import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';

import { UserNotFoundError } from '../../utils/Errors/Errors';

import { IDeletableEntity } from '../../domain/interfaces/IDeletableEntity';
import { IMiddleware } from '../../domain/middleware/IMiddleware';
import { adaptMiddleware } from '../../infrastructure/http/middleware/ExpressMiddlewareAdapter';

export class DeletedEntityMiddleware implements IMiddleware {
  private checkForDeletedEntity<T>(data: T): T {
    // If it's null or not an object, return as is
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return (data
        .map(item => this.checkForDeletedEntity(item))
        .filter(item => {
          if (this.isDeletableEntity(item)) {
            return !item.isDeleted;
          }
          return true;
        }) as unknown) as T;
    }

    // Deep clone the object
    const clonedData = { ...data } as T;

    // Check each property in the object
    for (const key in clonedData) {
      const value = clonedData[key];
      
      if (value && typeof value === 'object') {
        // Recursively check nested objects
        clonedData[key] = this.checkForDeletedEntity(value);

        // Type guard to ensure we can access isDeleted
        if (this.isDeletableEntity(value)) {
          if (value.isDeleted) {
            throw new UserNotFoundError('Entity not found');
          }
        }
      }
    }

    // Check if the current object is a deleted entity
    if (this.isDeletableEntity(clonedData) && clonedData.isDeleted) {
      throw new UserNotFoundError('Entity not found');
    }

    return clonedData;
  }

  private isDeletableEntity(value: unknown): value is IDeletableEntity {
    return (
      value !== null &&
      typeof value === 'object' &&
      'isDeleted' in value &&
      typeof (value as IDeletableEntity).isDeleted === 'boolean'
    );
  }

  handle(request: Request, response: Response, next: NextFunction): void {
    const self = this;
    const originalJson = response.json;

    response.json = function(this: Response, data: any) {
      try {
        const filteredData = self.checkForDeletedEntity(data);
        return originalJson.call(this, filteredData);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return this.status(HttpStatus.NOT_FOUND).json({
            status: HttpStatus.NOT_FOUND,
            error: error.message
          });
        }
        return this.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error'
        });
      }
    };

    next();
  }
}

export const isDeletedMiddleware = adaptMiddleware(new DeletedEntityMiddleware());