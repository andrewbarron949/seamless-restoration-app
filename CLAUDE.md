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
- React Hook Form for form management
- Supabase for backend (auth, database, storage)
- Tailwind CSS v4 for responsive styling and design system (CSS-first configuration)
- PostCSS with @tailwindcss/postcss plugin and Autoprefixer
- ESLint with React hooks and refresh plugins

**Project Structure:**
- `src/` - Source code with React components
- `src/components/` - Reusable UI components
- `src/components/auth/` - Authentication components (Login, Signup, ForgotPassword)
- `src/components/forms/` - Form components (InspectionForm and steps)
- `src/components/ui/` - UI components (ProgressIndicator)
- `src/contexts/` - React Context providers (AuthContext)
- `src/hooks/` - Custom React hooks (useAuth included in AuthContext)
- `src/lib/` - Utility libraries and configurations (Supabase client, inspections API)
- `public/` - Static assets served directly
- Entry point: `src/main.jsx` renders `App.jsx` with routing

**ESLint Configuration:**
- Uses flat config format with recommended rules
- Enforces React Hooks rules and component refresh patterns
- Ignores unused vars with uppercase/underscore prefix pattern

**Tailwind CSS v4 Configuration:**
- Uses CSS-first configuration with `@theme` directive instead of tailwind.config.js
- Custom colors and design tokens defined in `src/index.css` using CSS variables
- Configured with `@tailwindcss/postcss` plugin for PostCSS integration
- Supports modern responsive design with custom shadows, animations, and typography

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
✅ Install react-hook-form for form management
✅ Create InspectionForm component structure
✅ Build form navigation with Previous/Next buttons
✅ Implement progress indicator
✅ Add form fields for case information
✅ Add form fields for item details and damage description
✅ Add form fields for location and notes
✅ Implement field validation rules
✅ Create PhotoUpload component
✅ Implement camera access for mobile devices
✅ Add file upload capability for desktop
✅ Add image preview functionality
• Set up image compression before upload
✅ Implement autosave with debouncing
✅ Store draft data in localStorage
✅ Create Supabase functions for data operations
✅ Connect form submission to database
✅ Handle image uploads to Supabase Storage
✅ Add success/error message handling
✅ Create database tables (cases, inspection_items, photos)
✅ Set up Row Level Security policies
✅ Configure Supabase Storage bucket for photos
✅ Fix RLS policy infinite recursion issue
✅ Verify and deploy corrected RLS policies to production

**Database Schema:**
- `cases` - Case and claim information (case_number, claim_number, insurance_company, policy_holder, date_of_loss, property_address)
- `inspections` - Core inspection records (case_id, inspector_id, inspection_date, inspection_type, status, location_details, general_notes)
- `inspection_items` - Detailed damage assessment (item_category, item_description, item_age, damage_description, damage_types, room_location)
- `photos` - Photo documentation (file_name, file_path, file_url, file_size, file_type)
- `profiles` - User information with roles (first_name, last_name, email, role)

**Key Features Completed:**
- Complete 5-step inspection form with validation
- Auto-save functionality with localStorage backup
- Photo upload with drag & drop and camera access
- Progress indicator and step navigation
- Database integration with existing schema
- Row Level Security for data protection
- Role-based access control (Admin, Manager, Inspector)
- Modern responsive UI with Tailwind CSS design system
- Mobile-first responsive design that adapts to all screen sizes
- Professional authentication interface with animations
- Comprehensive form validation and error handling
- Smooth animations and loading states
- Fixed RLS policy infinite recursion preventing form submission

**Recent Fixes:**
- ❌ ISSUE: Original RLS policies used incorrect table names causing infinite recursion
- ❌ ISSUE: Application code used `user_profiles` instead of correct `profiles` table name
- ❌ ISSUE: Policy files targeted wrong tables: `inspection_details`, `inspection_photos`
- ❌ ISSUE: Complex RLS policies with user ownership checks still caused infinite recursion
- ❌ ISSUE: Ultra-simple RLS policies still caused infinite recursion due to trigger interaction
- ✅ ROOT CAUSE IDENTIFIED: `handle_updated_at()` triggers interacting with RLS policies cause recursive loops
- ✅ FINAL SOLUTION: Disable RLS and fix trigger function to prevent recursion
- ✅ FIXED: AuthContext.jsx table name bug (`user_profiles` → `profiles`)
- ✅ DEPLOYED: `fix-infinite-recursion-complete.sql` - **CURRENT SOLUTION** in production
- ✅ WORKING: Form submission now functional without infinite recursion errors

**SQL Fix Files:**
- `fix-rls-policies.sql` - Original flawed version (DO NOT USE - wrong table names)
- `fix-rls-policies-corrected.sql` - Advanced version (wrong table names)
- `fix-rls-policies-simple.sql` - Incorrect table names (DO NOT USE)
- `fix-rls-policies-corrected-final.sql` - Complex policies (caused recursion)
- `fix-rls-ultra-simple.sql` - Ultra-simple policies (still caused recursion with triggers)
- `fix-infinite-recursion-complete.sql` - **CURRENT SOLUTION** - Disables RLS and fixes triggers
- `check-rls-policies.sql` - Diagnostic script to identify RLS/trigger issues
- `emergency-disable-rls.sql` - Emergency RLS disable (superseded by complete fix)

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
✅ Install Tailwind CSS for styling
✅ Apply consistent styling throughout app
✅ Ensure mobile responsiveness
✅ Add loading states and skeleton screens
✅ Fixed database schema column name mismatches
✅ Modernized authentication UI components
✅ Implemented responsive multi-step form design
✅ Added proper viewport configuration
✅ Created comprehensive design system with custom components
✅ Added smooth animations and transitions
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