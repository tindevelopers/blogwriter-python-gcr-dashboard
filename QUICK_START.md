# Quick Start Guide

Get up and running with the BlogWriter monorepo in minutes.

## Prerequisites

- Node.js 18 or higher
- npm 10 or higher
- Git

## Installation

```bash
# Clone the repository (if not already done)
cd /Users/gene/Projects/blogwriter-python-gcr-dashboard

# Install all dependencies
npm install

# This will install dependencies for:
# - Root workspace
# - apps/dashboard
# - packages/ui
```

## Development

```bash
# Start the dashboard in development mode
npm run dev

# The dashboard will be available at:
# http://localhost:3000
```

## Project Structure

```
blogwriter-python-gcr-dashboard/
├── apps/
│   └── dashboard/              # Main Next.js dashboard app
│       ├── app/               # Next.js app directory
│       ├── lib/               # Utilities and API clients
│       └── package.json       # Dashboard dependencies
│
├── packages/
│   └── ui/                    # Shared Catalyst UI components
│       ├── src/               # Component source files
│       └── package.json       # UI package config
│
├── turbo.json                 # Turborepo configuration
├── package.json               # Root workspace config
└── tsconfig.base.json         # Shared TypeScript config
```

## Common Commands

```bash
# Development
npm run dev              # Start all apps in dev mode
npm run build            # Build all apps for production
npm run start            # Start production builds

# Code Quality
npm run lint             # Lint all code
npm run type-check       # Type check all code
npm run format           # Format all code with Prettier

# Maintenance
npm run clean            # Clean all build artifacts
```

## Working with Components

### Using Existing Components

```tsx
// In any app (e.g., apps/dashboard)
import { Button } from '@repo/ui/button'
import { Table } from '@repo/ui/table'
import { Heading } from '@repo/ui/heading'

export default function MyPage() {
  return (
    <div>
      <Heading>My Page</Heading>
      <Button>Click me</Button>
      <Table />
    </div>
  )
}
```

### Adding New Components

1. Create the component in `packages/ui/src/my-component.tsx`
2. Add export to `packages/ui/package.json`:
   ```json
   {
     "exports": {
       "./my-component": "./src/my-component.tsx"
     }
   }
   ```
3. Use it: `import { MyComponent } from '@repo/ui/my-component'`

## Environment Setup

### Dashboard App

Create `apps/dashboard/.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Troubleshooting

### "Cannot find module '@repo/ui/...'"

1. Run `npm install` at the root
2. Restart your IDE/TypeScript server
3. Check that the component is exported in `packages/ui/package.json`

### Build Fails

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
cd apps/dashboard
PORT=3001 npm run dev
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. 🔄 Configure environment variables
4. 🔄 Set up Firebase
5. 🔄 Configure LLM providers
6. 🔄 Deploy to production

## Learn More

- [Full README](./README.md) - Complete documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Understanding the monorepo structure
- [Dashboard README](./apps/dashboard/README.md) - Dashboard-specific docs
- [UI Package README](./packages/ui/README.md) - Component library docs

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the migration guide
3. Check Turborepo docs: https://turbo.build/repo/docs

