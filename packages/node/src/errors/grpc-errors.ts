import { GrpcErrorCode, ErroredGrpcResponse, GrpcMetadata } from "../grpc";

/**
 * Context interface for providing additional error information
 */
export interface ErrorContext {
  /** The operation that was being performed when the error occurred */
  operation?: string;
  /** The resource identifier (user ID, email, etc.) involved in the error */
  resourceId?: string;
  /** The service or component where the error originated */
  service?: string;
  /** Additional metadata about the error */
  metadata?: Record<string, unknown>;
  /** Validation errors with field-specific messages */
  validationErrors?: { [key: string]: string[] };
  /** Stack trace or debugging information */
  debugInfo?: string;
  /** Request ID for tracing */
  requestId?: string;
  /** User-friendly suggestions for resolution */
  suggestions?: string[];
  /** HTTP status code equivalent */
  httpStatus?: number;
  /** Whether this error should be logged */
  shouldLog?: boolean;
  /** Error severity level */
  severity?: "low" | "medium" | "high" | "critical";
}

/**
 * Base class for all gRPC throwable errors with rich context
 */
export abstract class BaseGrpcError extends Error {
  public readonly code: GrpcErrorCode;
  public readonly context: ErrorContext;
  public readonly timestamp: Date;
  public readonly grpcMetadata?: GrpcMetadata;

  constructor(
    code: GrpcErrorCode,
    message: string,
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = {
      shouldLog: true,
      severity: "medium",
      ...context,
    };
    this.timestamp = new Date();
    this.grpcMetadata = grpcMetadata;

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts the error to an ErroredGrpcResponse
   */
  toGrpcResponse(): ErroredGrpcResponse {
    return {
      success: false,
      code: this.code,
      message: this.message,
      errors: this.context.validationErrors,
    };
  }

  /**
   * Returns a user-friendly version of the error
   */
  toUserFriendlyMessage(): string {
    return this.message;
  }

  /**
   * Returns detailed error information for logging
   */
  toLogContext(): Record<string, unknown> {
    return {
      errorCode: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      operation: this.context.operation,
      resourceId: this.context.resourceId,
      service: this.context.service,
      requestId: this.context.requestId,
      severity: this.context.severity,
      httpStatus: this.context.httpStatus,
      metadata: this.context.metadata,
      validationErrors: this.context.validationErrors,
      suggestions: this.context.suggestions,
      stack: this.stack,
    };
  }

  /**
   * Creates a formatted error message with context
   */
  getDetailedMessage(): string {
    const parts = [this.message];

    if (this.context.operation) {
      parts.push(`Operation: ${this.context.operation}`);
    }

    if (this.context.resourceId) {
      parts.push(`Resource: ${this.context.resourceId}`);
    }

    if (this.context.service) {
      parts.push(`Service: ${this.context.service}`);
    }

    if (this.context.requestId) {
      parts.push(`Request ID: ${this.context.requestId}`);
    }

    if (this.context.suggestions?.length) {
      parts.push(`Suggestions: ${this.context.suggestions.join(", ")}`);
    }

    return parts.join(" | ");
  }
}

// Authentication Errors
export class InvalidCredentialsError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.INVALID_CREDENTIALS,
      "Invalid credentials provided",
      {
        ...context,
        httpStatus: 401,
        severity: "medium",
        suggestions: [
          "Check your username and password",
          "Ensure your account is not locked",
        ],
      },
      grpcMetadata,
    );
  }
}

export class TokenExpiredError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.TOKEN_EXPIRED,
      "Authentication token has expired",
      {
        ...context,
        httpStatus: 401,
        severity: "low",
        suggestions: ["Refresh your authentication token", "Sign in again"],
      },
      grpcMetadata,
    );
  }
}

export class TokenInvalidError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.TOKEN_INVALID,
      "Invalid authentication token",
      {
        ...context,
        httpStatus: 401,
        severity: "medium",
        suggestions: [
          "Check token format",
          "Ensure token was not tampered with",
        ],
      },
      grpcMetadata,
    );
  }
}

export class UnauthorizedError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.UNAUTHORIZED,
      "Authentication required",
      {
        ...context,
        httpStatus: 401,
        severity: "medium",
        suggestions: ["Sign in to continue", "Check authentication headers"],
      },
      grpcMetadata,
    );
  }
}

