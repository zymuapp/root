export enum OAuthProvidersEnum {
	Local = "local",
	Discord = "discord",
	Google = "google",
	Apple = "apple",
	Spotify = "spotify",
	Tiktok = "tiktok",
	Twitch = "twitch",
	Twitter = "twitter",
}

export interface OAuthProvider {
	readonly id: OAuthProvidersEnum;
	readonly name: string;
	readonly url: string;
}
