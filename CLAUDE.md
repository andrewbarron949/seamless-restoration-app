# Seamless Restoration App - Documentation

## Project Overview
**Phase**: Authentication System Complete ✅  
**Current State**: Full authentication system implemented with NextAuth.js, user registration, login, and protected routes. Ready for claims management development.  
**Last Updated**: June 17, 2025

This is a Next.js web application for Seamless Restoration that will provide inspection management, claims tracking, and photo documentation capabilities. The app is designed for insurance inspectors, managers, and clients to streamline the restoration claims process.

**Target Users:**
- Insurance Inspectors (field data collection)
- Managers (oversight and reporting) 
- Clients (claim status tracking)

**Repository**: https://github.com/andrewbarron949/seamless-restoration-app.git

## Tech Stack

### ✅ Implemented Technologies
- **Frontend**: Next.js 15.3.3 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS
- **Database**: Prisma 6.10.0 + PostgreSQL (ready for Neon)
- **Authentication**: NextAuth.js 4.24.11 with PrismaAdapter
- **Security**: bcryptjs password hashing, JWT sessions
- **Code Quality**: ESLint 9
- **Development**: Hot reload, TypeScript strict mode
- **Version Control**: Git with GitHub integration

### 🔄 Planned Technologies
- **File Upload**: Uploadthing (pending)
- **Deployment**: Vercel (pending)
- **Testing**: Jest + React Testing Library (pending)

## Project Structure
```
seamless-restoration-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts       # NextAuth API routes handler
│   │   │   │   └── register/
│   │   │   │       └── route.ts       # User registration API with validation
│   │   │   └── test-db/
│   │   │       └── route.ts           # Database connection test endpoint
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Protected dashboard with user info
│   │   ├── login/
│   │   │   └── page.tsx               # Login form with NextAuth integration
│   │   ├── register/
│   │   │   └── page.tsx               # User registration form
│   │   ├── favicon.ico
│   │   ├── globals.css                # Global Tailwind styles
│   │   ├── layout.tsx                 # Root layout with SessionProvider
│   │   ├── page.tsx                   # Home page with auth redirect
│   │   └── providers.tsx              # NextAuth SessionProvider wrapper
│   ├── lib/
│   │   ├── auth.ts                    # NextAuth configuration with Prisma
│   │   └── prisma.ts                  # Prisma client singleton
│   └── types/
│       └── next-auth.d.ts             # NextAuth type extensions
├── prisma/
│   ├── migrations/
│   │   ├── 20250617184721_init/
│   │   │   └── migration.sql          # Initial database migration
│   │   ├── 20250617192440_add_nextauth_models/
│   │   │   └── migration.sql          # NextAuth models migration
│   │   └── migration_lock.toml        # Migration lock file
│   └── schema.prisma                  # Complete schema with NextAuth models
├── middleware.ts                      # Route protection with NextAuth
├── .env.local                         # Environment variables (NEXTAUTH_SECRET)
├── public/                            # Static assets
├── CLAUDE.md                          # This project documentation
├── package.json                       # Dependencies with NextAuth integration
├── .gitignore                         # Includes env files and Prisma generated
└── [config files...]                  # TypeScript, Next.js, ESLint, PostCSS
```

## Database Schema
**Migrations Applied**: 
- `20250617184721_init` ✅ Initial schema
- `20250617192440_add_nextauth_models` ✅ NextAuth integration  
**Location**: `prisma/schema.prisma`

### Models Overview
**Core Application Models:**
- **User**: Inspectors, managers, admin users with role-based access and NextAuth integration
- **Claim**: Insurance claims with client contact information and status tracking
- **Inspection**: Inspection data collection sessions with JSON data storage
- **Photo**: Inspection photos with Uploadthing integration and metadata

**NextAuth Models:**
- **Account**: OAuth provider accounts (for future social login)
- **Session**: Database session storage
- **VerificationToken**: Email verification tokens

