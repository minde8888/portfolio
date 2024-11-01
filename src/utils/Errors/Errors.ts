export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public name: string = 'AppError'
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor(message: string = "Email already exists") {
    super(message, 409, "EmailAlreadyExistsError");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "UserNotFoundError");
  }
}

export class UserUpdateError extends AppError {
  constructor(message: string = "Could not update user") {
    super(message, 404, "UserUpdateError");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class RedisError extends AppError {
  constructor(message: string) {
    super(message, 500, "RedisError");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public readonly originalError: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class UpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpdateError';
  }
}

