# HR Portal Deployment Guide

## 🚀 Deploy to Production

Follow these steps to deploy your HR Portal to GitHub and Vercel.

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `hr-portal` (or your preferred name)
   - **Description**: `Complete HR Portal with Recruitment System`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

### Step 2: Connect Local Repository to GitHub

After creating the GitHub repository, run these commands in your terminal:

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/iAm-AliHaider/HR-Portal.git

# Rename main branch to match GitHub default
git branch -M main

# Push code to GitHub
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web` (important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to web directory
cd web

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? hr-portal
# - Directory? ./
# - Auto-deploy? Yes
```

### Step 4: Configure Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Click on "Environment Variables"
3. Add the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tqtwdkobrzzrhrqdxprs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdHdka29icnp6cmhycWR4cHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTU0MTgsImV4cCI6MjA2Mzg3MTQxOH0.xM1V6pUAOIrALa8E1o8Ma8j7csavI2kPjIfS6RPu15s
NODE_ENV=production
```

### Step 5: Set Up Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to the main branch
- Create preview deployments for pull requests
- Provide deployment URLs for testing

### Step 6: Configure Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click on "Domains"
3. Add your custom domain or use the provided `.vercel.app` domain

## 📋 Verification Checklist

After deployment, verify that:

- [ ] App loads successfully at your Vercel URL
- [ ] Supabase connection works (check browser console)
- [ ] Careers page loads: `/careers`
- [ ] Candidate registration works: `/candidate/register`
- [ ] Authentication functions properly
- [ ] Database operations work (try registering a candidate)

## 🔄 Continuous Deployment

Your app is now set up for continuous deployment:

1. **Make changes** to your code locally
2. **Commit changes**: `git add . && git commit -m "Your message"`
3. **Push to GitHub**: `git push origin main`
4. **Automatic deployment** happens on Vercel
5. **Check deployment** status in Vercel dashboard

## 🛠️ Troubleshooting

### Common Issues:

**Build Failures:**
- Check that build command is `npm run build`
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors in build logs

**Environment Variables:**
- Verify all required env vars are set in Vercel
- Check that env var names match exactly (case-sensitive)

**Database Connection:**
- Confirm Supabase URL and key are correct
- Check that Supabase project is active
- Verify database schema is set up properly

**404 Errors:**
- Ensure root directory is set to `web`
- Check that pages exist in the correct directory structure

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Supabase connection in Network tab
4. Review this guide for missed steps

## 🎉 Success!

Once deployed, your HR Portal will be live and accessible to users worldwide. The recruitment portal will allow external candidates to:

- Browse job opportunities
- Register and create profiles
- Submit applications
- Track application status

Your team can manage the entire HR workflow through the admin dashboard.

**Live URLs:**
- Main HR Portal: `https://your-app.vercel.app`
- Careers Portal: `https://your-app.vercel.app/careers`
- Candidate Portal: `https://your-app.vercel.app/candidate/login` 