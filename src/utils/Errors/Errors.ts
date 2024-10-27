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

export class UserNotFoundError extends AppError {
  constructor(message: string = "User does not exist") {
    super(message, 404, "UserNotFoundError");
  }
}

export class UserUpdateError extends AppError {
  constructor(message: string = "Could not update user") {
    super(message, 404, "UserUpdateError");
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 400, "ValidationError");
  }
}

export class RedisError extends AppError {
  constructor(message: string) {
    super(message, 500, "RedisError");
  }
}
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
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