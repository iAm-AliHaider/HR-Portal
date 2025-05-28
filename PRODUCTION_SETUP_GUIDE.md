# HR Portal - Production Setup Guide

## 🚀 Complete Setup Instructions

This guide will walk you through setting up your HR Portal for production deployment with database connection, email service, file storage, and environment variables.

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- Email service provider (Gmail, SendGrid, etc.)
- Domain name (optional, for production)

## 1. 🌐 **Supabase Database Setup**

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Set database password (save this!)
5. Select region closest to your users
6. Click "Create new project"

### Step 2: Run Database Schema
1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `web/supabase/schema.sql`
5. Paste into the SQL editor
6. Click "Run" to execute the schema
7. Verify tables were created in the "Table Editor"

### Step 3: Configure Storage Buckets
1. Go to "Storage" in your Supabase dashboard
2. Click "New bucket" and create these buckets:
   - `hr-documents` (public)
   - `avatars` (public)
   - `training-materials` (public)
   - `compliance-documents` (private)
   - `expense-receipts` (private)

### Step 4: Set Up Row Level Security (RLS)
The schema automatically enables RLS. For production, add these policies:

```sql
-- Enable RLS on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
-- ... (repeat for all tables)

-- Example policies (customize as needed)
CREATE POLICY "Users can view their own data" ON employees
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Managers can view team data" ON employees
  FOR SELECT USING (
    auth.uid() IN (
      SELECT manager_id FROM employees WHERE id = employees.id
    )
  );
```

## 2. 📧 **Email Service Setup**

### Option A: Gmail Setup (Recommended for testing)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Save this password

### Option B: SendGrid Setup (Recommended for production)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Verify your domain
4. Configure sender authentication

### Option C: Custom SMTP
Use your company's SMTP server settings.

## 3. 🔧 **Environment Variables Setup**

### Step 1: Create Environment File
In your `web` directory, create `.env.local`:

```bash
# Copy the template from web/config/environment.example.ts
cp web/config/environment.example.ts .env.local
```

### Step 2: Fill in Your Values
Edit `.env.local` with your actual values:

```env
# === Supabase Configuration ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# === Database Configuration ===
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres

# === Email Service Configuration ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourcompany.com
EMAIL_FROM_NAME=HR Portal

# === File Storage Configuration ===
NEXT_PUBLIC_STORAGE_BUCKET=hr-documents
NEXT_PUBLIC_AVATARS_BUCKET=avatars
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,gif

# === Application Configuration ===
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
JWT_SECRET=your-jwt-secret-here

# === API Configuration ===
API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Step 3: Get Supabase Keys
1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy the values:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Generate Secrets
Generate secure secrets for authentication:

```bash
# For NEXTAUTH_SECRET
openssl rand -base64 32

# For JWT_SECRET  
openssl rand -base64 32
```

## 4. 📦 **Install Dependencies**

```bash
cd web
npm install
```

This will install the newly added dependencies:
- `nodemailer` - Email service
- `@types/nodemailer` - TypeScript types

## 5. 🧪 **Test the Setup**

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Check Console Logs
Look for these success messages:
- `✅ Connecting to Supabase: https://your-project.supabase.co`
- `📧 Email service initialized in development mode`
- `📁 [DEV] File upload simulation` (when uploading files)

### Step 3: Test Database Connection
1. Go to `http://localhost:3000/leave`
2. Try creating a leave request
3. Check if data appears in your Supabase table

### Step 4: Test Email Service
1. Submit a leave request
2. Check console for email simulation logs
3. In production, emails will be sent automatically

### Step 5: Test File Upload
1. Go to any page with file upload (e.g., documents)
2. Try uploading a file
3. Check console for upload simulation logs

## 6. 🚀 **Production Deployment**

### Option A: Vercel Deployment (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Set environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   # ... add all other variables
   ```
4. Deploy: `vercel --prod`

### Option B: Docker Deployment
1. Build image: `docker build -t hr-portal .`
2. Run container: `docker run -p 3000:3000 --env-file .env.local hr-portal`

### Option C: Traditional Hosting
1. Build project: `npm run build`
2. Start production server: `npm start`
3. Configure reverse proxy (nginx/apache)

## 7. 🔒 **Security Configuration**

### Environment Variables for Production
Never commit these to git. Set them in your hosting platform:

```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
# ... all other production values
```

### File Storage Security
1. Configure Supabase storage policies
2. Set up CORS for file uploads
3. Enable virus scanning (if available)

### Email Security
1. Use app passwords, not main passwords
2. Enable DKIM/SPF records
3. Monitor email quotas and limits

## 8. 📊 **Monitoring & Maintenance**

### Health Checks
The app includes health check endpoints:
- Database: Check connection to Supabase
- Email: Verify SMTP connection
- Storage: Test file upload/download

### Logs
Monitor these logs in production:
- Application logs (console output)
- Database query logs (Supabase dashboard)
- Email delivery logs (your email provider)
- Error tracking (add Sentry if needed)

### Backups
- Database: Supabase handles automatic backups
- Files: Configure storage bucket versioning
- Environment: Keep secure backup of `.env` variables

## 9. 🛠️ **Troubleshooting**

### Common Issues

#### Database Connection Fails
```
❌ Missing Supabase environment variables
```
**Solution**: Check that all Supabase environment variables are correctly set.

#### Email Sending Fails
```
❌ Email service initialization failed
```
**Solution**: Verify SMTP credentials and app password settings.

#### File Upload Fails
```
Storage upload error: Invalid bucket
```
**Solution**: Ensure storage buckets exist in Supabase and are properly configured.

#### Build Errors
```
Cannot find module 'nodemailer'
```
**Solution**: Run `npm install` to install all dependencies.

### Getting Help
1. Check the console logs for specific error messages
2. Verify environment variables are correctly set
3. Test each service individually (database, email, storage)
4. Check Supabase dashboard for database issues
5. Review email provider logs for delivery issues

## 10. ✅ **Verification Checklist**

Before going live, verify:
- [ ] Database schema is created and tables are populated
- [ ] Environment variables are set for production
- [ ] Email service is working (test in dev mode first)
- [ ] File uploads work to all storage buckets
- [ ] Authentication redirects work correctly
- [ ] All pages load without errors
- [ ] Mobile responsiveness is working
- [ ] HTTPS is configured (for production)
- [ ] Backup systems are in place

## 🎉 **You're Ready!**

Your HR Portal is now fully configured with:
- ✅ **Production database** with comprehensive schema
- ✅ **Email notifications** for all HR workflows
- ✅ **File storage** for documents, avatars, and attachments
- ✅ **Environment management** for dev/staging/production
- ✅ **Security** with proper authentication and authorization

The application will automatically switch from development (mock) mode to production mode when the environment variables are properly configured.

---

*Last Updated: December 2024* 