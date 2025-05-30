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