### Detailed Schema
```typescript
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?                       // Optional for OAuth users
  name          String?
  role          String    @default("INSPECTOR") // INSPECTOR, MANAGER, ADMIN
  emailVerified DateTime?                     // NextAuth email verification
  image         String?                       // Profile image URL
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  claims      Claim[]
  inspections Inspection[]
  accounts    Account[]                       // NextAuth accounts
  sessions    Session[]                       // NextAuth sessions
}

model Claim {
  id          String   @id @default(cuid())
  claimNumber String   @unique
  clientName  String
  clientEmail String?
  clientPhone String?
  address     String
  status      String   @default("NEW")       // NEW, IN_PROGRESS, COMPLETED, CLOSED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  
  user        User         @relation(fields: [userId], references: [id])
  inspections Inspection[]
}

model Inspection {
  id          String    @id @default(cuid())
  claimId     String
  inspectorId String
  data        Json                            // Dynamic form data
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  claim     Claim  @relation(fields: [claimId], references: [id])
  inspector User   @relation(fields: [inspectorId], references: [id])
  photos    Photo[]
}

model Photo {
  id           String    @id @default(cuid())
  inspectionId String
  uploadthingId String?                       // Uploadthing file ID
  url          String
  caption      String?
  metadata     Json?                          // EXIF data, location, etc.
  takenAt      DateTime  @default(now())
  createdAt    DateTime  @default(now())
  
  inspection Inspection @relation(fields: [inspectionId], references: [id])
}

// NextAuth Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### Relationships
**Core Application:**
```
User (1) ←→ (many) Claim (as creator/manager)
User (1) ←→ (many) Inspection (as inspector)
Claim (1) ←→ (many) Inspection
Inspection (1) ←→ (many) Photo
```

**NextAuth Integration:**
```
User (1) ←→ (many) Account (OAuth providers)
User (1) ←→ (many) Session (user sessions)
VerificationToken (standalone for email verification)
```

## ✅ Completed Features

### Database Infrastructure
- [x] Prisma ORM setup with PostgreSQL support
- [x] Complete database schema with 7 models (User, Claim, Inspection, Photo + NextAuth models)
- [x] Foreign key relationships and constraints established
- [x] Database migration system with 2 migrations applied
- [x] Prisma client singleton pattern with global caching
- [x] Database connection test endpoint at `/api/test-db`
- [x] Uploadthing integration fields ready in Photo model
- [x] Role-based user system (INSPECTOR, MANAGER, ADMIN)
- [x] NextAuth database adapter integration

### Authentication System ✅ NEW
- [x] NextAuth.js 4.24.11 implementation with PrismaAdapter
- [x] Credentials provider for email/password authentication
- [x] User registration API with validation (`/api/auth/register`)
- [x] Password hashing with bcryptjs (12 salt rounds)
- [x] JWT session strategy with role-based callbacks
- [x] Protected routes with middleware authentication
- [x] Login page with form validation and error handling
- [x] Registration page with role selection
- [x] Dashboard page with user information display
- [x] Session provider integration in app layout
- [x] TypeScript type extensions for custom user properties
- [x] Automatic redirect flow (authenticated → dashboard, unauthenticated → login)

### Development Environment
- [x] Next.js 15.3.3 App Router setup
- [x] TypeScript 5 strict mode configuration
- [x] Tailwind CSS 4 integration with PostCSS
- [x] ESLint 9 code quality tools configured
- [x] Development server with hot reload
- [x] Geist font family integration (Sans + Mono)
- [x] Environment variables configuration (.env.local)

### Version Control & Deployment Ready
- [x] Git repository initialized and configured
- [x] GitHub repository connected (andrewbarron949/seamless-restoration-app)
- [x] Comprehensive .gitignore with environment files
- [x] Project documentation system established
- [x] Clean commit history with conventional commits

## Environment Variables
**Required for Development:**
```bash
# NextAuth.js Authentication ✅ CONFIGURED
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="LFj1216sQkE7QcRHm/0trGPEBB5dkera4YeVuLKL2Ug="

