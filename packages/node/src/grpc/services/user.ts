import { DeepPartial } from "@mikro-orm/core";
import type { EmptyResponse, Service } from ".";
import { CreateUserDto, UpdateUserDto } from "../../rest";
import { User, UserIdentifier } from "../../types";

export interface GetUserRequest {
  id: string;
}

export interface GetUserByEmailRequest {
  email: string;
}

export interface CheckUserExistsRequest {
  identifier: string;
}

export interface CreateUserRequest extends CreateUserDto {}

export interface UpdateUserRequest extends UpdateUserDto {}

export interface DeleteUserRequest {
  id: string;
}

interface CheckUserExistsResponse {
  exists: boolean;
  identifier: DeepPartial<UserIdentifier>;
  suggestions: string[];
}

export type UserResponse = User;

export type UserServices =
  | Service<"UserService", "GetUser", GetUserRequest, UserResponse>
  | Service<
      "UserService",
      "GetUserByEmail",
      GetUserByEmailRequest,
      UserResponse
    >
  | Service<
      "UserService",
      "CheckUserExists",
      CheckUserExistsRequest,
      CheckUserExistsResponse
    >
  | Service<"UserService", "CreateUser", CreateUserRequest, UserResponse>
  | Service<"UserService", "UpdateUser", UpdateUserRequest, EmptyResponse>
  | Service<"UserService", "DeleteUser", DeleteUserRequest, EmptyResponse>;