// User Management Errors
export class UserAlreadyExistsError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.USER_ALREADY_EXISTS,
      "User already exists",
      {
        ...context,
        httpStatus: 409,
        severity: "low",
        suggestions: [
          "Try signing in instead",
          "Use a different email address",
          "Reset password if needed",
        ],
      },
      grpcMetadata,
    );
  }
}

export class UserNotFoundError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.USER_NOT_FOUND,
      "User not found",
      {
        ...context,
        httpStatus: 404,
        severity: "medium",
        suggestions: [
          "Check the user identifier",
          "Verify the user exists in the system",
        ],
      },
      grpcMetadata,
    );
  }
}

export class InvalidEmailError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.INVALID_EMAIL,
      "Invalid email address",
      {
        ...context,
        httpStatus: 400,
        severity: "low",
        suggestions: [
          "Check email format (user@domain.com)",
          "Remove extra spaces",
        ],
      },
      grpcMetadata,
    );
  }
}

export class InvalidUsernameError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.INVALID_USERNAME,
      "Invalid username",
      {
        ...context,
        httpStatus: 400,
        severity: "low",
        suggestions: [
          "Username must be 3-48 characters",
          "Use only letters, numbers, and underscores",
          "Start with a letter or number",
        ],
      },
      grpcMetadata,
    );
  }
}

export class WeakPasswordError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.WEAK_PASSWORD,
      "Password does not meet requirements",
      {
        ...context,
        httpStatus: 400,
        severity: "low",
        suggestions: [
          "Use at least 8 characters",
          "Include uppercase and lowercase letters",
          "Add numbers or special characters",
        ],
      },
      grpcMetadata,
    );
  }
}

export class UserNotVerifiedError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.USER_NOT_VERIFIED,
      "User account not verified",
      {
        ...context,
        httpStatus: 403,
        severity: "medium",
        suggestions: [
          "Check your email for verification link",
          "Resend verification email",
        ],
      },
      grpcMetadata,
    );
  }
}

// Validation Errors
export class ValidationError extends BaseGrpcError {
  constructor(
    validationErrors: { [key: string]: string[] },
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(
      GrpcErrorCode.VALIDATION_ERROR,
      "Validation failed",
      {
        ...context,
        validationErrors,
        httpStatus: 400,
        severity: "low",
        suggestions: ["Review and correct the highlighted fields"],
      },
      grpcMetadata,
    );
  }
}

export class InvalidInputError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.INVALID_INPUT,
      "Invalid input provided",
      {
        ...context,
        httpStatus: 400,
        severity: "low",
        suggestions: ["Check input format and requirements"],
      },
      grpcMetadata,
    );
  }
}

export class MissingRequiredFieldsError extends BaseGrpcError {
  constructor(
    missingFields: string[],
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(
      GrpcErrorCode.MISSING_REQUIRED_FIELDS,
      `Missing required fields: ${missingFields.join(", ")}`,
      {
        ...context,
        httpStatus: 400,
        severity: "low",
        metadata: { missingFields },
        suggestions: [`Provide values for: ${missingFields.join(", ")}`],
      },
      grpcMetadata,
    );
  }
}

// Permission Errors
export class ForbiddenError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.FORBIDDEN,
      "Access forbidden",
      {
        ...context,
        httpStatus: 403,
        severity: "medium",
        suggestions: [
          "Contact administrator for access",
          "Check your permissions",
        ],
      },
      grpcMetadata,
    );
  }
}

export class InsufficientPermissionsError extends BaseGrpcError {
  constructor(
    requiredPermissions: string[],
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(
      GrpcErrorCode.INSUFFICIENT_PERMISSIONS,
      `Insufficient permissions. Required: ${requiredPermissions.join(", ")}`,
      {
        ...context,
        httpStatus: 403,
        severity: "medium",
        metadata: { requiredPermissions },
        suggestions: [
          "Request additional permissions",
          "Contact administrator",
        ],
      },
      grpcMetadata,
    );
  }
}

