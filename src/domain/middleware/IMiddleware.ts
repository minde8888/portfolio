import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
    handle(request: Request, response: Response, next: NextFunction): void;
  }