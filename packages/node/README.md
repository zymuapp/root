# zymu

[![npm version](https://img.shields.io/npm/v/zymu.svg)](https://www.npmjs.com/package/zymu)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A TypeScript SDK for interacting with the Zymu API in Node.js applications.

## Installation

```bash
# Using npm
npm install zymu

# Using yarn
yarn add zymu

# Using pnpm
pnpm add zymu
```

## Quick Start

```typescript
import { zymu } from 'zymu';

// Initialize the SDK
const app = new zymu({
  baseURL: 'https://api.zymu.app'  // Default if not specified
});

// Authentication examples
async function authenticate() {
  try {
    // Sign up a new user
    const newUser = await app.auth.signUp({
      identifier: {
        username: 'newuser123',
      },
      identity: {
        displayName: 'New User',
      },
      password: 'Password123!',
    });
    console.log('User created:', newUser);
    
    // Sign in with credentials
    const user = await app.auth.signIn({
      identifier: 'myusername',
      password: 'MySecurePassword123!',
    });
    console.log('Signed in as:', user);
    
    // Get available OAuth providers
    const providers = await app.auth.providers();
    console.log('Available OAuth providers:', providers);
    
    // Sign out
    await app.auth.signOut();
    console.log('Signed out successfully');
  } catch (error) {
    console.error('Authentication error:', error);
  }
}
```

## Features

- **Authentication**: Sign up, sign in, sign out, and refresh tokens
- **OAuth2 Support**: Connect with Discord, Google, Apple, Spotify, TikTok, Twitch, and Twitter
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **HTTP Client**: Built-in REST client for making API requests
- **Validation**: Request and response validation using class-validator
- **Cross-platform**: Works in both Node.js and browser environments

## Authentication

### Sign Up

Create a new user account:

```typescript
const user = await app.auth.signUp({
  identifier: {
    username: 'newuser',
    // Optional fields
    email: 'user@example.com',
    phoneNumber: '+12345678901',
  },
  identity: {
    displayName: 'New User',
  },
  password: 'SecurePassword123!',
});
```

### Sign In

Authenticate using username/email and password:

```typescript
const user = await app.auth.signIn({
  identifier: 'username_or_email',
  password: 'YourPassword123!',
});
```

### OAuth2 Authentication

In browser environments, you can use OAuth providers:

```typescript
// Redirect to OAuth provider
app.auth.oauth2.google.connect({
  redirect_uri: 'https://yourapp.com/callback',
});

// Other providers
app.auth.oauth2.discord.connect({ redirect_uri: '...' });
app.auth.oauth2.apple.connect({ redirect_uri: '...' });
app.auth.oauth2.spotify.connect({ redirect_uri: '...' });
// etc.
```

### Token Management

Refresh authentication token:

```typescript
await app.auth.refreshToken();
```

Sign out:

```typescript
await app.auth.signOut();
```

## API Client

For direct API interactions:

```typescript
// GET request
const response = await app.client.get('/endpoint', { 
  param1: 'value1', 
  param2: 'value2' 
});

// POST request
const response = await app.client.post('/endpoint', { 
  field1: 'value1',
  field2: 'value2'
});

// Other methods
app.client.put(...);
app.client.patch(...);
app.client.delete(...);
```

## Types

The SDK includes comprehensive TypeScript definitions for all API entities:

- `User`: User profile and authentication data
- `UserIdentifier`: User identification fields
- `UserIdentity`: User profile information
- `UserSettings`: User preferences and settings
- And many more...

## Error Handling

The SDK throws typed errors that can be caught and handled:

```typescript
try {
  await app.auth.signIn({
    identifier: 'username',
    password: 'incorrect-password',
  });
} catch (error) {
  if (error.status === 401) {
    console.error('Invalid credentials');
  } else {
    console.error('Authentication error:', error.message);
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run check-types
```

## License

MIT © [zymuapp](https://github.com/zymuapp)