// Rate Limiting Errors
export class RateLimitedError extends BaseGrpcError {
  constructor(
    retryAfter?: number,
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(
      GrpcErrorCode.RATE_LIMITED,
      "Rate limit exceeded",
      {
        ...context,
        httpStatus: 429,
        severity: "low",
        metadata: { retryAfter },
        suggestions: [
          retryAfter ? `Try again in ${retryAfter} seconds` : "Try again later",
          "Reduce request frequency",
        ],
      },
      grpcMetadata,
    );
  }
}

export class TooManyRequestsError extends BaseGrpcError {
  constructor(
    timeWindow?: string,
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(
      GrpcErrorCode.TOO_MANY_REQUESTS,
      "Too many requests",
      {
        ...context,
        httpStatus: 429,
        severity: "low",
        metadata: { timeWindow },
        suggestions: [
          timeWindow
            ? `Wait for the ${timeWindow} window to reset`
            : "Wait before making more requests",
          "Implement request batching",
        ],
      },
      grpcMetadata,
    );
  }
}

// Server Errors
export class InternalError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.INTERNAL_ERROR,
      "Internal server error occurred",
      {
        ...context,
        httpStatus: 500,
        severity: "high",
        shouldLog: true,
        suggestions: ["Try again later", "Contact support if problem persists"],
      },
      grpcMetadata,
    );
  }
}

export class ServiceUnavailableError extends BaseGrpcError {
  constructor(
    estimatedRecoveryTime?: string,
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(
      GrpcErrorCode.SERVICE_UNAVAILABLE,
      "Service temporarily unavailable",
      {
        ...context,
        httpStatus: 503,
        severity: "high",
        metadata: { estimatedRecoveryTime },
        suggestions: [
          estimatedRecoveryTime
            ? `Try again after ${estimatedRecoveryTime}`
            : "Try again later",
          "Check service status page",
        ],
      },
      grpcMetadata,
    );
  }
}

export class DatabaseError extends BaseGrpcError {
  constructor(context: ErrorContext = {}, grpcMetadata?: GrpcMetadata) {
    super(
      GrpcErrorCode.DATABASE_ERROR,
      "Database error occurred",
      {
        ...context,
        httpStatus: 500,
        severity: "critical",
        shouldLog: true,
        suggestions: ["Try again later", "Contact support if problem persists"],
      },
      grpcMetadata,
    );
  }
}

export class ExternalServiceError extends BaseGrpcError {
  constructor(
    serviceName?: string,
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(
      GrpcErrorCode.EXTERNAL_SERVICE_ERROR,
      serviceName
        ? `External service error: ${serviceName}`
        : "External service error",
      {
        ...context,
        httpStatus: 503,
        severity: "high",
        metadata: { serviceName },
        suggestions: ["Try again later", "Check external service status"],
      },
      grpcMetadata,
    );
  }
}

// Resource Errors
export class ResourceNotFoundError extends BaseGrpcError {
  constructor(
    resourceType?: string,
    resourceId?: string,
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    const message =
      resourceType && resourceId
        ? `${resourceType} with ID ${resourceId} not found`
        : "Resource not found";

    super(
      GrpcErrorCode.RESOURCE_NOT_FOUND,
      message,
      {
        ...context,
        resourceId,
        httpStatus: 404,
        severity: "medium",
        metadata: { resourceType, resourceId },
        suggestions: [
          "Check the resource identifier",
          "Verify the resource exists",
        ],
      },
      grpcMetadata,
    );
  }
}

export class ResourceConflictError extends BaseGrpcError {
  constructor(
    conflictReason?: string,
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    super(
      GrpcErrorCode.RESOURCE_CONFLICT,
      conflictReason
        ? `Resource conflict: ${conflictReason}`
        : "Resource conflict",
      {
        ...context,
        httpStatus: 409,
        severity: "medium",
        metadata: { conflictReason },
        suggestions: [
          "Refresh and try again",
          "Check for concurrent modifications",
        ],
      },
      grpcMetadata,
    );
  }
}

export class ResourceExpiredError extends BaseGrpcError {
  constructor(
    resourceType?: string,
    expirationTime?: Date,
    context: ErrorContext = {},
    grpcMetadata?: GrpcMetadata,
  ) {
    const message = resourceType
      ? `${resourceType} has expired`
      : "Resource has expired";

    super(
      GrpcErrorCode.RESOURCE_EXPIRED,
      message,
      {
        ...context,
        httpStatus: 410,
        severity: "medium",
        metadata: {
          resourceType,
          expirationTime: expirationTime?.toISOString(),
        },
        suggestions: ["Request a new resource", "Check expiration policies"],
      },
      grpcMetadata,
    );
  }
}