# Database (PostgreSQL - ready for Neon)
# DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Future additions:
# UPLOADTHING_SECRET="sk_live_..."
# UPLOADTHING_APP_ID="..."
```

**Environment Files:**
- `.env.local` - Local development environment variables
- `.env` - Production environment variables (not tracked in git)
- Both files excluded in `.gitignore` for security

## API Routes

### ✅ Implemented
**Database Testing:**
- `GET /api/test-db` - Database connectivity test and health check
  - **Location**: `src/app/api/test-db/route.ts`
  - **Purpose**: Tests Prisma connection and returns record counts for all models
  - **Response**: JSON with connection status and table counts
  - **Error Handling**: Proper try/catch with detailed error messages

**Authentication System:**
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints
  - **Location**: `src/app/api/auth/[...nextauth]/route.ts`
  - **Purpose**: Handles login, logout, session management
  - **Features**: JWT sessions, credential validation, callbacks

- `POST /api/auth/register` - User registration with validation
  - **Location**: `src/app/api/auth/register/route.ts`
  - **Validation**: Email format, password length, role validation
  - **Security**: bcrypt password hashing (12 salt rounds)
  - **Features**: Duplicate email detection, role assignment
  - **Response**: User object (excluding password) or error details

### 🔄 Planned API Routes
**Claims Management:**
- `GET /api/claims` - List claims (filtered by user role)
- `POST /api/claims` - Create new claim (managers only)
- `GET /api/claims/[id]` - Get single claim details
- `PATCH /api/claims/[id]` - Update claim status

**Inspections:**
- `GET /api/inspections` - List inspections
- `POST /api/inspections` - Create inspection submission
- `GET /api/inspections/[id]` - Get inspection details

**File Management:**
- `POST /api/upload` - Photo upload via Uploadthing

**User Management:**
- `GET/POST /api/users` - User management (admins only)

## Components

### ✅ Current Components
**Layout & Providers:**
- **RootLayout** (`src/app/layout.tsx`) - Main app layout with SessionProvider integration
  - Updated metadata: "Seamless Restoration App"
  - Geist font family configuration
  - NextAuth SessionProvider wrapper
- **Providers** (`src/app/providers.tsx`) - NextAuth SessionProvider wrapper component

**Authentication Pages:**
- **HomePage** (`src/app/page.tsx`) - Landing page with authentication redirect
  - Automatically redirects authenticated users to dashboard
  - Clean landing page with sign in/register buttons
  - Role information display
- **LoginPage** (`src/app/login/page.tsx`) - User authentication form
  - Email/password form with validation
  - NextAuth signIn integration
  - Error handling and loading states
  - Link to registration page
- **RegisterPage** (`src/app/register/page.tsx`) - User registration form
  - Complete registration form with role selection
  - Form validation (email format, password matching)
  - API integration with registration endpoint
  - Success redirect to login

**Protected Pages:**
- **DashboardPage** (`src/app/dashboard/page.tsx`) - Main authenticated interface
  - User session display with role badge
  - Protected route with authentication check
  - Sign out functionality
  - Welcome interface with user information

### 🔄 Planned Components
- `<Navigation />` - Role-based navigation menu
- `<ClaimCard />` - Individual claim display component
- `<ClaimsList />` - Claims listing with filters
- `<InspectionForm />` - Dynamic form builder for inspections
- `<PhotoUpload />` - Camera capture + Uploadthing integration
- `<PhotoGallery />` - Inspection photo viewer
- `<UserManagement />` - Admin user controls
- `<LoadingSpinner />` - Global loading states
- `<ErrorBoundary />` - Error handling wrapper

## Development Commands

### Application Development
```bash
# Development server
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build with type checking
npm run start            # Start production server
npm run lint             # ESLint code checking

