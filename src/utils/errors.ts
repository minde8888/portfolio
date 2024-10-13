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

export class UserAlreadyExistsError extends AppError {
  constructor(message: string = "User already exists") {
    super(message, 409, "UserAlreadyExistsError");
  }
}

export class UserNotFoundError extends AppError {
  constructor(message: string = "User does not exist") {
    super(message, 404, "UserNotFoundError");
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 400, "ValidationError");
  }
}