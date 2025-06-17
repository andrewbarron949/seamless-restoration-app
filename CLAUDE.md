# Seamless Restoration App - Documentation

## Project Overview
**Phase**: Foundation Setup Complete ✅  
**Current State**: Database infrastructure implemented with Prisma ORM, ready for authentication and UI development  
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
- **Code Quality**: ESLint 9
- **Development**: Hot reload, TypeScript strict mode
- **Version Control**: Git with GitHub integration

### 🔄 Planned Technologies
- **Authentication**: NextAuth.js (pending)
- **File Upload**: Uploadthing (pending)
- **Deployment**: Vercel (pending)
- **Testing**: Jest + React Testing Library (pending)

## Project Structure
```
seamless-restoration-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── test-db/
│   │   │       └── route.ts           # Database connection test endpoint
│   │   ├── favicon.ico
│   │   ├── globals.css                # Global Tailwind styles
│   │   ├── layout.tsx                 # Root layout with Geist fonts
│   │   └── page.tsx                   # Home page (Next.js starter template)
│   └── lib/
│       └── prisma.ts                  # Prisma client singleton with global caching
├── prisma/
│   ├── migrations/
│   │   ├── 20250617184721_init/
│   │   │   └── migration.sql          # Initial database migration
│   │   └── migration_lock.toml        # Migration lock file
│   └── schema.prisma                  # Complete database schema with 4 models
├── public/                            # Static assets (Next.js SVG icons)
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
├── CLAUDE.md                          # This project documentation
├── README.md                          # Next.js default README
├── package.json                       # Dependencies with Prisma integration
├── .gitignore                         # Includes Prisma generated files
├── tsconfig.json                      # TypeScript configuration
├── next.config.ts                     # Next.js configuration
├── postcss.config.mjs                 # PostCSS for Tailwind
└── eslint.config.mjs                  # ESLint configuration
```

## Database Schema
**Migration**: `20250617184721_init` ✅ Applied  
**Location**: `prisma/schema.prisma`

### Models Overview
- **User**: Inspectors, managers, admin users with role-based access
- **Claim**: Insurance claims with client contact information and status tracking
- **Inspection**: Inspection data collection sessions with JSON data storage
- **Photo**: Inspection photos with Uploadthing integration and metadata

### Detailed Schema
```typescript
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  name        String?
  role        String   @default("INSPECTOR")  // INSPECTOR, MANAGER, ADMIN
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  claims      Claim[]
  inspections Inspection[]
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
```

### Relationships
```
User (1) ←→ (many) Claim (as creator/manager)
User (1) ←→ (many) Inspection (as inspector)
Claim (1) ←→ (many) Inspection
Inspection (1) ←→ (many) Photo
```

## ✅ Completed Features

### Database Infrastructure
- [x] Prisma ORM setup with PostgreSQL support
- [x] Complete database schema with 4 core models (User, Claim, Inspection, Photo)
- [x] Foreign key relationships and constraints established
- [x] Database migration system initialized with `20250617184721_init`
- [x] Prisma client singleton pattern with global caching
- [x] Database connection test endpoint at `/api/test-db`
- [x] Uploadthing integration fields ready in Photo model
- [x] Role-based user system prepared (INSPECTOR, MANAGER, ADMIN)

### Development Environment
- [x] Next.js 15.3.3 App Router setup
- [x] TypeScript 5 strict mode configuration
- [x] Tailwind CSS 4 integration with PostCSS
- [x] ESLint 9 code quality tools configured
- [x] Development server with hot reload
- [x] Geist font family integration (Sans + Mono)

### Version Control & Deployment Ready
- [x] Git repository initialized and configured
- [x] GitHub repository connected (andrewbarron949/seamless-restoration-app)
- [x] Comprehensive .gitignore with Prisma exclusions
- [x] Project documentation system established
- [x] Clean commit history established

## Environment Variables
**Required for Development:**
```bash
# Database (PostgreSQL - ready for Neon)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Future additions:
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-here"
# UPLOADTHING_SECRET="sk_live_..."
# UPLOADTHING_APP_ID="..."
```

## API Routes

