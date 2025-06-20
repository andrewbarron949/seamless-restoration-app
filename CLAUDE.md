# Next.js Multi-Tenant SaaS Template - Technical Reference

A complete, production-ready template for building multi-tenant SaaS applications with authentication, organization management, and role-based access control.

## 🎯 Template Overview

This template provides a solid foundation for any SaaS application with:
- ✅ **Complete Authentication System** - Login, registration, session management
- ✅ **Multi-Tenant Architecture** - Organization-scoped data isolation
- ✅ **Role-Based Access Control** - Admin, Manager, Inspector roles
- ✅ **Responsive Dashboard** - Mobile-first design with Tailwind CSS
- ✅ **User Management** - Full CRUD operations for organization users
- ✅ **Wireframe Pages** - Ready-to-customize placeholder pages
- ✅ **TypeScript Ready** - Full type safety throughout

## Tech Stack
- **Frontend**: Next.js 15.3.3 (App Router), React 19, TypeScript 5
- **Database**: Prisma 6.10.0 + PostgreSQL (multi-tenant)
- **Auth**: NextAuth.js 4.24.11 + PrismaAdapter + JWT + bcryptjs (12 rounds)
- **Styling**: Tailwind CSS 4 + PostCSS + responsive design
- **Development**: ESLint 9, hot reload, TypeScript strict mode

## Database Schema

```typescript
model Organization {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  users     User[]
  @@map("organizations")
}

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  password       String?
  name           String?
  role           String    @default("INSPECTOR") // INSPECTOR, MANAGER, ADMIN
  isOwner        Boolean   @default(false)
  organizationId String
  emailVerified  DateTime?
  image          String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  accounts     Account[]
  sessions     Session[]
  @@map("users")
}

// Additional models can be added here for your business logic
// Example:
// model Item {
//   id             String   @id @default(cuid())
//   name           String
//   description    String?
//   status         String   @default("ACTIVE")
//   createdAt      DateTime @default(now())
//   updatedAt      DateTime @updatedAt
//   userId         String
//   organizationId String
//   
//   user         User         @relation(fields: [userId], references: [id])
//   organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
//   @@map("items")
// }

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
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

## API Routes

| Route | Method | Purpose | Auth | Location |
|-------|--------|---------|------|----------|
| `/api/test-db` | GET | Database health check | None | `src/app/api/test-db/route.ts` |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth endpoints | None | `src/app/api/auth/[...nextauth]/route.ts` |
| `/api/auth/register` | POST | Organization registration | None | `src/app/api/auth/register/route.ts` |
| `/api/users` | GET | List org users | Admin | `src/app/api/users/route.ts` |
| `/api/users` | POST | Create org user | Admin | `src/app/api/users/route.ts` |
| `/api/users/[id]` | PATCH | Update user | Admin | `src/app/api/users/[id]/route.ts` |
| `/api/users/[id]` | DELETE | Delete user | Admin | `src/app/api/users/[id]/route.ts` |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts    # NextAuth handler
│   │   ├── auth/register/route.ts         # Org registration
│   │   ├── users/route.ts                 # User CRUD
│   │   ├── users/[id]/route.ts            # User update/delete
│   │   └── test-db/route.ts               # DB health check
│   ├── dashboard/
│   │   ├── layout.tsx                     # Dashboard layout
│   │   ├── page.tsx                       # Main dashboard
│   │   ├── claims/page.tsx                # Claims wireframe (Manager/Admin)
│   │   ├── inspections/page.tsx           # Items wireframe (Inspector)
│   │   ├── inspections/new/page.tsx       # Add item wireframe
│   │   ├── profile/page.tsx               # User profile
│   │   ├── users/page.tsx                 # User management (Admin)
│   │   └── settings/page.tsx              # Organization settings (Admin)
│   ├── login/page.tsx                     # Login form
│   ├── register/page.tsx                  # Org registration
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Home page
│   └── providers.tsx                      # SessionProvider
├── components/
│   └── navigation.tsx                     # Navigation component
├── lib/
│   ├── auth.ts                            # NextAuth config
│   └── prisma.ts                          # Prisma client
└── types/
    ├── next-auth.d.ts                     # NextAuth types
    └── organization.ts                    # Template types
```

