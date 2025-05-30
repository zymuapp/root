import type { EmptyRequest, EmptyResponse, Service } from ".";
import { UserSignInDto, UserSignUpDto } from "../../rest";
import { User } from "../../types";

export interface SignUpRequest extends UserSignUpDto {}

export interface SignInRequest extends UserSignInDto {}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type AuthServices =
  | Service<"AuthService", "SignUp", SignUpRequest, AuthResponse>
  | Service<"AuthService", "SignIn", SignInRequest, AuthResponse>
  | Service<"AuthService", "SignOut", EmptyRequest, EmptyResponse>
  | Service<"AuthService", "RefreshToken", RefreshTokenRequest, AuthResponse>;
