import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let errorMessage = "Something went wrong!";

  switch (err.name) {
    case "ValidationError":
      statusCode = 400;
      errorMessage = "Invalid input";
      break;

    case "NotFoundError":
      statusCode = 404;
      errorMessage = "Resource not found";
      break;

    case "UnauthorizedError":
      statusCode = 401;
      errorMessage = "Unauthorized access";
      break;

    case "ForbiddenError":
      statusCode = 403;
      errorMessage = "Forbidden access";
      break;

    default:
      statusCode = statusCode || 500;
      errorMessage = errorMessage || "Internal Server Error";
      break;
  }

  res.status(statusCode).json({ error: errorMessage });
}