### ✅ Implemented
- `GET /api/test-db` - Database connectivity test and health check
  - **Location**: `src/app/api/test-db/route.ts`
  - **Purpose**: Tests Prisma connection and returns record counts for all models
  - **Response**: JSON with connection status and table counts (users, claims, inspections, photos)
  - **Error Handling**: Proper try/catch with detailed error messages
  - **Database Management**: Automatic connect/disconnect cycle

### 🔄 Planned API Routes
- `POST /api/auth/register` - User registration with password hashing
- `POST /api/auth/login` - User authentication
- `GET /api/claims` - List claims (filtered by user role)
- `POST /api/claims` - Create new claim (managers only)
- `GET /api/claims/[id]` - Get single claim details
- `PATCH /api/claims/[id]` - Update claim status
- `GET /api/inspections` - List inspections
- `POST /api/inspections` - Create inspection submission
- `GET /api/inspections/[id]` - Get inspection details
- `POST /api/upload` - Photo upload via Uploadthing
- `GET/POST /api/users` - User management (admins only)

## Components

### ✅ Current Components
- **RootLayout** (`src/app/layout.tsx`) - Main app layout with Geist font configuration
  - Includes global metadata (title: "Create Next App")
  - Font variable CSS custom properties setup
  - Antialiased text rendering
- **HomePage** (`src/app/page.tsx`) - Landing page with Next.js starter template
  - Responsive grid layout
  - Next.js logo and example links
  - Modified intro text: "This is my portfolio project"

### 🔄 Planned Components
- `<AuthProvider />` - NextAuth session provider wrapper
- `<LoginForm />` - User authentication form
- `<Dashboard />` - Main authenticated user interface
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
- **Placeholder Content**: Home page displays Next.js starter template content
- **No Authentication**: All routes are currently public (authentication pending)
- **No Custom UI**: Using default Next.js components (custom components pending)
- **No Database Connection**: Environment variables not configured (DATABASE_URL needed)
- **Metadata**: Page title still shows "Create Next App" (needs customization)

### Development Environment
- **Environment Variables**: `.env` file needs DATABASE_URL configuration
- **Database**: No actual database connected yet (ready for Neon PostgreSQL)
- **Deployment**: Not yet configured for production deployment

## Next Steps (Priority Order)

### 🔥 Immediate (Next 1-2 weeks)
1. **Environment Setup & Database Connection** 
   - Configure DATABASE_URL environment variable
   - Set up Neon PostgreSQL database
   - Test database connection with actual data
   - Create initial seed data for development

2. **NextAuth.js Authentication Implementation**
   - Install `next-auth @auth/prisma-adapter bcryptjs`
   - Configure credentials provider with existing User model
   - Create registration/login API routes
   - Implement role-based access control (INSPECTOR, MANAGER, ADMIN)
   - Add session management and protected routes

3. **Basic UI Framework & Navigation**
   - Update page metadata (remove "Create Next App" branding)
   - Create dashboard layout with role-based navigation
   - Build responsive navigation component
   - Replace starter home page with proper landing/dashboard
   - Add authentication middleware for route protection

### 📋 Medium Term (2-4 weeks)
4. **Claims Management System**
   - Implement Claims CRUD API routes (`/api/claims`)
   - Create Claims dashboard with list/detail views
   - Build claim creation form with client information
   - Add claim status tracking and updates
   - Implement role-based claim access (managers vs inspectors)

5. **Inspection Data Collection**
   - Create inspection submission API (`/api/inspections`)
   - Build dynamic form builder with JSON schema
   - Implement inspection assignment system
   - Create inspection detail views with data display
   - Add inspection status management (draft, completed, etc.)

6. **Photo Upload Integration (Uploadthing)**
   - Set up Uploadthing account and configure API keys
   - Implement photo upload API with security
   - Build camera capture component for mobile devices
   - Create photo gallery with metadata display
   - Add photo management (caption, delete, reorder)

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

---

## Project Status Summary

**✅ Foundation Complete**: Database schema, Prisma ORM, Next.js setup, GitHub integration  
**🔄 Next Priority**: Environment setup, authentication, and basic UI framework  
**📊 Progress**: ~15% complete (foundation phase done)

This documentation reflects the current state as of the latest commit and should be updated as new features are implemented.