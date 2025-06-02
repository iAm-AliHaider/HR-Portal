# 🔐 HR Portal User Accounts & Credentials Summary

## 📊 Complete User Account List

Based on the various user creation scripts and test account setups throughout the development process, here are all the user accounts created in your HR Portal database:

---

## 🏢 **Primary Test Accounts** (Main Usage)

### **System Administrators**

| Email                   | Password        | Role  | Name                 | Department     | Position             |
| ----------------------- | --------------- | ----- | -------------------- | -------------- | -------------------- |
| `admin@company.com`     | `admin123`      | admin | Admin User           | Administration | System Administrator |
| `admin@hrportal.com`    | `HRPortal2024!` | admin | System Administrator | IT             | System Administrator |
| `ali@smemail.com`       | `admin123`      | admin | Ali Haider           | Administration | Super Admin          |
| `it-admin@hrportal.com` | `admin123`      | admin | Taylor Chen          | IT             | IT Administrator     |

### **HR Department**

| Email                        | Password        | Role        | Name            | Department      | Position      |
| ---------------------------- | --------------- | ----------- | --------------- | --------------- | ------------- |
| `hr@company.com`             | `hr123`         | hr          | HR Manager      | Human Resources | HR Manager    |
| `hr@hrportal.com`            | `HRPortal2024!` | hr          | HR Manager      | Human Resources | HR Director   |
| `hr-director@hrportal.com`   | `hr123`         | hr_director | Morgan Williams | Human Resources | HR Director   |
| `hr-manager@hrportal.com`    | `hr123`         | hr_manager  | Jamie Rodriguez | Human Resources | HR Manager    |
| `hr-specialist@hrportal.com` | `hr123`         | hr          | Robin Smith     | Human Resources | HR Specialist |

### **Recruitment Team**

| Email                             | Password        | Role               | Name             | Department         | Position           |
| --------------------------------- | --------------- | ------------------ | ---------------- | ------------------ | ------------------ |
| `recruiter@hrportal.com`          | `HRPortal2024!` | recruiter          | Talent Recruiter | Human Resources    | Senior Recruiter   |
| `recruiting-manager@hrportal.com` | `recruit123`    | recruiting_manager | Dana Wilson      | Talent Acquisition | Recruiting Manager |
| `recruiter@hrportal.com`          | `recruit123`    | recruiter          | Jordan Lee       | Talent Acquisition | Recruiter          |

### **Management Team**

| Email                              | Password        | Role    | Name               | Department  | Position            |
| ---------------------------------- | --------------- | ------- | ------------------ | ----------- | ------------------- |
| `manager@hrportal.com`             | `HRPortal2024!` | manager | Department Manager | Engineering | Engineering Manager |
| `engineering-manager@hrportal.com` | `manager123`    | manager | Casey Mitchell     | Engineering | Engineering Manager |
| `sales-manager@hrportal.com`       | `manager123`    | manager | Riley Thompson     | Sales       | Sales Manager       |
| `finance-manager@hrportal.com`     | `manager123`    | manager | Avery Garcia       | Finance     | Finance Manager     |
| `finance.manager@hrportal.com`     | `fin123`        | manager | Jennifer Smith     | Finance     | Finance Manager     |
| `sales.manager@hrportal.com`       | `sales123`      | manager | Lisa Anderson      | Sales       | Sales Manager       |

### **Team Leads**

| Email                     | Password  | Role      | Name            | Department  | Position   |
| ------------------------- | --------- | --------- | --------------- | ----------- | ---------- |
| `team-lead@hrportal.com`  | `lead123` | team_lead | Sam Parker      | Engineering | Team Lead  |
| `it.manager@hrportal.com` | `it123`   | manager   | Michael Johnson | IT          | IT Manager |

### **Employees**

