# [@zymuapp](https://github.com/zymuapp)'s root

## Monorepo Structure

This project is a monorepo managed by [pnpm](https://pnpm.io/) and [Turborepo](https://turbo.build/repo). It's organized into two main directories:

- **`apps/`**: Contains deployable applications.
  - `docs/`: A Next.js application for package documentation and development tips.
  - `nest/`: A NestJS backend application.
  - `web/`: A Next.js frontend application.
- **`packages/`**: Contains reusable packages shared across applications.
  - `biome-config/`: Shared Biome (linter/formatter) configuration.
  - `nest/`: NestJS specific utilities and modules.
  - `node/`: Node.js specific utilities.
  - `react/`: React specific hooks and components.
  - `testing/`: Testing utilities and configurations.
  - `typescript-config/`: Shared TypeScript configurations.
  - `ui/`: UI components.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v8 or higher recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

### Running Development Servers

- **Start all applications in development mode:**
  ```bash
  pnpm dev
  ```
- **Start a specific application (e.g., `web`):**
  ```bash
  pnpm dev --filter web
  ```

### Specific Application/Package Commands

For more granular control, you can use the following scripts (ensure these are defined in the root `package.json`):

- **Build all packages:**
  ```bash
  pnpm build:packages
  ```
- **Run `docs` application in development mode:**
  ```bash
  pnpm dev:docs
  ```
- **Run `web` application in development mode:**
  ```bash
  pnpm dev:web
  ```
- **Run `nest` application in development mode:**
  ```bash
  pnpm dev:nest
  ```
- **Build `docs` application:**
  ```bash
  pnpm build:docs
  ```
- **Build `web` application:**
  ```bash
  pnpm build:web
  ```
- **Build `nest` application:**
  ```bash
  pnpm build:nest
  ```

### Building for Production

- **Build all applications and packages:**
  ```bash
  pnpm build
  ```
- **Build a specific application (e.g., `nest`):**
  ```bash
  pnpm build --filter nest
  ```

### Testing

- **Run all tests:**
  ```bash
  pnpm test
  ```
- **Run tests for a specific package (e.g., `node`):**
  ```bash
  pnpm test --filter @zymuapp/node # Assuming this is the package name in its package.json
  ```

### Linting and Formatting

- **Lint all packages:**
  ```bash
  pnpm lint
  ```
- **Format all packages:**
  ```bash
  pnpm format
  ```

### Package Releasing (Automated via Changesets & GitHub Actions)

This project uses [Changesets](https://github.com/changesets/changesets) along with GitHub Actions to automate package versioning and publishing. The process is managed by the workflow defined in `.github/workflows/release-packages.yml`.

**1. Adding a Changeset (Developer Workflow):**

- When you've made changes to a package that should be part of the next release, add a changeset on your development branch:
  ```bash
  pnpm changeset add
  ```
- Follow the prompts to select the packages you want to include and specify the version type (`major`, `minor`, or `patch`).
- Add a clear message describing your changes. This creates a new markdown file in the `.changeset` directory.
- Commit this changeset file along with your code changes to your development branch.

**2. Merging to Main (Maintainer Workflow):**

- Once the development branch (with the changeset file) is reviewed and approved by maintainers, it is merged into the `main` branch.

**3. Automated Versioning PR (Changesets GitHub Action):**

- When changesets are detected on the `main` branch, the `changesets/action` (configured in the release workflow) automatically:
    - Consumes the changeset files.
    - Updates the `package.json` versions for the affected packages.
    - Updates the `CHANGELOG.md` files for these packages.
    - Creates a new Pull Request (often named something like "Version Packages") targeting `main`. This PR contains all the version bumps and changelog updates.

**4. Approving the Versioning PR (Maintainer Workflow):**

- Maintainers review this automatically created "Version Packages" PR.
- If everything is correct, they approve and merge it into `main`.

**5. Automated Publishing (Changesets GitHub Action):**

- Upon merging the "Version Packages" PR into `main`, the same `changesets/action` (or a subsequent step in the workflow) automatically publishes the newly versioned packages to the configured package registry (e.g., npm).

**Key Points:**

- Developers primarily interact with `pnpm changeset add`.
- The versioning and publishing process is largely automated via GitHub Actions once changesets are on the `main` branch.
- Direct use of `pnpm changeset version` or `pnpm changeset publish` locally is generally not needed for the standard release process, as the CI/CD pipeline handles this.

## Package Scopes

Packages within this monorepo are typically scoped under `@zymuapp` (you might need to adjust this based on your actual npm organization or desired scope). This helps in:

- **Organization**: Clearly identifies packages belonging to this project.
- **Preventing Naming Conflicts**: Avoids conflicts with public npm packages.
- **Simplified Imports**: Allows for easy importing of internal packages, e.g., `import { something } from '@zymuapp/ui';`.

You can find the specific package names within each package's `package.json` file.

## Useful Links

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Documentation](https://pnpm.io/motivation)
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
