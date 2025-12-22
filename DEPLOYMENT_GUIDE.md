# Vercel Deployment Guide for Turborepo

## Quick Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from Root**:
```bash
cd /Users/gene/Projects/blogwriter-python-gcr-dashboard
vercel
```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? (Select your account/team)
   - Link to existing project? **N**
   - What's your project's name? **blogwriter-dashboard**
   - In which directory is your code located? **apps/dashboard**
   - Want to override the settings? **N**

### Method 2: Using Vercel Dashboard

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/new
   - Click "Add New" → "Project"

2. **Import Your Repository**:
   - Select "Import Git Repository"
   - Choose: `tindevelopers/blogwriter-python-gcr-dashboard`
   - Click "Import"

3. **Configure Build Settings**:
   ```
   Framework Preset: Next.js
   Root Directory: apps/dashboard
   Build Command: cd ../.. && turbo run build --filter=@repo/dashboard
   Output Directory: .next (leave default)
   Install Command: npm install
   ```

4. **Environment Variables** (if needed):
   Add these in the Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## Vercel Configuration Files

Two `vercel.json` files have been added:

### Root Level (`/vercel.json`)
For deploying from the root of the monorepo.

### App Level (`/apps/dashboard/vercel.json`)
For deploying specifically the dashboard app.

## Important: Turborepo Build Settings

Vercel automatically detects Turborepo and:
- ✅ Caches Turbo builds
- ✅ Runs tasks in parallel
- ✅ Uses Remote Caching (if enabled)

### Enable Remote Caching (Optional but Recommended)

1. **Link your project**:
```bash
cd /Users/gene/Projects/blogwriter-python-gcr-dashboard
npx turbo login
npx turbo link
```

2. This enables:
   - Faster builds (up to 10x)
   - Shared cache across team
   - CI/CD optimization

## Deployment Workflow

### Automatic Deployments

Once connected, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

### Manual Deployments

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## Monorepo Structure on Vercel

Your Turborepo structure:
```
blogwriter-python-gcr-dashboard/
├── apps/
│   └── dashboard/         ← This will be deployed
├── packages/
│   └── ui/                ← Shared, used by dashboard
└── turbo.json
```

Vercel will:
1. Install dependencies at root
2. Build `@repo/ui` package first
3. Build `@repo/dashboard` app
4. Deploy `apps/dashboard`

## Environment Variables

### Required for Dashboard:
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Firebase (if using)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Demo Mode
If you don't set `NEXT_PUBLIC_API_URL`, the dashboard will run in **demo mode** with mock data.

## Troubleshooting

### Build Fails

1. **Check Root Directory**:
   - Must be set to: `apps/dashboard`

2. **Check Build Command**:
   ```bash
   cd ../.. && turbo run build --filter=@repo/dashboard
   ```

3. **Check Install Command**:
   ```bash
   npm install
   ```

### UI Components Not Found

Make sure build command includes going up to root (`cd ../..`) so Turbo can find all packages.

### Build Command Explanation

```bash
cd ../..  # Go to monorepo root
turbo run build --filter=@repo/dashboard  # Build dashboard and dependencies
```

The `--filter` flag tells Turbo to:
- Build `@repo/ui` first (dependency)
- Then build `@repo/dashboard`

## Production Checklist

Before deploying to production:

- [ ] Set environment variables in Vercel dashboard
- [ ] Test build locally: `npm run build`
- [ ] Configure custom domain (optional)
- [ ] Set up Firebase/backend connection
- [ ] Test demo mode works without backend
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error monitoring (Sentry, etc.)

## URLs After Deployment

You'll get:
- **Production**: `https://blogwriter-dashboard.vercel.app`
- **Preview**: `https://blogwriter-dashboard-git-[branch]-[team].vercel.app`

## Cost

- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for production projects
- Turborepo Remote Caching: Free on all plans

## Next Steps

1. Deploy using Method 1 or Method 2 above
2. Set environment variables
3. Test the deployment
4. Configure custom domain (optional)
5. Enable Remote Caching for faster builds

## Support

- Vercel Docs: https://vercel.com/docs
- Turborepo on Vercel: https://vercel.com/docs/monorepos/turborepo
- GitHub: https://github.com/tindevelopers/blogwriter-python-gcr-dashboard

Happy deploying! 🚀

