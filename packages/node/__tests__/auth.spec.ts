import {
  Currency,
  Language,
  OAuthProvidersEnum,
  type User,
  UserRole,
  zymu,
} from "../src";

const userMock: User = {
  id: "123",
  identifier: {
    stripeCustomerId: "cus_123",
    username: "testuser",
  },
  identity: {
    displayName: "Test User",
    firstName: "Test",
    lastName: "User",
    fullName: "Test User",
    bio: "Test bio",
    birthDate: new Date("1990-01-01"),
    pronouns: "he/him",
  },
  addresses: [],
  password: "password123",
  role: UserRole.User,
  settings: {
    allowDirectMessages: true,
    allowMentions: true,
    allowTagging: true,
    allowTracking: true,
    currency: Currency.EUR,
    language: Language.EN,
    notifications: {
      email: {
        messages: true,
        newsletter: false,
      },
      push: {
        message: true,
      },
    },
    twoFactorAuthentication: {
      enabled: false,
      method: "sms",
    },
  },
  connections: [],
  credentials: {
    lastPassword: "password123",
    passwordUpdatedAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    version: 1,
  },
  metadata: {
    verification: {
      email: {
        verified: true,
        verifiedAt: new Date("2023-01-01"),
      },
      phoneNumber: {
        verified: false,
        verifiedAt: null,
      },
    },
  },
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
};

describe("auth", () => {
  let app: zymu;

  beforeEach(() => {
    app = new zymu({
      baseURL: "",
    });
  });

  it("can authenticate with valid credentials and return user data", async () => {
    const mockSignIn = jest
      .spyOn(app.auth, "signIn")
      .mockResolvedValue(userMock);

    const result = await app.auth.signIn({
      identifier: "testuser",
      password: "password123",
    });

    expect(result).toEqual(userMock);
    expect(mockSignIn).toHaveBeenCalledWith({
      identifier: "testuser",
      password: "password123",
    });

    mockSignIn.mockRestore();
  });

  it("can create a new user and return user data", async () => {
    const mockSignUp = jest
      .spyOn(app.auth, "signUp")
      .mockResolvedValue(userMock);

    const result = await app.auth.signUp({
      identifier: {
        username: "testuser",
      },
      identity: {
        displayName: "Test User",
      },
      password: "password123",
    });

    expect(result).toEqual(userMock);
    expect(mockSignUp).toHaveBeenCalledWith({
      identifier: {
        username: "testuser",
      },
      identity: {
        displayName: "Test User",
      },
      password: "password123",
    });

    mockSignUp.mockRestore();
  });

  it("can refresh the access token", async () => {
    const mockRefreshToken = jest
      .spyOn(app.auth, "refreshToken")
      .mockResolvedValue(null);

    const result = await app.auth.refreshToken();

    expect(result).toBeNull();
    expect(mockRefreshToken).toHaveBeenCalled();

    mockRefreshToken.mockRestore();
  });

  it("can sign out", async () => {
    const mockSignOut = jest.spyOn(app.auth, "signOut").mockResolvedValue(null);

    const result = await app.auth.signOut();

    expect(result).toBeNull();
    expect(mockSignOut).toHaveBeenCalled();

    mockSignOut.mockRestore();
  });

  it("can get oauth2 providers", async () => {
    const mockProviders = jest.spyOn(app.auth, "providers").mockResolvedValue([
      {
        id: OAuthProvidersEnum.Google,
        name: "Google",
        url: "https://google.com",
      },
      {
        id: OAuthProvidersEnum.Discord,
        name: "Discord",
        url: "https://discord.com",
      },
    ]);

    const result = await app.auth.providers();

    expect(result).toEqual([
      {
        id: OAuthProvidersEnum.Google,
        name: "Google",
        url: "https://google.com",
      },
      {
        id: OAuthProvidersEnum.Discord,
        name: "Discord",
        url: "https://discord.com",
      },
    ]);
    expect(mockProviders).toHaveBeenCalled();

    mockProviders.mockRestore();
  });

  it("can't connect to oauth2 providers if not in browser", async () => {
    for (const provider of Object.values(OAuthProvidersEnum)) {
      if ([OAuthProvidersEnum.Local].includes(provider)) continue;

      expect(() => {
        // @ts-expect-error
        app.auth.oauth2[provider].connect({
          redirect_uri: "https://zymu.dev",
        });
      }).toThrow(`${provider} oauth2 is only available in the browser`);
    }
  });
});
