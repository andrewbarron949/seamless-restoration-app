# Next.js Multi-Tenant SaaS Template

A complete, production-ready template for building multi-tenant SaaS applications with Next.js, featuring authentication, organization management, and role-based access control.

## ✨ Features

- 🔐 **Complete Authentication System** - NextAuth.js with credentials provider
- 🏢 **Multi-Tenant Architecture** - Organization-scoped data and user management
- 👥 **Role-Based Access Control** - Admin, Manager, and Inspector roles
- 📱 **Responsive Design** - Mobile-first with Tailwind CSS
- 🛡️ **Type Safety** - Full TypeScript implementation
- 🗄️ **Database Ready** - Prisma ORM with PostgreSQL
- 🎨 **Modern UI** - Clean, professional interface components
- 🔄 **Session Management** - JWT-based sessions with automatic refresh

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo>
   cd your-saas-app
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL=postgresql://username:password@localhost:5432/your-db
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Create your first organization**
   - Visit `http://localhost:3000`
   - Click "Create Account" 
   - Complete organization registration

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── users/                # User management API
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── claims/               # Claims wireframe (Manager/Admin)
│   │   ├── inspections/          # Items wireframe (Inspector)
│   │   ├── profile/              # User profile
│   │   ├── settings/             # Organization settings (Admin)
│   │   └── users/                # User management (Admin)
│   ├── login/                    # Login page
│   └── register/                 # Organization registration
├── components/                   # Reusable UI components
├── lib/                         # Utility libraries
│   ├── auth.ts                  # NextAuth configuration
│   └── prisma.ts                # Database client
└── types/                       # TypeScript type definitions
```

## 🗄️ Database Schema

### Core Models
- **Organization** - Multi-tenant container
- **User** - Organization members with roles
- **Account/Session** - NextAuth session management

### Ready for Extension
The schema is designed for easy extension. Add your business models with proper organization scoping:

```typescript
model YourModel {
  id             String   @id @default(cuid())
  name           String
  organizationId String
  userId         String
  
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id])
}
```

## 👥 User Roles

- **Admin** - Full access to organization settings and user management
- **Manager** - Access to claims and user oversight  
- **Inspector** - Access to items and personal profile

Role-based page access is automatically enforced through middleware.

## 🛠️ Built With

- **Frontend**: Next.js 15.3, React 19, TypeScript 5
- **Authentication**: NextAuth.js 4.24 with JWT
- **Database**: Prisma 6.10 + PostgreSQL
- **Styling**: Tailwind CSS 4
- **Validation**: Built-in form validation
- **Deployment**: Vercel/Docker ready

## 🎨 UI Components

Pre-built, responsive components included:
- Dashboard layouts with sidebar navigation
- Form components with validation
- Data tables and cards
- Modal dialogs and notifications
- Role-based menu systems

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npx prisma studio    # Open database browser
npx prisma migrate   # Run database migrations
```

### Adding New Features

1. **Create Database Models** - Add to `prisma/schema.prisma` with organization scoping
2. **Generate Prisma Client** - `npx prisma generate`
3. **Create API Routes** - Add to `src/app/api/` with proper authentication
4. **Build UI Pages** - Add to `src/app/dashboard/`
5. **Update Navigation** - Modify `src/components/navigation.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Docker
```bash
docker build -t your-saas-app .
docker run -p 3000:3000 your-saas-app
```

## 🔐 Security Features

- ✅ Password hashing with bcryptjs (12 rounds)
- ✅ JWT session tokens with automatic refresh
- ✅ Organization data isolation
- ✅ Role-based route protection
- ✅ CSRF protection via NextAuth
- ✅ SQL injection prevention via Prisma

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Application URL | ✅ |
| `NEXTAUTH_SECRET` | JWT signing secret | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ✅ |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 Check the [CLAUDE.md](CLAUDE.md) for detailed technical documentation
- 🐛 Report bugs by opening an issue
- 💡 Request features by opening an issue
- 💬 Ask questions in discussions

---

**Ready to build your SaaS?** This template provides the foundation - add your business logic and launch! 🚀
