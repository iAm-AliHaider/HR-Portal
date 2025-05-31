# Quick User Setup Guide

## Issue: Login Page Stuck on "Signing in..."

Your login page is stuck because the email `sanfa360@gmail.com` doesn't exist in the production database yet.

## 🚀 **Solution 1: Create Your Account**

### Step 1: Go to Registration Page
Visit: `https://hr-web-one.vercel.app/register`

### Step 2: Fill in Your Details
- **Full Name**: Sanfa Ali  
- **Email**: sanfa360@gmail.com
- **Password**: admin123 (or your preferred password)
- **Confirm Password**: admin123

### Step 3: Submit Registration
- Click "Create Account"
- The system will create your user profile automatically
- You'll be logged in and redirected to the dashboard

## 🔧 **Solution 2: Use Existing Test Accounts**

If you want to use pre-configured test accounts, try these instead:

### Admin Account
- **Email**: admin@company.com
- **Password**: admin123

### HR Manager Account  
- **Email**: hr@company.com
- **Password**: hr123

### Employee Account
- **Email**: employee@company.com  
- **Password**: employee123

## 🔍 **Why This Happened**

- Your production database is working correctly
- The authentication system is connected properly  
- The issue was simply that your specific email didn't exist yet
- Once you register, you'll be able to login normally

## ✅ **After Registration**

Once you've created your account, you can:
1. Login with your credentials
2. Access the admin dashboard
3. Create additional users through the HR Portal
4. Set up your organization's data

## 🚨 **Important Notes**

- Email verification is disabled in production for easier setup
- Your account will have admin privileges if you register with the admin role
- The registration system automatically creates the necessary database records

---

**Choose Option 1 to create your personal account, or Option 2 to use test accounts immediately.** 