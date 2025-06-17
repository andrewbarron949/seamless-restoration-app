# Seamless Restoration App - Documentation

## Project Overview
**Phase**: Foundation Setup Complete ✅  
**Current State**: Database infrastructure implemented, ready for authentication and UI development

This is a Next.js web application for Seamless Restoration that will provide inspection management, claims tracking, and photo documentation capabilities. The app is designed for insurance inspectors, managers, and clients to streamline the restoration claims process.

**Target Users:**
- Insurance Inspectors (field data collection)
- Managers (oversight and reporting)
- Clients (claim status tracking)

## Tech Stack

### ✅ Implemented Technologies
- **Frontend**: Next.js 15.3.3 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS
- **Database**: Prisma 6.10.0 + Neon PostgreSQL
- **Code Quality**: ESLint 9
- **Development**: Hot reload, TypeScript strict mode

### 🔄 Planned Technologies
- **Authentication**: NextAuth.js (pending)
- **File Upload**: Uploadthing (pending)
- **Deployment**: Vercel (pending)
- **Testing**: Jest + React Testing Library (pending)

## Project Structure
```
src/
  app/
    api/
      test-db/
        route.ts           # Database connection test endpoint
    favicon.ico
    globals.css            # Global Tailwind styles
    layout.tsx             # Root layout with metadata
    page.tsx               # Home page (starter template)
  lib/
    prisma.ts              # Prisma client singleton
prisma/
  migrations/
    20250617184721_init/   # Initial database migration
  schema.prisma            # Database schema definitions
public/                    # Static assets (SVG icons)
CLAUDE.md                  # This documentation file
```

## Database Schema
**Migration**: `20250617184721_init` ✅ Applied

### Models Overview
- **User**: Inspectors, managers, admin users
- **Claim**: Insurance claims with client information
- **Inspection**: Inspection data collection sessions
- **Photo**: Inspection photos with metadata

### Relationships
```
User (1) ←→ (many) Claim
User (1) ←→ (many) Inspection (as inspector)
Claim (1) ←→ (many) Inspection
Inspection (1) ←→ (many) Photo
```

## ✅ Completed Features

### Database Infrastructure
- [x] Prisma ORM setup with PostgreSQL
- [x] Database schema with 4 core models
- [x] Foreign key relationships established
- [x] Neon PostgreSQL connection configured
- [x] Database migration system initialized
- [x] Prisma client singleton pattern
- [x] Database connection test endpoint

### Development Environment
- [x] Next.js 15 App Router setup
- [x] TypeScript configuration
- [x] Tailwind CSS 4 integration
- [x] ESLint code quality tools
- [x] Development server with hot reload

## Environment Variables
**Required for Development:**
```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Future additions:
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-here"
# UPLOADTHING_SECRET="sk_live_..."
# UPLOADTHING_APP_ID="..."
```

## API Routes

### ✅ Implemented
- `GET /api/test-db` - Database connectivity test
  - Returns connection status and table counts
  - Location: `src/app/api/test-db/route.ts`

### 🔄 Planned
- `POST /api/auth/register` - User registration
- `GET/POST /api/claims` - Claims management
- `GET/POST /api/inspections` - Inspection data
- `POST /api/upload` - Photo upload via Uploadthing

## Components
**Current**: Using Next.js starter template components

### 🔄 Planned Components
- `<LoginForm />` - Authentication
- `<ClaimCard />` - Claim display
- `<InspectionForm />` - Dynamic form builder
- `<PhotoUpload />` - Camera + upload
- `<Dashboard />` - Main app interface

## Development Commands
```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint code checking

# Database
npx prisma migrate dev   # Run database migrations
npx prisma generate      # Generate Prisma client
npx prisma studio        # Visual database browser (localhost:5555)
npx prisma db push       # Push schema changes without migration

# Utilities
npx prisma db seed       # Seed database (when implemented)
npx prisma db reset      # Reset database (development only)
```

## Testing

### Database Testing
- **Test Endpoint**: `GET /api/test-db`
- **Prisma Studio**: `npx prisma studio` (localhost:5555)
- **Manual Testing**: Verify all CRUD operations

### 🔄 Planned Testing
- Unit tests for API routes
- Integration tests for database operations
- E2E tests for user workflows
- Mobile responsiveness testing

## Known Issues
- **Starter Content**: Home page still shows Next.js template
- **No Authentication**: All routes currently public
- **No UI Components**: Need custom components for app functionality
- **Environment**: `.env` file needs to be added to `.gitignore`

## Next Steps (Priority Order)

### 🔥 Immediate (Next 1-2 weeks)
1. **NextAuth.js Setup**
   - Install `next-auth @auth/prisma-adapter`
   - Configure credentials provider
   - Add User registration/login
   - Implement role-based access

