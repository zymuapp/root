import { GrpcErrorCode } from "../grpc/client";

/**
 * Maps gRPC error codes to HTTP status codes for gateway services
 */
export const grpcErrorCodeToHttpStatus = (code: GrpcErrorCode): number => {
  switch (code) {
    // Authentication errors -> 401 Unauthorized
    case GrpcErrorCode.INVALID_CREDENTIALS:
    case GrpcErrorCode.TOKEN_EXPIRED:
    case GrpcErrorCode.TOKEN_INVALID:
    case GrpcErrorCode.UNAUTHORIZED:
      return 401;

    // Permission errors -> 403 Forbidden
    case GrpcErrorCode.FORBIDDEN:
    case GrpcErrorCode.INSUFFICIENT_PERMISSIONS:
      return 403;

    // Not found errors -> 404 Not Found
    case GrpcErrorCode.USER_NOT_FOUND:
    case GrpcErrorCode.RESOURCE_NOT_FOUND:
      return 404;

    // Conflict errors -> 409 Conflict
    case GrpcErrorCode.USER_ALREADY_EXISTS:
    case GrpcErrorCode.RESOURCE_CONFLICT:
      return 409;

    // Validation errors -> 400 Bad Request
    case GrpcErrorCode.VALIDATION_ERROR:
    case GrpcErrorCode.INVALID_INPUT:
    case GrpcErrorCode.MISSING_REQUIRED_FIELDS:
    case GrpcErrorCode.INVALID_EMAIL:
    case GrpcErrorCode.INVALID_USERNAME:
    case GrpcErrorCode.WEAK_PASSWORD:
      return 400;

    // Rate limiting -> 429 Too Many Requests
    case GrpcErrorCode.RATE_LIMITED:
    case GrpcErrorCode.TOO_MANY_REQUESTS:
      return 429;

    // Service unavailable -> 503 Service Unavailable
    case GrpcErrorCode.SERVICE_UNAVAILABLE:
      return 503;

    // Server errors -> 500 Internal Server Error
    default:
      return 500;
  }
};

/**
 * Maps gRPC error codes to user-friendly messages for frontend consumption
 */
export const grpcErrorCodeToUserMessage = (code: GrpcErrorCode): string => {
  switch (code) {
    case GrpcErrorCode.INVALID_CREDENTIALS:
      return "Invalid username or password";

    case GrpcErrorCode.TOKEN_EXPIRED:
      return "Your session has expired. Please sign in again";

    case GrpcErrorCode.TOKEN_INVALID:
      return "Invalid authentication token";

    case GrpcErrorCode.USER_NOT_FOUND:
      return "User not found";

    case GrpcErrorCode.USER_ALREADY_EXISTS:
      return "An account with this email already exists";

    case GrpcErrorCode.INVALID_EMAIL:
      return "Please enter a valid email address";

    case GrpcErrorCode.INVALID_USERNAME:
      return "Username must be 3-48 characters and contain only letters, numbers, and underscores";

    case GrpcErrorCode.WEAK_PASSWORD:
      return "Password must be at least 8 characters with uppercase, lowercase, and number/special character";

    case GrpcErrorCode.USER_NOT_VERIFIED:
      return "Please verify your email address before continuing";

    case GrpcErrorCode.FORBIDDEN:
      return "You don't have permission to perform this action";

    case GrpcErrorCode.RATE_LIMITED:
      return "Too many requests. Please try again later";

    case GrpcErrorCode.SERVICE_UNAVAILABLE:
      return "Service is temporarily unavailable. Please try again later";

    case GrpcErrorCode.VALIDATION_ERROR:
      return "Please check your input and try again";

    case GrpcErrorCode.RESOURCE_NOT_FOUND:
      return "The requested resource was not found";

    case GrpcErrorCode.RESOURCE_CONFLICT:
      return "This resource is in conflict with existing data";

    default:
      return "An unexpected error occurred. Please try again";
  }
};

/**
 * Checks if an error code represents a client error (4xx) vs server error (5xx)
 */
export const isClientError = (code: GrpcErrorCode): boolean => {
  const httpStatus = grpcErrorCodeToHttpStatus(code);
  return httpStatus >= 400 && httpStatus < 500;
};

/**
 * Checks if an error code represents a server error (5xx)
 */
export const isServerError = (code: GrpcErrorCode): boolean => {
  const httpStatus = grpcErrorCodeToHttpStatus(code);
  return httpStatus >= 500;
};

/**
 * Error code groups for easier categorization
 */
export const ERROR_CODE_GROUPS = {
  AUTHENTICATION: [
    GrpcErrorCode.INVALID_CREDENTIALS,
    GrpcErrorCode.TOKEN_EXPIRED,
    GrpcErrorCode.TOKEN_INVALID,
    GrpcErrorCode.USER_NOT_FOUND,
    GrpcErrorCode.UNAUTHORIZED,
  ],
  USER_MANAGEMENT: [
    GrpcErrorCode.USER_ALREADY_EXISTS,
    GrpcErrorCode.INVALID_EMAIL,
    GrpcErrorCode.INVALID_USERNAME,
    GrpcErrorCode.WEAK_PASSWORD,
    GrpcErrorCode.USER_NOT_VERIFIED,
  ],
  VALIDATION: [
    GrpcErrorCode.VALIDATION_ERROR,
    GrpcErrorCode.INVALID_INPUT,
    GrpcErrorCode.MISSING_REQUIRED_FIELDS,
  ],
  PERMISSIONS: [
    GrpcErrorCode.FORBIDDEN,
    GrpcErrorCode.INSUFFICIENT_PERMISSIONS,
  ],
  RATE_LIMITING: [GrpcErrorCode.RATE_LIMITED, GrpcErrorCode.TOO_MANY_REQUESTS],
  SERVER: [
    GrpcErrorCode.INTERNAL_ERROR,
    GrpcErrorCode.SERVICE_UNAVAILABLE,
    GrpcErrorCode.DATABASE_ERROR,
    GrpcErrorCode.EXTERNAL_SERVICE_ERROR,
  ],
  RESOURCES: [
    GrpcErrorCode.RESOURCE_NOT_FOUND,
    GrpcErrorCode.RESOURCE_CONFLICT,
    GrpcErrorCode.RESOURCE_EXPIRED,
  ],
} as const;