## Key Implementation Patterns

### NextAuth Configuration
```typescript
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [CredentialsProvider({
    async authorize(credentials) {
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        include: { organization: { select: { id: true, name: true } } }
      })
      if (user && await bcrypt.compare(credentials.password, user.password)) {
        return { id: user.id, email: user.email, name: user.name, role: user.role, 
                organizationId: user.organizationId, isOwner: user.isOwner, organization: user.organization }
      }
      return null
    }
  })],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id; token.role = user.role; token.organizationId = user.organizationId
        token.isOwner = user.isOwner; token.organization = user.organization
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.id = token.id; session.user.role = token.role
      session.user.organizationId = token.organizationId; session.user.isOwner = token.isOwner
      session.user.organization = token.organization
      return session
    }
  }
}
```

### Database Access Pattern
```typescript
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    const result = await prisma.user.findMany()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
```

### Multi-Tenant User Management
```typescript
// Organization-scoped queries
const users = await prisma.user.findMany({
  where: { organizationId: session.user.organizationId }
})

// Transaction for org registration
const result = await prisma.$transaction(async (tx) => {
  const organization = await tx.organization.create({ data: { name: organizationName } })
  const user = await tx.user.create({
    data: { email, password: hashedPassword, role: 'ADMIN', isOwner: true, organizationId: organization.id }
  })
  return { user, organization }
})
```

### Responsive Layout Pattern
```typescript
// Dashboard layout: Fixed 256px sidebar + full-width content
<div className="min-h-screen bg-slate-50 flex">
  <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:relative lg:translate-x-0">
    {/* Sidebar */}
  </div>
  <div className="flex-1 flex flex-col min-w-0">
    <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12">{children}</main>
  </div>
</div>

// Responsive grids
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
```

### Route Protection Middleware
```typescript
export default withAuth(function middleware(req) {
  const { pathname } = req.nextUrl
  const userRole = req.nextauth.token.role
  const organizationId = req.nextauth.token.organizationId
  
  if (!organizationId) return NextResponse.redirect(new URL('/login', req.url))
  
  // Role-based access control
  if (pathname.startsWith('/dashboard/users') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  
  // Add org headers for API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const headers = new Headers(req.headers)
    headers.set('x-organization-id', organizationId)
    headers.set('x-user-role', userRole)
    return NextResponse.next({ request: { headers } })
  }
})
```

## 🛡️ Security Features

- **Password Security**: bcryptjs with 12 rounds of hashing
- **JWT Sessions**: Secure, stateless authentication tokens
- **Organization Isolation**: Complete data separation between tenants
- **Role-Based Access**: Automatic route protection based on user roles
- **CSRF Protection**: Built-in NextAuth CSRF protection
- **SQL Injection Prevention**: Prisma ORM query safety

## 📄 Page Structure & Features

### Authentication Pages
- **`/`** - Generic SaaS landing page with login/register options
- **`/login`** - Email/password authentication form
- **`/register`** - Organization registration with owner account creation

### Dashboard Pages (Protected)
- **`/dashboard`** - Welcome dashboard with template feature overview
- **`/dashboard/profile`** - User profile management with role display
- **`/dashboard/users`** - User management (Admin only) - **FULLY FUNCTIONAL**
- **`/dashboard/settings`** - Organization settings (Admin only) - **WIREFRAME**

### Wireframe Pages (Ready for Customization)
- **`/dashboard/claims`** - Empty table with "Add Claim" button (Manager/Admin)
- **`/dashboard/inspections`** - Empty list with "Add Item" button (Inspector)
- **`/dashboard/inspections/new`** - Basic form wireframe (Inspector)

## Environment Variables

