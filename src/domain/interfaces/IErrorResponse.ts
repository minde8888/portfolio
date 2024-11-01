export interface IErrorResponse {
  message?: string;
  status: number;
  error?: string;
  name?: string;
  stack?: string;
}

export interface IAppError extends Error {
  statusCode?: number;
}