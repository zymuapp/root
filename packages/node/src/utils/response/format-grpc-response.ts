import {
  ErrorContext,
  createGrpcError,
  isGrpcError,
} from "../../errors/grpc-errors";
import {
  ErroredGrpcResponse,
  GrpcErrorCode,
  GrpcResponse,
  SucessfulGrpcResponse,
} from "../../grpc";

/**
 * Creates a successful gRPC response
 */
export function formatGrpcResponse<T>(
  data: T | Promise<T>,
): Promise<SucessfulGrpcResponse<T>>;

/**
 * Creates an errored gRPC response
 */
export function formatGrpcResponse(
  code: GrpcErrorCode,
  message: string,
  errors?: { [key: string]: string[] },
): Promise<ErroredGrpcResponse>;

/**
 * Implementation of formatGrpcResponse with overloads
 */
export async function formatGrpcResponse<T>(
  dataOrCode: T | Promise<T> | GrpcErrorCode,
  message?: string,
  errors?: { [key: string]: string[] },
): Promise<GrpcResponse<T>> {
  if (
    typeof dataOrCode === "string" &&
    Object.values(GrpcErrorCode).includes(dataOrCode as GrpcErrorCode)
  ) {
    return {
      success: false,
      code: dataOrCode as GrpcErrorCode,
      message: message || "An unknown error occurred",
      errors,
    };
  }

  return {
    success: true,
    data: await Promise.resolve(dataOrCode as T | Promise<T>),
  };
}

/**
 * Creates a successful gRPC response (alias for better readability)
 */
export const formatGrpcSuccess = <T>(
  data: T | Promise<T>,
): Promise<SucessfulGrpcResponse<T>> => {
  return formatGrpcResponse(data);
};

/**
 * Creates an errored gRPC response (alias for better readability)
 */
export const formatGrpcError = (
  code: GrpcErrorCode,
  message: string,
  errors?: { [key: string]: string[] },
): Promise<ErroredGrpcResponse> => {
  return formatGrpcResponse(code, message, errors);
};

/**
 * Creates an errored gRPC response with validation errors
 */
export const formatGrpcValidationError = (
  errors: { [key: string]: string[] },
  message = "Validation failed",
): Promise<ErroredGrpcResponse> => {
  return formatGrpcError(GrpcErrorCode.VALIDATION_ERROR, message, errors);
};

/**
 * Creates an errored gRPC response for authentication failures
 */
export const formatGrpcAuthError = (
  code:
    | GrpcErrorCode.INVALID_CREDENTIALS
    | GrpcErrorCode.TOKEN_EXPIRED
    | GrpcErrorCode.TOKEN_INVALID
    | GrpcErrorCode.UNAUTHORIZED = GrpcErrorCode.UNAUTHORIZED,
  message?: string,
): Promise<ErroredGrpcResponse> => {
  const defaultMessages = {
    [GrpcErrorCode.INVALID_CREDENTIALS]: "Invalid credentials provided",
    [GrpcErrorCode.TOKEN_EXPIRED]: "Authentication token has expired",
    [GrpcErrorCode.TOKEN_INVALID]: "Invalid authentication token",
    [GrpcErrorCode.UNAUTHORIZED]: "Authentication required",
  };

  return formatGrpcError(code, message || defaultMessages[code]);
};

/**
 * Creates an errored gRPC response for user-related errors
 */
export const formatGrpcUserError = (
  code:
    | GrpcErrorCode.USER_ALREADY_EXISTS
    | GrpcErrorCode.USER_NOT_FOUND
    | GrpcErrorCode.INVALID_EMAIL
    | GrpcErrorCode.INVALID_USERNAME
    | GrpcErrorCode.WEAK_PASSWORD,
  message?: string,
  errors?: { [key: string]: string[] },
): Promise<ErroredGrpcResponse> => {
  const defaultMessages = {
    [GrpcErrorCode.USER_ALREADY_EXISTS]: "User already exists",
    [GrpcErrorCode.USER_NOT_FOUND]: "User not found",
    [GrpcErrorCode.INVALID_EMAIL]: "Invalid email address",
    [GrpcErrorCode.INVALID_USERNAME]: "Invalid username",
    [GrpcErrorCode.WEAK_PASSWORD]: "Password does not meet requirements",
  };

  return formatGrpcError(code, message || defaultMessages[code], errors);
};

