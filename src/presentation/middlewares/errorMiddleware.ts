import { Request, Response, NextFunction } from "express";

import { IAppError } from "../../domain/interfaces/IErrorResponse";

export function errorMiddleware(
  err: IAppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(
    `Error occurred - Message: ${err.message || 'No message'} - Name: ${err.name || 'No name'} - Stack: ${err.stack || 'No stack'}`
  );

  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = 'statusCode' in err && err.statusCode ? err.statusCode : 500;

  const errorResponse: any = {
    status: 'error',
    message: err.message || 'An unexpected error occurred.',
  };

  if (isDevelopment) {
    errorResponse.stack = err.stack;
    console.error(`Stack Trace:\n${err.stack}`);
  }

  switch (err.name) {
    case "ValidationError":
      errorResponse.statusCode = 400;
      errorResponse.message = "Invalid input provided.";
      break;

    case "NotFoundError":
    case "UserNotFoundError":
      errorResponse.statusCode = 404;
      errorResponse.message = err.message || "Requested resource could not be found.";
      break;

    case "UnauthorizedError":
      errorResponse.statusCode = 401;
      errorResponse.message = "Unauthorized access. Please log in.";
      break;

    case "ForbiddenError":
      errorResponse.statusCode = 403;
      errorResponse.message = err.message || "Access forbidden for this resource.";
      break;

    case "DatabaseError":
      errorResponse.statusCode = 503;
      errorResponse.message = "A database error occurred. Please retry later.";
      break;

    default:
      errorResponse.statusCode = statusCode;
      errorResponse.message = isDevelopment ? err.message : "An unexpected error occurred.";
      console.error("Unhandled error:", err);
  }

  res.status(errorResponse.statusCode).json(errorResponse);
}