/**
 * Factory function to create gRPC errors from error codes with context
 */
export function createGrpcError(
  code: GrpcErrorCode,
  context: ErrorContext = {},
  grpcMetadata?: GrpcMetadata,
  additionalParams?: Record<string, unknown>,
): BaseGrpcError {
  switch (code) {
    case GrpcErrorCode.INVALID_CREDENTIALS:
      return new InvalidCredentialsError(context, grpcMetadata);
    case GrpcErrorCode.TOKEN_EXPIRED:
      return new TokenExpiredError(context, grpcMetadata);
    case GrpcErrorCode.TOKEN_INVALID:
      return new TokenInvalidError(context, grpcMetadata);
    case GrpcErrorCode.UNAUTHORIZED:
      return new UnauthorizedError(context, grpcMetadata);
    case GrpcErrorCode.USER_ALREADY_EXISTS:
      return new UserAlreadyExistsError(context, grpcMetadata);
    case GrpcErrorCode.USER_NOT_FOUND:
      return new UserNotFoundError(context, grpcMetadata);
    case GrpcErrorCode.INVALID_EMAIL:
      return new InvalidEmailError(context, grpcMetadata);
    case GrpcErrorCode.INVALID_USERNAME:
      return new InvalidUsernameError(context, grpcMetadata);
    case GrpcErrorCode.WEAK_PASSWORD:
      return new WeakPasswordError(context, grpcMetadata);
    case GrpcErrorCode.USER_NOT_VERIFIED:
      return new UserNotVerifiedError(context, grpcMetadata);
    case GrpcErrorCode.VALIDATION_ERROR:
      return new ValidationError(
        (additionalParams?.validationErrors as { [key: string]: string[] }) ||
          {},
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.INVALID_INPUT:
      return new InvalidInputError(context, grpcMetadata);
    case GrpcErrorCode.MISSING_REQUIRED_FIELDS:
      return new MissingRequiredFieldsError(
        (additionalParams?.missingFields as string[]) || [],
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.FORBIDDEN:
      return new ForbiddenError(context, grpcMetadata);
    case GrpcErrorCode.INSUFFICIENT_PERMISSIONS:
      return new InsufficientPermissionsError(
        (additionalParams?.requiredPermissions as string[]) || [],
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.RATE_LIMITED:
      return new RateLimitedError(
        additionalParams?.retryAfter as number,
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.TOO_MANY_REQUESTS:
      return new TooManyRequestsError(
        additionalParams?.timeWindow as string,
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.INTERNAL_ERROR:
      return new InternalError(context, grpcMetadata);
    case GrpcErrorCode.SERVICE_UNAVAILABLE:
      return new ServiceUnavailableError(
        additionalParams?.estimatedRecoveryTime as string,
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.DATABASE_ERROR:
      return new DatabaseError(context, grpcMetadata);
    case GrpcErrorCode.EXTERNAL_SERVICE_ERROR:
      return new ExternalServiceError(
        additionalParams?.serviceName as string,
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.RESOURCE_NOT_FOUND:
      return new ResourceNotFoundError(
        additionalParams?.resourceType as string,
        additionalParams?.resourceId as string,
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.RESOURCE_CONFLICT:
      return new ResourceConflictError(
        additionalParams?.conflictReason as string,
        context,
        grpcMetadata,
      );
    case GrpcErrorCode.RESOURCE_EXPIRED:
      return new ResourceExpiredError(
        additionalParams?.resourceType as string,
        additionalParams?.expirationTime as Date,
        context,
        grpcMetadata,
      );
    default:
      return new InternalError(
        { ...context, metadata: { originalCode: code, ...context.metadata } },
        grpcMetadata,
      );
  }
}

/**
 * Utility function to check if an error is a gRPC error
 */
export function isGrpcError(error: unknown): error is BaseGrpcError {
  return error instanceof BaseGrpcError;
}

/**
 * Utility function to extract error context for logging
 */
export function extractErrorContext(error: unknown): Record<string, unknown> {
  if (isGrpcError(error)) {
    return error.toLogContext();
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  return {
    error: String(error),
  };
}
