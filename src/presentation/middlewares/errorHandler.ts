import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number; // Optional property for custom status codes
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err.stack); // Log the error stack for debugging

  // Default status code is 500 (Internal Server Error)
  let statusCode = err.statusCode || 500;
  let errorMessage = 'Something went wrong!';

  // Use a switch statement to handle different error types
  switch (err.name) {
    case 'ValidationError':
      statusCode = 400;
      errorMessage = 'Invalid input';
      break;

    case 'NotFoundError':
      statusCode = 404;
      errorMessage = 'Resource not found';
      break;

    case 'UnauthorizedError':
      statusCode = 401;
      errorMessage = 'Unauthorized access';
      break;

    case 'ForbiddenError':
      statusCode = 403;
      errorMessage = 'Forbidden access';
      break;

    // Add more cases for other specific errors as needed

    default:
      // Fallback case for unhandled error types
      statusCode = statusCode || 500; // Ensure we return 500 if no statusCode is set
      errorMessage = errorMessage || 'Internal Server Error';
      break;
  }

  // Send the response with the appropriate status and message
  res.status(statusCode).json({ error: errorMessage });
}
