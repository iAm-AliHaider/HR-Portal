# HR Portal - Complete Human Resources Management System

A comprehensive HR management platform with recruitment portal, built with Next.js, TypeScript, and Supabase.

## 🌟 Features

### Core HR Management
- **Employee Management**: Complete employee lifecycle management
- **Recruitment**: Job posting, candidate tracking, interview scheduling
- **Applications**: Streamlined application process and status tracking
- **Analytics**: HR analytics and reporting dashboards
- **Compliance**: Policy management and compliance tracking

### Recruitment Portal
- **Public Job Board**: Modern, responsive careers page
- **Candidate Registration**: Comprehensive candidate onboarding
- **Application System**: Detailed job application forms
- **Candidate Dashboard**: Personal application tracking
- **Real-time Updates**: Live application status updates

### Technical Features
- **Authentication**: Secure user authentication with Supabase
- **Role-Based Access**: Granular permissions system
- **Mobile Responsive**: Optimized for all devices
- **Real-time Data**: Live updates across the platform
- **Modern UI**: Clean, professional interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 16.8 or later
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hr-portal
   ```

2. **Install dependencies**
   ```bash
   cd web
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `web` directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://tqtwdkobrzzrhrqdxprs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NODE_ENV=development
   ```

4. **Set up the database**
   - Run the SQL files in the `supabase` directory:
     - `schema.sql` - Creates tables and structure
     - `seed.sql` - Populates with sample data

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit `http://localhost:3000`

## 📁 Project Structure

```
hr-portal/
├── web/                          # Next.js application
│   ├── pages/                    # Application pages
│   │   ├── careers/              # Public job board
│   │   ├── candidate/            # Candidate portal
│   │   ├── dashboard/            # HR dashboard
│   │   └── ...
│   ├── components/               # Reusable components
│   ├── lib/                      # Utilities and configurations
│   └── styles/                   # Styling files
├── supabase/                     # Database schema and migrations
├── types/                        # TypeScript type definitions
└── docs/                         # Documentation
```

## 🎯 Key Routes

### Public Routes
- `/careers` - Public job board
- `/careers/jobs/[id]` - Job details
- `/careers/jobs/[id]/apply` - Job application
- `/candidate/register` - Candidate registration
- `/candidate/login` - Candidate login

### Protected Routes
- `/candidate/dashboard` - Candidate portal
- `/dashboard` - HR dashboard
- `/jobs` - Job management
- `/applications` - Application management
- `/employees` - Employee management

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the schema migrations
3. Configure authentication providers
4. Set up Row Level Security policies

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

## 📊 Database Schema

The application uses the following main tables:
- `employees` - Employee information
- `jobs` - Job postings
- `candidates` - External candidate profiles
- `applications` - Job applications
- `interviews` - Interview scheduling
- `users` - System users and authentication

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- HTTPS everywhere in production

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Manual Deployment
1. Build the application: `npm run build`
2. Deploy the `out` directory to your hosting provider

## 📈 Monitoring

- Real-time error tracking
- Performance monitoring
- User analytics
- Application metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the documentation in the `/docs` folder
- Review the FAQ section
- Submit issues on GitHub
- Contact the development team

## 🎉 Features Coming Soon

- [ ] Advanced analytics dashboard
- [ ] Mobile app for candidates
- [ ] Integration with external job boards
- [ ] Advanced reporting features
- [ ] Multi-language support

---

Built with ❤️ using Next.js, TypeScript, and Supabase.
