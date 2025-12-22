# BlogWriter Monorepo

A Turborepo-powered monorepo for the BlogWriter Python GCR Dashboard and shared UI components.

## What's inside?

This monorepo uses [Turborepo](https://turbo.build/repo) and contains the following packages/apps:

### Apps

- `dashboard`: Next.js 16 dashboard application for managing LLM providers and monitoring blog generation

### Packages

- `@repo/ui`: Shared Catalyst UI component library used across applications

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account (for backend services)
- LLM API keys (OpenAI, Anthropic, etc.)

### Installation

```bash
# Install dependencies
npm install

# Start development
npm run dev
```

This will start all apps in development mode.

### Build

```bash
# Build all apps and packages
npm run build
```

### Development Workflow

```bash
# Run all apps in dev mode
npm run dev

# Lint all code
npm run lint

# Type-check all code
npm run type-check

# Format all code
npm run format

# Clean all build artifacts and node_modules
npm run clean
```

## Project Structure

```
blogwriter-monorepo/
├── apps/
│   └── dashboard/          # Main dashboard app
├── packages/
│   └── ui/                 # Shared UI components
├── turbo.json             # Turborepo configuration
├── package.json           # Root package.json
└── tsconfig.base.json     # Base TypeScript config
```

## Adding New Apps or Packages

1. Create a new folder in `apps/` or `packages/`
2. Add a `package.json` with a name following the pattern:
   - Apps: `@repo/app-name`
   - Packages: `@repo/package-name`
3. Add the app/package to the workspace in root `package.json`
4. Add TypeScript project reference in root `tsconfig.json`

## Using Shared Components

In any app, import shared UI components like this:

```tsx
import { Button } from '@repo/ui/button'
import { Table } from '@repo/ui/table'
```

## Deployment

See individual app READMEs for deployment instructions:
- [Dashboard Deployment](./apps/dashboard/README.md)

## Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Catalyst UI Kit](https://catalyst.tailwindui.com/)
