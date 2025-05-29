import type { Endpoint } from "..";
import type { OAuthProvider, User } from "../../../types";
import type { UserSignInDto, UserSignUpDto } from "../../dtos";

export type AuthEndpoints =
  // - Credentials
  | Endpoint<"POST", "/auth/sign-up", User, UserSignUpDto>
  | Endpoint<"POST", "/auth/sign-in", User, UserSignInDto>

  // - Magic Link
  //TODO: add Magic Link support

  // - General
  | Endpoint<"POST", "/auth/sign-out", null, null>
  | Endpoint<"POST", "/auth/refresh-token", null, null>
  | Endpoint<"GET", "/auth/providers", OAuthProvider[]>

  // - OAuth2 Discord
  | Endpoint<"GET", "/oauth2/discord", void>
  | Endpoint<"GET", "/oauth2/discord/callback", void>

  // - OAuth2 Google
  | Endpoint<"GET", "/oauth2/google", void>
  | Endpoint<"GET", "/oauth2/google/callback", void>

  // - OAuth2 Apple
  | Endpoint<"GET", "/oauth2/apple", void>
  | Endpoint<"GET", "/oauth2/apple/callback", void>

  // - OAuth2 Spotify
  | Endpoint<"GET", "/oauth2/spotify", void>
  | Endpoint<"GET", "/oauth2/spotify/callback", void>

  // - OAuth2 Tiktok
  | Endpoint<"GET", "/oauth2/tiktok", void>
  | Endpoint<"GET", "/oauth2/tiktok/callback", void>

  // - OAuth2 Twitch
  | Endpoint<"GET", "/oauth2/twitch", void>
  | Endpoint<"GET", "/oauth2/twitch/callback", void>

  // - OAuth2 Twitter
  | Endpoint<"GET", "/oauth2/twitter", void>
  | Endpoint<"GET", "/oauth2/twitter/callback", void>;
