# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Development server**: `npm run dev` - Starts Vite dev server with HMR
- **Build**: `npm run build` - Creates production build in `dist/`
- **Lint**: `npm run lint` - Runs ESLint on all JS/JSX files
- **Preview**: `npm run preview` - Preview production build locally

## Architecture

This is a React + Vite application for Seamless Restoration business with complete authentication system.

**Tech Stack:**
- React 19 with JSX
- Vite 6 for build tooling and dev server
- React Router DOM 7 for client-side routing
- Supabase for backend (auth, database, storage)
- ESLint with React hooks and refresh plugins

**Project Structure:**
- `src/` - Source code with React components
- `src/components/` - Reusable UI components
- `src/components/auth/` - Authentication components (Login, Signup, ForgotPassword)
- `src/contexts/` - React Context providers (AuthContext)
- `src/hooks/` - Custom React hooks (useAuth included in AuthContext)
- `src/lib/` - Utility libraries and configurations (Supabase client)
- `public/` - Static assets served directly
- Entry point: `src/main.jsx` renders `App.jsx` with routing

**ESLint Configuration:**
- Uses flat config format with recommended rules
- Enforces React Hooks rules and component refresh patterns
- Ignores unused vars with uppercase/underscore prefix pattern

## Project Implementation Plan

### FOUNDATION SETUP
✅ Create project structure with React + Vite
✅ Set up version control with Git and GitHub
✅ Set up Supabase project and database
✅ Install Supabase client and configure connection
✅ Design database schema (users, cases, inspections, photos tables)
✅ Enable Row Level Security on all tables

### AUTHENTICATION SYSTEM
✅ Configure Supabase Auth settings
✅ Install React Router for navigation
✅ Create AuthContext for state management
✅ Build Login component with email/password form
✅ Build Signup component for user registration
✅ Build ForgotPassword component for password reset
✅ Create ProtectedRoute component for auth guards
✅ Implement role-based access (Admin, Manager, Inspector)
✅ Add role field to user profiles table
✅ Create useAuth custom hook
✅ Test complete authentication flow

### MULTI-STEP INSPECTION FORM
• Install react-hook-form for form management
• Create InspectionForm component structure
• Build form navigation with Previous/Next buttons
• Implement progress indicator
• Add form fields for case information
• Add form fields for item details and damage description
• Add form fields for location and notes
• Implement field validation rules
• Create PhotoUpload component
• Implement camera access for mobile devices
• Add file upload capability for desktop
• Add image preview functionality
• Set up image compression before upload
• Implement autosave with debouncing
• Store draft data in localStorage
• Create Supabase functions for data operations
• Connect form submission to database
• Handle image uploads to Supabase Storage
• Add success/error message handling

### DASHBOARD & SEARCH FUNCTIONALITY
• Create Dashboard component with responsive layout
• Add navigation menu with role-based items
• Build InspectionList component
• Fetch inspections from Supabase
• Display inspections in table/card format
• Add pagination for large datasets
• Implement search bar component
• Create filter dropdowns (date, inspector, status)
• Build filter logic with Supabase queries
• Add sort options (newest, oldest, etc.)
• Create InspectionDetail component
• Display complete inspection data
• Show uploaded photos in gallery format
• Add edit/delete capabilities based on user role

### PDF EXPORT & ADMIN FEATURES
• Install PDF generation library (jsPDF)
• Create PDFGenerator utility
• Design PDF template layout
• Test PDF generation with sample data
• Add "Export to PDF" button to inspections
• Include all form data in PDF output
• Embed images in PDF documents
• Add company branding/header to PDFs
• Test and optimize PDF file sizes
• Create AdminDashboard component
• Show system statistics and recent activity
• Add quick action buttons
• Build user list table
• Add invite user functionality
• Create role assignment interface
• Implement user deactivation
• Add activity logging
• Set up email notifications (optional)

### UI POLISH & DEPLOYMENT
• Install Tailwind CSS for styling
• Apply consistent styling throughout app
• Ensure mobile responsiveness
• Add loading states and skeleton screens
• Implement error boundaries
• Add lazy loading for images
• Implement code splitting for routes
• Optimize bundle size
• Cache frequently accessed data
• Write unit tests for critical functions
• Test all user flows manually
• Test on multiple devices and browsers
• Fix any discovered bugs
• Write README with setup instructions
• Create user manual with screenshots
• Document API endpoints and database schema
• Create admin guide
• Set up Vercel account for deployment
• Configure environment variables
• Update API URLs for production
• Test build process locally
• Connect GitHub repo to Vercel
• Configure automatic deployments
• Set up custom domain (if available)
• Monitor deployment for issues
• Conduct final production testing

### POST-LAUNCH
• Create training videos for users
• Conduct user training sessions
• Gather initial feedback
• Create support documentation
• Set up error tracking (Sentry)
• Monitor Supabase usage
• Plan for regular backups
• Document maintenance procedures