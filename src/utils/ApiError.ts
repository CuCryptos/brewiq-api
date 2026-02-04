export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string): ApiError {
    return new ApiError(400, message, code);
  }

  static unauthorized(message = 'Unauthorized', code?: string): ApiError {
    return new ApiError(401, message, code);
  }

  static forbidden(message = 'Forbidden', code?: string): ApiError {
    return new ApiError(403, message, code);
  }

  static notFound(message = 'Not found', code?: string): ApiError {
    return new ApiError(404, message, code);
  }

  static conflict(message: string, code?: string): ApiError {
    return new ApiError(409, message, code);
  }

  static tooManyRequests(message = 'Too many requests', code?: string): ApiError {
    return new ApiError(429, message, code);
  }

  static internal(message = 'Internal server error', code?: string): ApiError {
    return new ApiError(500, message, code, false);
  }
}
