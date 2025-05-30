import {
  GrpcMethodsFor,
  GrpcRequestFor,
  GrpcResponse,
  GrpcResponseFor,
} from "../client";
import type { AuthServices } from "./auth";
import type { UserServices } from "./user";

export type Service<
  ServiceName extends string,
  Method extends string,
  Req,
  Res,
> = {
  service: ServiceName;
  method: Method;
  req: Req;
  res: GrpcResponse<Res>;
};

export type ServiceClientInterface<S extends ServiceNames> = {
  [M in GrpcMethodsFor<S>]: (
    // @ts-ignore
    request: GrpcRequestFor<S, M>,
    // @ts-ignore
  ) => Promise<GrpcResponseFor<S, M>>;
};

export type CreateServiceClientInterface<S extends ServiceNames> =
  ServiceClientInterface<S>;

export type Services = AuthServices | UserServices;

export type ServiceNames = Services["service"];

export type EmptyRequest = object;

export type EmptyResponse = object;

// - Authentication
export * from "./auth";
export interface AuthServiceClient
  extends ServiceClientInterface<"AuthService"> {
  SignUp(
    request: GrpcRequestFor<"AuthService", "SignUp">,
  ): Promise<GrpcResponseFor<"AuthService", "SignUp">>;
  SignIn(
    request: GrpcRequestFor<"AuthService", "SignIn">,
  ): Promise<GrpcResponseFor<"AuthService", "SignIn">>;
  SignOut(
    request: GrpcRequestFor<"AuthService", "SignOut">,
  ): Promise<GrpcResponseFor<"AuthService", "SignOut">>;
  RefreshToken(
    request: GrpcRequestFor<"AuthService", "RefreshToken">,
  ): Promise<GrpcResponseFor<"AuthService", "RefreshToken">>;
}

// - User
export * from "./user";
export interface UserServiceClient
  extends ServiceClientInterface<"UserService"> {
  GetUsers(
    request: GrpcRequestFor<"UserService", "GetUsers">,
  ): Promise<GrpcResponseFor<"UserService", "GetUsers">>;
  GetUser(
    request: GrpcRequestFor<"UserService", "GetUser">,
  ): Promise<GrpcResponseFor<"UserService", "GetUser">>;
  GetUserByEmail(
    request: GrpcRequestFor<"UserService", "GetUserByEmail">,
  ): Promise<GrpcResponseFor<"UserService", "GetUserByEmail">>;
  CheckUserExists(
    request: GrpcRequestFor<"UserService", "CheckUserExists">,
  ): Promise<GrpcResponseFor<"UserService", "CheckUserExists">>;
  CreateUser(
    request: GrpcRequestFor<"UserService", "CreateUser">,
  ): Promise<GrpcResponseFor<"UserService", "CreateUser">>;
  UpdateUser(
    request: GrpcRequestFor<"UserService", "UpdateUser">,
  ): Promise<GrpcResponseFor<"UserService", "UpdateUser">>;
  DeleteUser(
    request: GrpcRequestFor<"UserService", "DeleteUser">,
  ): Promise<GrpcResponseFor<"UserService", "DeleteUser">>;
}
