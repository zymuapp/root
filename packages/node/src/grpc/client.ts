import type { ServiceNames, Services } from "./services";

export enum GrpcErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
  TOKEN_INVALID = "AUTH_TOKEN_INVALID",
  USER_NOT_FOUND = "AUTH_USER_NOT_FOUND",
  UNAUTHORIZED = "AUTH_UNAUTHORIZED",

  // User management errors
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  INVALID_EMAIL = "USER_INVALID_EMAIL",
  INVALID_USERNAME = "USER_INVALID_USERNAME",
  WEAK_PASSWORD = "USER_WEAK_PASSWORD",
  USER_NOT_VERIFIED = "USER_NOT_VERIFIED",

  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_FIELDS = "MISSING_REQUIRED_FIELDS",

  // Permission errors
  FORBIDDEN = "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

  // Rate limiting
  RATE_LIMITED = "RATE_LIMITED",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",

  // Server errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",

  // Resource errors
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_CONFLICT = "RESOURCE_CONFLICT",
  RESOURCE_EXPIRED = "RESOURCE_EXPIRED",
}

export type SucessfulGrpcResponse<T> = {
  success: true;
  data: T;
};

export type ErroredGrpcResponse = {
  success: false;
  code: GrpcErrorCode;
  message: string;
  errors?: {
    [key: string]: string[];
  };
};

export type GrpcResponse<T> = SucessfulGrpcResponse<T> | ErroredGrpcResponse;

export type PromisedGrpcResponse<T> = Promise<GrpcResponse<T>>;

export type GrpcMethodsFor<S extends ServiceNames> = Extract<
  Services,
  { service: S }
>["method"];

export type GrpcRequestFor<
  S extends ServiceNames,
  M extends GrpcMethodsFor<S>,
> = Extract<Services, { service: S; method: M }>["req"];

export type GrpcResponseFor<
  S extends ServiceNames,
  M extends GrpcMethodsFor<S>,
> = Extract<Services, { service: S; method: M }>["res"];

export type GrpcServiceResponse<
  S extends ServiceNames,
  M extends GrpcMethodsFor<S>,
> = GrpcResponse<Extract<Services, { service: S; method: M }>["res"]>;

export type PromisedServiceResponse<
  S extends ServiceNames,
  M extends GrpcMethodsFor<S>,
> = PromisedGrpcResponse<Extract<Services, { service: S; method: M }>["res"]>;

export interface GrpcMetadata {
  [key: string]: string | Buffer | string[] | Buffer[];
}

export class GrpcError<T> extends Error {
  constructor(
    public readonly data: ErroredGrpcResponse,
    public readonly metadata?: GrpcMetadata,
  ) {
    super(data.message);
  }
}
