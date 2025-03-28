import { OAuthProvidersEnum } from "..";

import type { ParamValue } from "pathcat";
import type { Client, CreateUserDto, UserSignInDto } from "../rest";
import { isBrowser } from "../utils";
import { sdk } from "./builder";

export const auth = sdk((client) => ({
  signIn: async (data: UserSignInDto) => client.post("/auth/sign-in", data),
  signUp: async (data: CreateUserDto) => client.post("/auth/sign-up", data),
  signOut: async () => client.post("/auth/sign-out", null),
  refreshToken: async () => client.post("/auth/refresh-token", null),

  providers: async () => client.get("/auth/providers"),

  oauth2: {
    discord: {
      connect: (params: Record<string, ParamValue>) =>
        throwsOAuth2NotBrowser(client, OAuthProvidersEnum.Discord, params),
    },
    google: {
      connect: (params: Record<string, ParamValue>) =>
        throwsOAuth2NotBrowser(client, OAuthProvidersEnum.Google, params),
    },
    apple: {
      connect: (params: Record<string, ParamValue>) =>
        throwsOAuth2NotBrowser(client, OAuthProvidersEnum.Apple, params),
    },
    spotify: {
      connect: (params: Record<string, ParamValue>) =>
        throwsOAuth2NotBrowser(client, OAuthProvidersEnum.Spotify, params),
    },
    tiktok: {
      connect: (params: Record<string, ParamValue>) =>
        throwsOAuth2NotBrowser(client, OAuthProvidersEnum.Tiktok, params),
    },
    twitter: {
      connect: (params: Record<string, ParamValue>) =>
        throwsOAuth2NotBrowser(client, OAuthProvidersEnum.Twitter, params),
    },
  },
}));

const throwsOAuth2NotBrowser = (
  client: Client,
  type: OAuthProvidersEnum,
  params?: Record<string, ParamValue>,
) => {
  if (isBrowser) {
    window.location.href = client.url(`/oauth2/${type}`, params || {});
  } else {
    throw new Error(`${type} oauth2 is only available in the browser`);
  }
};
