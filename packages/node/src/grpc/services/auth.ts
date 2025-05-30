import type { EmptyRequest, EmptyResponse, Service } from ".";
import { UserSignInDto, UserSignUpDto } from "../../rest";

export interface SignUpRequest extends UserSignUpDto {}

export interface SignInRequest extends UserSignInDto {}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export type AuthServices =
  | Service<"AuthService", "SignUp", SignUpRequest, AuthResponse>
  | Service<"AuthService", "SignIn", SignInRequest, AuthResponse>
  | Service<"AuthService", "SignOut", EmptyRequest, EmptyResponse>
  | Service<"AuthService", "RefreshToken", RefreshTokenRequest, AuthResponse>;