2. **Basic UI Framework**
   - Create dashboard layout
   - Build navigation component
   - Replace starter home page
   - Add protected route middleware

3. **Claims Management**
   - Claims CRUD API routes
   - Claims list/detail pages
   - Basic claim creation form

### 📋 Medium Term (2-4 weeks)
4. **Inspection System**
   - Dynamic form builder
   - Inspection data collection
   - Form templates system

5. **Photo Upload (Uploadthing)**
   - Photo upload API integration
   - Camera capture component
   - Photo gallery display

6. **User Management**
   - User roles and permissions
   - Inspector assignment
   - Team management

### 🚀 Long Term (1-2 months)
7. **Advanced Features**
   - Real-time updates
   - Mobile PWA capabilities
   - Data export (PDF/CSV)
   - Analytics dashboard

8. **Production Deployment**
   - Vercel deployment
   - Environment configuration
   - Performance optimization
   - Security hardening

## Code Patterns & Best Practices

### Database Access
```typescript
// Use the singleton pattern
import prisma from '@/lib/prisma'

// Always handle connections properly
try {
  await prisma.$connect()
  const result = await prisma.user.findMany()
  return result
} finally {
  await prisma.$disconnect()
}
```

### API Route Structure
```typescript
// src/app/api/[resource]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  // Implementation
}

export async function POST(request: Request) {
  // Implementation
}
```

### TypeScript Conventions
- Use Prisma generated types: `User`, `Claim`, `Inspection`, `Photo`
- Strict type checking enabled
- Prefer interfaces for component props
- Use proper error handling with typed catches
1.2 NextAuth.js Authentication Setup
Install NextAuth.js: npm install next-auth @auth/prisma-adapter
Create auth configuration in src/lib/auth.ts: import { NextAuthOptions } from "next-auth"import CredentialsProvider from "next-auth/providers/credentials"import { PrismaAdapter } from "@auth/prisma-adapter"import prisma from "@/lib/prisma"

Create auth route handler at src/app/api/auth/[...nextauth]/route.ts
Configure credentials provider for email/password login
Add bcrypt for password hashing: npm install bcryptjs @types/bcryptjs
Create registration API at POST /api/auth/register
Build login page at src/app/login/page.tsx
Create SessionProvider wrapper in src/app/providers.tsx
Add middleware.ts for route protection using NextAuth
1.3 Base Layout & Navigation
Create dashboard layout in src/app/dashboard/layout.tsx
Build responsive navigation component with Tailwind
Add role-based menu items (Inspector, Manager, Admin)
Use useSession hook for user info display
Create protected route wrapper using NextAuth
Setup loading and error states
Phase 2: Core Inspection Features (Week 3-4)
2.1 Claims Management
Create claims dashboard at src/app/dashboard/claims/page.tsx
Build API routes with NextAuth session checks:
GET /api/claims - List claims based on user role
POST /api/claims - Create new claim (managers only)
GET /api/claims/[id] - Get single claim details
PATCH /api/claims/[id] - Update claim status
Create ClaimCard component with status badges
Add search and filter functionality
Implement claim creation form with react-hook-form
2.2 Inspection Form Builder
Create dynamic form schema structure
Build form components:
TextInput, TextArea, Select, Checkbox components
PhotoCapture component with camera access
SignatureCanvas component
Store form templates in database
Create inspection page at src/app/dashboard/inspections/new/page.tsx
Add form validation with zod
Protect form submission with NextAuth session
2.3 Photo Management with Uploadthing
Install uploadthing: npm install uploadthing @uploadthing/react
Create Uploadthing account at https://uploadthing.com
Add to .env.local: UPLOADTHING_SECRET=sk_live_...UPLOADTHING_APP_ID=...