# Testing database connection
curl http://localhost:3000/api/test-db  # Test API endpoint
```

### Database Management
```bash
# Prisma Core Commands
npx prisma generate      # Generate Prisma client after schema changes
npx prisma migrate dev   # Create and apply new migrations
npx prisma migrate reset # Reset database and apply all migrations
npx prisma db push       # Push schema changes without creating migration

# Database Inspection
npx prisma studio        # Visual database browser (localhost:5555)
npx prisma db seed       # Seed database (when seed script implemented)

# Migration Management
npx prisma migrate status      # Check migration status
npx prisma migrate resolve     # Mark failed migration as resolved
npx prisma migrate diff        # Preview migration changes
```

### Git Commands
```bash
# Version control
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push                 # Push to GitHub
git status               # Check repository status
```

## Testing

### ✅ Current Testing Setup
- **Database Health Check**: `GET /api/test-db` endpoint fully functional
  - Tests Prisma client connection
  - Returns count of all database models
  - Proper error handling and response formatting
- **Prisma Studio**: Visual database browser available at `npx prisma studio`
- **Development Server**: Hot reload working correctly
- **Build Process**: TypeScript compilation successful

### 🔄 Planned Testing Framework
- **Unit Testing**: Jest + React Testing Library for components
- **API Testing**: Supertest for API route testing
- **Integration Testing**: Database operation testing with test database
- **E2E Testing**: Playwright for full user workflow testing
- **Mobile Testing**: Responsive design verification
- **Performance Testing**: Lighthouse CI integration

## Known Issues & Limitations

### Current State Issues
- **Database Connection**: No production database connected (DATABASE_URL needed for Neon)
- **Development Server**: Some webpack module resolution issues in development mode
- **No Claims Management**: Core business logic for claims not yet implemented
- **Basic UI**: Authentication pages use basic Tailwind styling (needs design polish)

### Development Environment
- **Environment Variables**: `.env.local` configured for NextAuth, needs DATABASE_URL for production
- **Database**: Schema ready but no actual database instance connected
- **Testing**: No automated tests implemented yet
- **Deployment**: Not yet configured for production deployment

### Fixed Issues ✅
- ~~**No Authentication**: Authentication system now fully implemented~~
- ~~**Placeholder Content**: Home page now has proper authentication flow~~
- ~~**No Custom UI**: Authentication components implemented~~
- ~~**Metadata**: Page title updated to "Seamless Restoration App"~~

## Next Steps (Priority Order)

### 🔥 Immediate (Next 1-2 weeks)
1. **Database Connection & Production Setup**
   - Set up Neon PostgreSQL database instance
   - Configure DATABASE_URL environment variable
   - Test database connection with actual production data
   - Create initial seed data script for development

2. **Claims Management System Implementation**
   - Create Claims CRUD API routes (`/api/claims`)
   - Implement role-based access (Managers can create, Inspectors can view assigned)
   - Build Claims dashboard page (`/app/dashboard/claims`)
   - Create ClaimCard and ClaimsList components
   - Add claim creation form with client information
   - Implement claim status tracking and updates

3. **Enhanced Dashboard & Navigation**
   - Create role-based navigation menu component
   - Build dashboard layout with navigation sidebar
   - Add claims summary widgets for different user roles
   - Implement user profile management

### 📋 Medium Term (2-4 weeks)
4. **Inspection Data Collection System**
   - Create inspection submission API (`/api/inspections`)
   - Build dynamic form builder with JSON schema validation
   - Implement inspection assignment workflow (Manager → Inspector)
   - Create inspection detail views with form data display
   - Add inspection status management (draft, in-progress, completed)
   - Build inspection templates system for different claim types

5. **Photo Upload Integration (Uploadthing)**
   - Set up Uploadthing account and configure API keys
   - Implement secure photo upload API with authentication
   - Build camera capture component for mobile devices
   - Create photo gallery component with metadata display
   - Add photo management (captions, deletion, reordering)
   - Integrate photos with inspection workflow

6. **Advanced User Interface**
   - Implement responsive design for mobile inspectors
   - Create loading states and error boundaries
   - Add toast notifications for user feedback
   - Build search and filtering capabilities
   - Implement data export functionality (PDF reports)

### 🚀 Long Term (1-2 months)
7. **User Management & Administration**
   - User registration and role assignment
   - Team management for inspectors and managers
   - User activity tracking and audit logs
   - Inspector assignment and workload management

8. **Advanced Features**
   - Real-time notifications for claim updates
   - Mobile PWA capabilities with offline support
   - Data export functionality (PDF reports, CSV exports)
   - Analytics dashboard with claim metrics and inspector performance

9. **Production Deployment & Optimization**
   - Vercel production deployment setup
   - Environment variable configuration for production
   - Performance optimization and caching strategies
   - Security hardening and vulnerability assessment
   - Custom domain configuration and SSL setup

## Code Patterns & Best Practices

### Database Access Pattern
```typescript
// Use the singleton pattern from src/lib/prisma.ts
import prisma from '@/lib/prisma'

