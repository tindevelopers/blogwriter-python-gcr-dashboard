# Turborepo Migration Guide

This document explains the migration from a single Next.js app to a Turborepo monorepo structure.

## What Changed?

### Before (Single Repo)
```
blogwriter-python-gcr-dashboard/
├── app/
├── components/catalyst/
├── lib/
├── public/
├── package.json
└── tsconfig.json
```

### After (Turborepo Monorepo)
```
blogwriter-python-gcr-dashboard/
├── apps/
│   └── dashboard/          # Your Next.js app
├── packages/
│   └── ui/                 # Shared Catalyst components
├── turbo.json             # Turborepo config
├── package.json           # Root workspace config
└── tsconfig.base.json     # Shared TypeScript config
```

## Key Changes

### 1. Project Structure

- **Dashboard App**: Moved to `apps/dashboard/`
- **UI Components**: Extracted to `packages/ui/` as a shared package
- **Root**: Now manages the monorepo workspace

### 2. Import Paths

**Before:**
```tsx
import { Button } from '@/components/catalyst/button'
import { Table } from '@/components/catalyst/table'
```

**After:**
```tsx
import { Button } from '@repo/ui/button'
import { Table } from '@repo/ui/table'
```

### 3. Scripts

**Before:**
```bash
npm run dev    # Start Next.js
npm run build  # Build Next.js
```

**After:**
```bash
npm run dev    # Start all apps with Turbo
npm run build  # Build all apps with Turbo
```

### 4. Package Management

The monorepo uses npm workspaces. Dependencies are managed at two levels:

- **Root `package.json`**: Shared dev dependencies (Turbo, Prettier, TypeScript)
- **App/Package `package.json`**: Specific dependencies for each app/package

## Benefits

### 1. **Code Sharing**
- UI components are now in a shared package
- Easy to add more apps that use the same components
- Single source of truth for component code

### 2. **Better Organization**
- Clear separation between apps and packages
- Easier to understand project structure
- Scalable for future growth

### 3. **Optimized Builds**
- Turborepo caches build outputs
- Only rebuilds what changed
- Parallel execution of tasks

### 4. **Type Safety**
- TypeScript project references
- Better IDE support
- Faster type checking

## Development Workflow

### Starting Development

```bash
# From root - starts all apps
npm run dev

# From specific app
cd apps/dashboard
npm run dev
```

### Building

```bash
# Build everything
npm run build

# Build specific app
cd apps/dashboard
npm run build
```

### Adding Dependencies

```bash
# Add to dashboard app
cd apps/dashboard
npm install <package>

# Add to UI package
cd packages/ui
npm install <package>

# Add dev dependency to root
cd ../..
npm install -D <package>
```

### Creating New Components

1. Add component to `packages/ui/src/`
2. Export it in `packages/ui/package.json` exports field
3. Use it in any app with `import { Component } from '@repo/ui/component'`

## Future Expansion

This structure makes it easy to:

1. **Add new apps**: Create `apps/marketing`, `apps/blog`, etc.
2. **Add new packages**: Create `packages/utils`, `packages/api`, etc.
3. **Share code**: All apps can use shared packages
4. **Independent deployment**: Each app can be deployed separately

## Troubleshooting

### Import Errors

If you see "Cannot find module '@repo/ui/...'" errors:

1. Make sure you've run `npm install` at the root
2. Check that the component is exported in `packages/ui/package.json`
3. Restart your TypeScript server

### Build Errors

If builds fail:

1. Clean everything: `npm run clean`
2. Reinstall: `rm -rf node_modules package-lock.json && npm install`
3. Build again: `npm run build`

### Type Errors

If TypeScript can't find types:

1. Check `tsconfig.json` extends `../../tsconfig.base.json`
2. Verify TypeScript project references in root `tsconfig.json`
3. Restart your IDE

## Next Steps

1. ✅ Monorepo structure set up
2. ✅ Dashboard migrated to `apps/dashboard`
3. ✅ UI components extracted to `packages/ui`
4. ✅ Imports updated to use `@repo/ui`
5. 🔄 Test the application
6. 🔄 Deploy to production

## Questions?

- Check [Turborepo docs](https://turbo.build/repo/docs)
- Review individual package READMEs
- See root README.md for common commands

