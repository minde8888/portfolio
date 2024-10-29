import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IMiddleware } from '../../../domain/middleware/IMiddleware';

export const adaptMiddleware = (middleware: IMiddleware): RequestHandler => {
    return (request: Request, response: Response, next: NextFunction) => {
        return middleware.handle(request, response, next);
    };
};