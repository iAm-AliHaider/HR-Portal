# Page Creation Rules for HR Portal

## 🚨 CRITICAL: Avoid Double Sidebar Issue

### **DO NOT use DashboardLayout wrapper in page components**

The `_app.tsx` file automatically applies `DashboardLayout` to all authenticated pages except those listed in `pagesWithOwnLayout`. 

### ❌ WRONG - This causes double sidebar:
```tsx
import DashboardLayout from '../components/layout/DashboardLayout';

const MyPage = () => {
  return (
    <DashboardLayout>  {/* ❌ DON'T DO THIS */}
      <div>Page content</div>
    </DashboardLayout>
  );
};
```

### ✅ CORRECT - Clean page without wrapper:
```tsx
const MyPage = () => {
  return (
    <>
      <Head>
        <title>Page Title - HR Management</title>
      </Head>
      
      <div className="p-4 md:p-6">  {/* ✅ Direct content */}
        Page content here
      </div>
    </>
  );
};
```

## 📋 Page Creation Checklist

### 1. **File Structure**
```
pages/
  feature/
    index.tsx       # Main feature page
    new.tsx         # Create/add page
    [id].tsx        # Detail/edit page
    subfeature.tsx  # Additional pages
```

### 2. **Required Imports**
```tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';  // Adjust path
import { shouldBypassAuth } from '@/lib/auth';
```

### 3. **Standard Page Template**
```tsx
const FeaturePage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);

  // Access control
  useEffect(() => {
    if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
      router.push('/login?redirect=/feature');
    }
  }, [allowAccess, role, router]);

  // Loading state for auth
  if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Feature Name - HR Management</title>
        <meta name="description" content="Feature description" />
      </Head>
      
      <div className="p-4 md:p-6">
        {/* Page content */}
      </div>
    </>
  );
};

export default FeaturePage;
```

### 4. **Role-Based Access Control**
```tsx
// For all users
['employee', 'manager', 'admin'].includes(role)

// For managers and admins only
['manager', 'admin'].includes(role)

// For admins only
role === 'admin'
```

### 5. **Adding New Pages to Exclusion List**
When creating pages that need special layout handling, add them to `_app.tsx`:

```tsx
const pagesWithOwnLayout = [
  // ... existing pages
  '/new-feature',           // Add new feature paths
  '/new-feature/create',    // Add sub-paths
  '/new-feature/[id]'       // Add dynamic routes
];
```

## 🎨 UI/UX Standards

### 1. **Header Pattern**
```tsx
<div className="flex justify-between items-center mb-6">
  <div>
    <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
    <p className="text-gray-600">Page description</p>
  </div>
  {/* Action buttons for managers/admins */}
  {['manager', 'admin'].includes(role) && (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
      Action Button
    </button>
  )}
</div>
```

### 2. **Card Components**
```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  {/* Card content */}
</div>
```

### 3. **Status Badges**
```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'text-green-600 bg-green-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
  {status}
</span>
```

### 4. **Progress Bars**
```tsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className="bg-blue-500 h-2 rounded-full transition-all"
    style={{ width: `${progress}%` }}
  />
</div>
```

## 🔧 Technical Standards

### 1. **State Management**
- Use `useState` for component state
- Use `useEffect` for data loading
- Mock data first, then replace with API calls

### 2. **Error Handling**
```tsx
const [error, setError] = useState<string | null>(null);

try {
  // API call
} catch (err) {
  setError('Failed to load data');
  console.error(err);
}
```

### 3. **Loading States**
```tsx
const [isLoading, setIsLoading] = useState(true);

{isLoading ? (
  <div className="p-6 text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
    <p className="text-gray-500">Loading...</p>
  </div>
) : (
  // Content
)}
```

## 📝 File Naming Conventions

- **Pages**: `kebab-case.tsx` (e.g., `leave-request.tsx`)
- **Components**: `PascalCase.tsx` (e.g., `LeaveRequestForm.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `dateUtils.ts`)
- **Types**: `interfaces.ts` or include in component files

## 🚀 Deployment Checklist

Before creating/modifying pages:

1. ✅ No `DashboardLayout` wrapper in page component
2. ✅ Proper authentication and role-based access
3. ✅ Loading states implemented
4. ✅ Error handling in place
5. ✅ Responsive design (mobile-first)
6. ✅ TypeScript interfaces defined
7. ✅ SEO meta tags included
8. ✅ Accessibility considerations
9. ✅ Build passes without errors
10. ✅ Manual testing completed

## 🔍 Common Issues

### Double Sidebar
- **Cause**: Using `DashboardLayout` wrapper when `_app.tsx` already applies it
- **Fix**: Remove `DashboardLayout` wrapper from page component

### Authentication Issues
- **Cause**: Missing or incorrect role checks
- **Fix**: Use proper `useAuth` hook and role validation

### Layout Breaks
- **Cause**: Incorrect CSS classes or missing responsive classes
- **Fix**: Use Tailwind responsive prefixes (`md:`, `lg:`, etc.)

### Navigation Issues
- **Cause**: Incorrect routing or missing pages
- **Fix**: Ensure all routes are properly defined and accessible

---

**Last Updated**: January 2024
**Version**: 1.0
**Author**: AI Assistant

Follow these rules to maintain consistency and avoid common issues in the HR Portal application. 