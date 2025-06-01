# HR Portal - Production Deployment Guide

This guide will help you deploy your HR Portal application to production with proper configuration and security.

## 🚀 Production Readiness Checklist

### 1. Environment Configuration

Create a `.env.production` file with the following variables:

```bash
# Production Environment Configuration
NODE_ENV=production

# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=HR Portal

# Security Configuration
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION=true
NEXT_PUBLIC_ENABLE_FALLBACK_AUTH=false

# Features Configuration (IMPORTANT: Disable for production)
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
NEXT_PUBLIC_ENABLE_DEBUG_ROUTES=false
NEXT_PUBLIC_ENABLE_DEMO_MODE=false

# Email Configuration
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourcompany.com
NEXT_PUBLIC_FROM_EMAIL=noreply@yourcompany.com

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png

# Rate Limiting
NEXT_PUBLIC_RATE_LIMIT_REQUESTS=100
NEXT_PUBLIC_RATE_LIMIT_WINDOW=900000
```

### 2. Database Setup

#### Supabase Production Database
1. Create a new Supabase project for production
2. Run all migrations from `web/supabase/migrations/`
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers
5. Set up email templates

#### Required Tables
Ensure all these tables exist in your production database:
- `profiles` - User profiles and authentication
- `employees` - Employee records
- `departments` - Company departments
- `roles` - Job roles and permissions
- `leave_types` - Leave type definitions
- `leave_requests` - Leave request records
- `training_courses` - Training and development
- `jobs` - Job postings
- `applications` - Job applications
- `loan_programs` - Employee loan programs
- And 25+ other HR-related tables

### 3. Authentication Setup

#### Supabase Auth Configuration
1. **Email Templates**: Configure custom email templates in Supabase Dashboard
2. **Providers**: Enable email/password authentication
3. **Redirect URLs**: Add your production domain to allowed redirect URLs
4. **JWT Settings**: Verify JWT expiration settings
5. **Rate Limiting**: Configure auth rate limits

#### User Roles
Set up the following user roles:
- `admin` - Full system access
- `manager` - Department management access
- `hr` - HR module access
- `employee` - Basic employee access

### 4. Security Configuration

#### Environment Variables Validation
- ✅ No hardcoded credentials in code
- ✅ All environment variables properly set
- ✅ Service role key secured
- ✅ Debug features disabled

#### Database Security
- ✅ Row Level Security (RLS) enabled
- ✅ Proper user permissions
- ✅ API rate limiting configured
- ✅ SSL/TLS encryption enabled

### 5. Performance Optimization

#### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
}
```

#### Database Optimization
- Enable connection pooling
- Set up database indexes
- Configure query optimization
- Monitor database performance

### 6. Deployment Options

#### Option A: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure custom domain
4. Enable automatic deployments

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Option B: Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

#### Option C: Traditional Server
1. Set up Node.js server (18+ recommended)
2. Install PM2 for process management
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure monitoring

### 7. Post-Deployment Verification

#### Production Health Checks
Visit `/debug/production-check` to verify:
- ✅ Database connectivity
- ✅ Authentication working
- ✅ Environment variables set
- ✅ Security features enabled
- ✅ Debug features disabled

#### Functional Testing
1. **Authentication Flow**
   - User registration
   - Email verification
   - Password reset
   - Login/logout

2. **Core HR Functions**
   - Employee management
   - Leave requests
   - Training enrollment
   - Job applications

3. **Admin Functions**
   - User role management
   - System configuration
   - Data import/export
   - Reporting

### 8. Monitoring & Maintenance

#### Application Monitoring
- Set up error tracking (Sentry)
- Configure performance monitoring
- Set up uptime monitoring
- Monitor database performance

#### Security Monitoring
- Regular security audits
- Monitor authentication logs
- Check for suspicious activity
- Update dependencies regularly

#### Backup Strategy
- Database backups (daily)
- File storage backups
- Configuration backups
- Disaster recovery plan

### 9. Troubleshooting

#### Common Issues

**Database Connection Errors**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test database connection
npm run test:db
```

**Authentication Issues**
- Verify redirect URLs in Supabase
- Check email template configuration
- Validate JWT settings
- Test with different browsers

**Performance Issues**
- Check database query performance
- Monitor API response times
- Optimize image loading
- Enable caching

### 10. Support & Documentation

#### Getting Help
- Check the production readiness page: `/debug/production-check`
- Review application logs
- Contact support: support@yourcompany.com

#### Additional Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate API keys** regularly
3. **Use HTTPS** in production
4. **Enable rate limiting** on all endpoints
5. **Monitor authentication** logs
6. **Keep dependencies** updated
7. **Regular security** audits
8. **Backup data** regularly

## 📊 Performance Targets

- **Page Load Time**: < 3 seconds
- **Database Queries**: < 500ms average
- **API Response Time**: < 200ms
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

---

**Ready for Production?** Run the production check at `/debug/production-check` to validate your deployment! 