/**
 * Creates an errored gRPC response for internal server errors
 */
export const formatGrpcInternalError = (
  message = "Internal server error occurred",
  code: GrpcErrorCode = GrpcErrorCode.INTERNAL_ERROR,
): Promise<ErroredGrpcResponse> => {
  return formatGrpcError(code, message);
};

/**
 * Creates and throws a gRPC error with rich context
 */
export const throwGrpcError = (
  code: GrpcErrorCode,
  context: ErrorContext = {},
  additionalParams?: Record<string, unknown>,
): never => {
  throw createGrpcError(code, context, undefined, additionalParams);
};

/**
 * Converts a thrown gRPC error to a formatted response
 */
export const handleGrpcError = async (
  error: unknown,
  fallbackMessage = "An unexpected error occurred",
): Promise<ErroredGrpcResponse> => {
  if (isGrpcError(error)) {
    return error.toGrpcResponse();
  }

  // Handle regular errors by converting them to internal errors
  const message = error instanceof Error ? error.message : fallbackMessage;
  return formatGrpcError(GrpcErrorCode.INTERNAL_ERROR, message);
};

/**
 * Async wrapper that catches and formats gRPC errors
 */
export const withGrpcErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: ErrorContext = {},
): Promise<GrpcResponse<T>> => {
  try {
    const result = await operation();
    return formatGrpcResponse(result);
  } catch (error) {
    if (isGrpcError(error)) {
      // Merge operation context with error context
      error.context.operation = error.context.operation || context.operation;
      error.context.service = error.context.service || context.service;
      error.context.requestId = error.context.requestId || context.requestId;
      return error.toGrpcResponse();
    }

    // Convert unknown errors to internal errors with context
    const internalError = createGrpcError(GrpcErrorCode.INTERNAL_ERROR, {
      ...context,
      metadata: {
        originalError: error instanceof Error ? error.message : String(error),
      },
    });
    return internalError.toGrpcResponse();
  }
};

/**
 * Creates a validation error with field-specific messages
 */
export const throwValidationError = (
  validationErrors: { [key: string]: string[] },
  context: ErrorContext = {},
): never => {
  throw createGrpcError(GrpcErrorCode.VALIDATION_ERROR, context, undefined, {
    validationErrors,
  });
};

/**
 * Creates a user error and throws it
 */
export const throwUserError = (
  code:
    | GrpcErrorCode.USER_ALREADY_EXISTS
    | GrpcErrorCode.USER_NOT_FOUND
    | GrpcErrorCode.INVALID_EMAIL
    | GrpcErrorCode.INVALID_USERNAME
    | GrpcErrorCode.WEAK_PASSWORD
    | GrpcErrorCode.USER_NOT_VERIFIED,
  context: ErrorContext = {},
): never => {
  throw createGrpcError(code, context);
};

/**
 * Creates an authentication error and throws it
 */
export const throwAuthError = (
  code:
    | GrpcErrorCode.INVALID_CREDENTIALS
    | GrpcErrorCode.TOKEN_EXPIRED
    | GrpcErrorCode.TOKEN_INVALID
    | GrpcErrorCode.UNAUTHORIZED,
  context: ErrorContext = {},
): never => {
  throw createGrpcError(code, context);
};

/**
 * Creates a permission error and throws it
 */
export const throwPermissionError = (
  code: GrpcErrorCode.FORBIDDEN | GrpcErrorCode.INSUFFICIENT_PERMISSIONS,
  context: ErrorContext = {},
  requiredPermissions?: string[],
): never => {
  throw createGrpcError(code, context, undefined, { requiredPermissions });
};

/**
 * Creates a resource error and throws it
 */
export const throwResourceError = (
  code:
    | GrpcErrorCode.RESOURCE_NOT_FOUND
    | GrpcErrorCode.RESOURCE_CONFLICT
    | GrpcErrorCode.RESOURCE_EXPIRED,
  context: ErrorContext = {},
  resourceParams?: {
    resourceType?: string;
    resourceId?: string;
    conflictReason?: string;
    expirationTime?: Date;
  },
): never => {
  throw createGrpcError(code, context, undefined, resourceParams);
};
