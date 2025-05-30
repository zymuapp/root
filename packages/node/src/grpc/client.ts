import type { ServiceNames, Services } from "./services";

export type SucessfulGrpcResponse<T> = {
  success: true;
  data: T;
};

export type ErroredGrpcResponse = {
  success: false;
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