// Proper connection handling (as implemented in test-db route)
export async function GET() {
  try {
    await prisma.$connect()
    const result = await prisma.user.findMany()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Database operation failed' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
```

### API Route Structure
```typescript
// Standard pattern: src/app/api/[resource]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Example from working test-db route
export async function GET() {
  try {
    await prisma.$connect()
    
    const userCount = await prisma.user.count()
    const claimCount = await prisma.claim.count()
    
    return NextResponse.json({
      message: 'Success',
      status: 'connected',
      counts: { users: userCount, claims: claimCount }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
```

### TypeScript Conventions
- **Prisma Types**: Use generated types: `User`, `Claim`, `Inspection`, `Photo`
- **Strict Mode**: TypeScript strict mode enabled in `tsconfig.json`
- **API Responses**: Consistent error handling with proper HTTP status codes
- **Component Props**: Prefer interfaces for component prop definitions
- **Error Handling**: Typed error catching with proper fallbacks

## Authentication System Implementation

### NextAuth Configuration (`src/lib/auth.ts`)
```typescript
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    jwt: async ({ token, user }: { token: any; user?: any }) => {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
}
```

### User Registration API (`src/app/api/auth/register/route.ts`)
```typescript
export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    const validRoles = ['INSPECTOR', 'MANAGER', 'ADMIN']
    const userRole = role && validRoles.includes(role) ? role : 'INSPECTOR'

    await prisma.$connect()

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Hash password and create user
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name: name || null, role: userRole },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    })

    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
```

### Route Protection Middleware (`middleware.ts`)
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to public routes
        if (pathname.startsWith('/login') || 
            pathname.startsWith('/register') || 
            pathname.startsWith('/api/auth') ||
            pathname === '/') {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)
```

---

## Project Status Summary

**✅ Authentication Phase Complete**: Full authentication system with NextAuth.js, user registration, login, protected routes, and role-based access control  
**🔄 Next Priority**: Database production setup and claims management system implementation  
**📊 Progress**: ~30% complete (foundation + authentication phases complete)

### Recent Achievements ✅
- Complete NextAuth.js authentication system
- User registration with password hashing and validation
- Login/logout functionality with session management
- Protected routes with middleware
- Role-based access control (INSPECTOR, MANAGER, ADMIN)
- Dashboard with user information display
- Database schema updated with NextAuth models
- Environment configuration for authentication

### Immediate Next Steps 🎯
- Set up production database connection
- Implement claims management CRUD operations
- Build claims dashboard and user interface
- Add navigation and enhanced user experience

This documentation reflects the current state as of the authentication system implementation and should be updated as new features are developed.