Setup uploadthing in src/app/api/uploadthing/core.ts: import { createUploadthing } from "uploadthing/next"import { getServerSession } from "next-auth/next"import { authOptions } from "@/lib/auth"const f = createUploadthing()export const ourFileRouter = {  inspectionPhotos: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })    .middleware(async ({ req }) => {      const session = await getServerSession(authOptions)      if (!session) throw new Error("Unauthorized")      return { userId: session.user.id }    })    .onUploadComplete(async ({ metadata, file }) => {      // Save to database via Prisma    }),}

Create photo upload component with drag and drop
Build photo gallery component
Add automatic image optimization
Phase 3: Data Persistence & Retrieval (Week 5-6)
3.1 Inspection Submission Flow
Create inspection submission API: POST /api/inspections
Verify user session with NextAuth before saving
Handle form data with Uploadthing photo URLs
Implement Prisma transaction for data consistency
Add success/error notifications with toast
Create submission confirmation page
3.2 Inspection Detail Views
Build inspection detail page at src/app/dashboard/inspections/[id]/page.tsx
Check user permissions with NextAuth session
Create read-only form renderer
Display Uploadthing photos in gallery
Show inspection history and timestamps
Add print-friendly view with CSS
3.3 Data Export Features
Create export API routes with auth checks:
GET /api/claims/[id]/export - Export as PDF
GET /api/reports/csv - Bulk export (managers only)
Use react-pdf for PDF generation
Include Uploadthing photo URLs in exports
Add download buttons to UI
Phase 4: Advanced Features (Week 7-8)
4.1 Real-time Updates
Use Vercel's Edge Functions for real-time
Add Server-Sent Events for claim updates
Create notification system for new assignments
Build notification bell component
Store preferences in Neon database
Send notifications based on user session
4.2 Mobile Optimization & PWA
Configure PWA in next.config.js
Create manifest.json with app icons
Add service worker for offline support
Optimize touch interactions
Test Uploadthing camera upload on mobile
Ensure NextAuth session persists offline
4.3 Search & Analytics
Implement full-text search with Neon/PostgreSQL
Create analytics dashboard at src/app/dashboard/analytics/page.tsx
Restrict analytics to managers/admins via NextAuth
Use recharts for data visualization
Query aggregated data from Neon
Add date range filters
Phase 5: User Management & Permissions (Week 9)
5.1 Role-Based Access Control with NextAuth
Extend NextAuth callbacks for role checking: callbacks: {  session: ({ session, token }) => ({    ...session,    user: {      ...session.user,      id: token.sub,      role: token.role,    },  }),  jwt: async ({ token, user }) => {    if (user) {      token.role = user.role    }    return token  },}

Create permission checking utilities
Add role management UI for admins
Implement inspector assignment system
Build team management page
5.2 Client Portal
Create public claim lookup page (no auth required)
Build magic link authentication for clients
Add claim tracking timeline component
Implement secure document sharing via Uploadthing
Create client notification preferences
Phase 6: Testing & Deployment (Week 10)
6.1 Testing Implementation
Setup Jest for unit tests
Test NextAuth authentication flows
Write tests for protected API routes
Test Neon database connections
Test Uploadthing file uploads
Add error boundary components
6.2 Vercel Production Deployment
Push code to GitHub repository
Connect GitHub repo to Vercel
Add environment variables in Vercel dashboard: DATABASE_URL (Neon connection string)NEXTAUTH_URL=https://yourdomain.vercel.appNEXTAUTH_SECRET (generate with: openssl rand -base64 32)UPLOADTHING_SECRETUPLOADTHING_APP_ID

Enable Vercel Analytics
Configure custom domain (optional)
Setup preview deployments for branches
Phase 7: Polish & Optimization (Week 11-12)
7.1 Performance Optimization
Implement image optimization with Uploadthing transforms
Add lazy loading for claim lists
Optimize Neon queries with indexes
Use Vercel Edge caching
Cache NextAuth sessions appropriately
Monitor with Vercel Analytics
7.2 Final Features
Add help documentation system
Create onboarding flow for new users
Implement forgot password flow with NextAuth
Add activity audit logs with user tracking
Create system settings page
Add two-factor authentication option
Technical Implementation Notes
Environment Variables Structure
# Neon Database
DATABASE_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..." # Generate with: openssl rand -base64 32

# Uploadthing
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."

# Vercel (auto-populated)
VERCEL_URL="..."
NextAuth Session Usage Pattern
// In API routes
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }
  // Use session.user.id, session.user.role, etc.
}

// In client components
import { useSession } from "next-auth/react"

export function MyComponent() {
  const { data: session, status } = useSession()
  if (status === "loading") return <p>Loading...</p>
  if (status === "unauthenticated") return <p>Access Denied</p>
  // Use session.user
}
API Route Pattern with Auth
/api/[resource]/route.ts - GET (list), POST (create) - requires auth
/api/[resource]/[id]/route.ts - GET, PATCH, DELETE - requires auth + ownership check
/api/auth/[...nextauth]/route.ts - NextAuth handler
/api/auth/register/route.ts - Public registration endpoint
Uploadthing Integration Points
/api/uploadthing/core.ts - File router with NextAuth checks
/api/uploadthing/route.ts - Upload endpoint
Components use @uploadthing/react hooks with session
Vercel Deployment Checklist
[ ] All environment variables set (especially NEXTAUTH_SECRET)
[ ] NEXTAUTH_URL points to production domain
[ ] Database migrations run on Neon production
[ ] Build command: npm run build
[ ] Node.js version: 18.x or later
[ ] Enable Web Analytics
