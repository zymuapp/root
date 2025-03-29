import type { Currency, Language, Location, UpdatableBaseEntity } from "..";

export type UserIdentifier = {
  email?: string;
  phoneNumber?: string;
  username: string;
  stripeCustomerId: string;

  [key: string]: string | undefined;
};

export type UserIdentity = {
  // - Profile
  displayName: string;
  bio: string;
  // TODO: Avatar system

  // - Personal
  firstName: string;
  lastName: string;
  fullName: string;
  pronouns: string;
  birthDate: Date;
};

export enum UserRole {
  User = "user",
  Moderator = "moderator",
  Developer = "developer",
  Admin = "admin",
}

export type UserAddressType = "shipping" | "billing";

export type UserAddress = Location & {
  type: UserAddressType;
  isDefault: boolean;
};

export interface UserCredentials {
  version: number;
  lastPassword: string;
  passwordUpdatedAt: Date;
  updatedAt: Date;
}

export type UserSettings = {
  // - General
  language: Language;
  currency: Currency;

  // - Privacy
  allowDirectMessages: boolean;
  allowMentions: boolean;
  allowTagging: boolean;
  allowTracking: boolean;

  // - Notifications
  notifications: {
    email: {
      newsletter: boolean;
      messages: boolean;
    };
    push: {
      message: boolean;
    };
  };

  // - Security
  twoFactorAuthentication: {
    enabled: boolean;
    method: "sms" | "email" | "authenticator";
  };
};

export type UserConnectionOS = {
  name: string;
  version: string;
};

export type UserConnectionDevice = {
  type: string;
  brand: string;
};

export type UserConnectionClient = {
  name: string;
  version: string;
};

export type UserConnection = {
  ip: string;
  os: UserConnectionOS;
  device: UserConnectionDevice;
  client: UserConnectionClient;
  updatedAt: Date;
  createdAt: Date;
};

export type UserMetadata = {
  // - Verification
  verification: {
    email: {
      verified: boolean;
      verifiedAt: Date | null;
    };
    phoneNumber: {
      verified: boolean;
      verifiedAt: Date | null;
    };
  };
};

export type User = UpdatableBaseEntity & {
  identifier: UserIdentifier;
  password: string;
  identity: UserIdentity;
  role: UserRole;
  addresses: UserAddress[];
  credentials: UserCredentials;
  settings: UserSettings;
  connections: UserConnection[];
  metadata: UserMetadata;
};
