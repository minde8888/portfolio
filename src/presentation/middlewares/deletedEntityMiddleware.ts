import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';

import { NotFoundError } from '../../utils/Errors/Errors';

import { IDeletableEntity } from '../../domain/interfaces/IDeletableEntity';
import { IMiddleware } from '../../domain/middleware/IMiddleware';
import { IErrorResponse } from '../../domain/interfaces/IErrorResponse';

import { adaptMiddleware } from '../../infrastructure/http/middleware/ExpressMiddlewareAdapter';


export class DeletedEntityMiddleware implements IMiddleware {
  private handleError(res: Response, error: Error): Response<IErrorResponse> {
    const status = error instanceof NotFoundError ? HttpStatus.NOT_FOUND : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error instanceof NotFoundError ? error.message : 'Internal server error';

    return res.status(status).json({
      status,
      error: message,
    });
  }

  private isDeletableEntity(value: unknown): value is IDeletableEntity {
    return (
      value !== null &&
      typeof value === 'object' &&
      'isDeleted' in value &&
      typeof (value as IDeletableEntity).isDeleted === 'boolean'
    );
  }

  private processArrayData<T>(data: T[]): T[] {
    return data
      .map(item => this.processEntityData(item))
      .filter(item => !this.isDeletableEntity(item) || !item.isDeleted);
  }

  private processObjectData<T extends object>(data: T): T {
    const processedData = { ...data };

    for (const [key, value] of Object.entries(processedData)) {
      if (value && typeof value === 'object') {
        processedData[key as keyof T] = this.processEntityData(value) as T[keyof T];

        if (this.isDeletableEntity(value) && value.isDeleted) {
          throw new NotFoundError(`Password or email is incorrect`);
        }
      }
    }

    if (this.isDeletableEntity(processedData) && processedData.isDeleted) {
      throw new NotFoundError(`Password or email is incorrect`);
    }

    return processedData;
  }

  private processEntityData<T>(data: T): T {
    if (!data || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return this.processArrayData(data) as unknown as T;
    }

    return this.processObjectData(data as object) as T;
  }

  handle(request: Request, response: Response, next: NextFunction): void {
    const originalJson = response.json.bind(response);

    response.json = (data: any) => {
      try {
        const filteredData = this.processEntityData(data);
        return originalJson(filteredData);
      } catch (error) {
        return this.handleError(response, error as Error);
      }
    };

    next();
  }
}

export const isDeletedMiddleware = adaptMiddleware(new DeletedEntityMiddleware());