| Variable | Purpose | Status |
|----------|---------|--------|
| `NEXTAUTH_URL` | NextAuth base URL | ✅ Required |
| `NEXTAUTH_SECRET` | JWT signing secret | ✅ Required |
| `DATABASE_URL` | PostgreSQL connection | ✅ Required |

## Development Commands

```bash
# Application
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint check

# Database
npx prisma generate      # Generate client
npx prisma migrate dev   # Apply migrations
npx prisma studio        # Visual browser
npx prisma db push       # Push schema changes

# Health check
curl http://localhost:3000/api/test-db
```

## TypeScript Interfaces

```typescript
export interface Organization {
  id: string; name: string; createdAt: string; updatedAt: string
}

export interface OrganizationUser {
  id: string; email: string; name?: string | null
  role: 'ADMIN' | 'MANAGER' | 'INSPECTOR'; isOwner: boolean; organizationId: string
  createdAt: string; updatedAt: string; organization?: Organization
}

export interface SessionUser {
  id: string; email: string; name?: string | null
  role: 'ADMIN' | 'MANAGER' | 'INSPECTOR'; organizationId: string; isOwner: boolean
  organization: { id: string; name: string }
}
```

## Responsive Breakpoints
- **Mobile (< 640px)**: Single column, hamburger menu
- **Small (640px+)**: Two-column grids, enhanced typography
- **Medium (768px+)**: Three-column layouts
- **Large (1024px+)**: Fixed sidebar, four-column grids
- **XL (1280px+)**: Enhanced padding, desktop workflows
- **2XL (1536px+)**: Maximum spacing, ultra-wide support

## 🚀 Getting Started with the Template

### 1. Clone and Setup
```bash
git clone <your-repo>
cd your-saas-app
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-secret-key
DATABASE_URL=postgresql://username:password@localhost:5432/your-database
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Start Development
```bash
npm run dev
```

### 5. Create First Organization
1. Visit `http://localhost:3000`
2. Click "Create Account"
3. Complete organization registration
4. Login and explore the dashboard

## 🛠️ Customization Guide

### Adding New Business Models
1. **Update Prisma Schema** (`prisma/schema.prisma`):
```typescript
model YourModel {
  id             String   @id @default(cuid())
  name           String
  organizationId String
  userId         String
  
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id])
  @@map("your_models")
}
```

2. **Add Relations to User/Organization models**
3. **Generate Prisma Client**: `npx prisma generate`
4. **Create API Routes** in `src/app/api/`
5. **Build UI Pages** in `src/app/dashboard/`
6. **Update Navigation** in `src/components/navigation.tsx`

### Replacing Wireframe Pages
The template includes wireframe pages ready for your business logic:
- Replace `src/app/dashboard/claims/page.tsx` with your entity management
- Replace `src/app/dashboard/inspections/` with your workflow pages
- Update navigation labels and icons in `src/components/navigation.tsx`

## 📋 Template Checklist

### ✅ Core Features (Complete)
- [x] Multi-tenant database schema
- [x] NextAuth.js authentication system
- [x] Organization registration flow
- [x] User management (CRUD operations)
- [x] Role-based access control
- [x] Responsive dashboard layout
- [x] Session management with JWT
- [x] Password hashing and security
- [x] TypeScript type definitions
- [x] API route structure

### 🎨 UI Components (Complete)
- [x] Navigation sidebar with role-based menu
- [x] Responsive dashboard layout
- [x] Form components with validation
- [x] Data tables and cards
- [x] Modal dialogs and notifications
- [x] Profile management interface
- [x] Settings page structure

### 🔧 Development Tools (Complete)
- [x] ESLint configuration
- [x] TypeScript strict mode
- [x] Prisma database toolkit
- [x] Development hot reload
- [x] Database health check endpoint

## Status
**Template Status**: Production-ready SaaS foundation ✅  
**Completed Features**: Authentication, multi-tenancy, user management, responsive UI, role-based access  
**Ready For**: Your business logic implementation and customization