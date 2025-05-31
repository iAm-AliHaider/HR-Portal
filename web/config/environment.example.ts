// Environment Configuration Template
// Copy this file to .env.local and fill in your actual values

export const environmentTemplate = `
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

# === Security Configuration ===
ENCRYPTION_KEY=your-32-character-encryption-key
SESSION_TIMEOUT=86400

# === Integration Configuration ===
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SLACK_WEBHOOK_URL=your-slack-webhook-url

# === Monitoring Configuration ===
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
`;

// Environment validation
export const validateEnvironment = () => {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "EMAIL_FROM",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn("Missing environment variables:", missing);
    return false;
  }

  return true;
};

export default environmentTemplate;