| Email                     | Password        | Role     | Name          | Department  | Position             |
| ------------------------- | --------------- | -------- | ------------- | ----------- | -------------------- |
| `employee@company.com`    | `employee123`   | employee | Test Employee | General     | Employee             |
| `employee@hrportal.com`   | `HRPortal2024!` | employee | John Employee | Engineering | Software Developer   |
| `engineer@hrportal.com`   | `employee123`   | employee | Quinn Foster  | Engineering | Software Engineer    |
| `sales@hrportal.com`      | `employee123`   | employee | Blake Roberts | Sales       | Sales Representative |
| `accountant@hrportal.com` | `employee123`   | employee | Jesse Nguyen  | Finance     | Accountant           |
| `developer@hrportal.com`  | `dev123`        | employee | Alice Johnson | IT          | Senior Developer     |
| `developer2@hrportal.com` | `dev123`        | employee | Bob Wilson    | IT          | Frontend Developer   |
| `accountant@hrportal.com` | `acc123`        | employee | Robert Davis  | Finance     | Senior Accountant    |
| `sales.rep@hrportal.com`  | `sales123`      | employee | Tom Jackson   | Sales       | Sales Representative |

---

## 🎯 **Quick Access Credentials**

### **For Admin Testing:**

```
Email: admin@company.com
Password: admin123
Role: Full system administrator access
```

### **For HR Testing:**

```
Email: hr@company.com
Password: hr123
Role: HR management and employee operations
```

### **For Manager Testing:**

```
Email: manager@hrportal.com
Password: HRPortal2024!
Role: Department management and approvals
```

### **For Employee Testing:**

```
Email: employee@company.com
Password: employee123
Role: Employee self-service features
```

### **For Recruiter Testing:**

```
Email: recruiter@hrportal.com
Password: HRPortal2024!
Role: Recruitment and hiring workflows
```

---

## 🔐 **Password Patterns Used:**

| Account Type | Common Passwords               |
| ------------ | ------------------------------ |
| Admin        | `admin123`, `HRPortal2024!`    |
| HR           | `hr123`, `HRPortal2024!`       |
| Manager      | `manager123`, `HRPortal2024!`  |
| Employee     | `employee123`, `HRPortal2024!` |
| Recruiter    | `recruit123`, `HRPortal2024!`  |
| Developer    | `dev123`                       |
| Finance      | `fin123`, `acc123`             |
| Sales        | `sales123`                     |
| Team Lead    | `lead123`                      |
| IT           | `it123`                        |

---

## 🌐 **Login URLs:**

### **HR Portal (Staff Login):**

```
URL: https://your-vercel-url.vercel.app/login
Purpose: Internal staff access to HR management features
```

### **Candidate Portal (Public):**

```
URL: https://your-vercel-url.vercel.app/careers
Purpose: Job seekers can browse and apply for positions
```

### **Debug/Testing Access:**

```
URL: https://your-vercel-url.vercel.app/debug
Purpose: System monitoring and testing (admin only)
```

---

## 🛡️ **Role-Based Access Control (RBAC):**

### **Admin Roles:**

- `admin`: Full system access, user management, settings
- `it-admin`: Technical system administration

### **HR Roles:**

- `hr_director`: Strategic HR oversight and policies
- `hr_manager`: HR operations and process management
- `hr`: General HR tasks and employee support
- `recruiting_manager`: Recruitment strategy and oversight
- `recruiter`: Job posting and candidate management

### **Management Roles:**

- `manager`: Department management, approvals, team oversight
- `team_lead`: Team coordination and initial approvals

### **Employee Roles:**

- `employee`: Self-service features, requests, personal data

---

## 📝 **Usage Notes:**

1. **Primary Testing Accounts**: Use `admin@company.com`, `hr@company.com`, and `employee@company.com` for main testing
2. **Role Testing**: Use role-specific accounts to test different permission levels
3. **Department Testing**: Accounts span multiple departments (Engineering, HR, Sales, Finance, IT)
4. **Production Ready**: All accounts have proper profiles with names, departments, and positions
5. **Password Security**: Consider updating passwords in production environment

---

## 🔧 **Account Creation Scripts:**

The following scripts were used to create these accounts:

- `create-test-accounts.js` - Primary test accounts
- `setup-test-accounts.js` - Comprehensive role-based accounts
- `create-users-all-roles.js` - Department-specific accounts
- `direct-auth-fix.js` - Authentication fixes
- `apply-auth-fix.js` - Profile synchronization

---

**Last Updated**: January 2025  
**Total Accounts**: 25+ test accounts across all roles and departments  
**Status**: ✅ All accounts active and functional
