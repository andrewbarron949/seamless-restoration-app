// Organization-related TypeScript interfaces

export interface Organization {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface OrganizationUser {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN' | 'MANAGER' | 'INSPECTOR'
  isOwner: boolean
  organizationId: string
  emailVerified?: string | null
  image?: string | null
  createdAt: string
  updatedAt: string
  organization?: Organization
}


export interface CreateUserRequest {
  name?: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'INSPECTOR'
  temporaryPassword?: string
}

export interface CreateUserResponse {
  message: string
  user: OrganizationUser
  temporaryPassword: string
}

export interface UpdateUserRequest {
  name?: string
  role?: 'ADMIN' | 'MANAGER' | 'INSPECTOR'
}

export interface UpdateUserResponse {
  message: string
  user: OrganizationUser
}

export interface OrganizationStats {
  totalUsers: number
  totalInspectors: number
  totalManagers: number
  totalAdmins: number
}

// Multi-tenant context interface
export interface MultiTenantContext {
  organizationId: string
  userRole: 'ADMIN' | 'MANAGER' | 'INSPECTOR'
  isOwner: boolean
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form data interfaces
export interface OrganizationRegistrationData {
  organizationName: string
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export interface AddUserFormData {
  name: string
  email: string
  role: 'ADMIN' | 'MANAGER' | 'INSPECTOR'
  temporaryPassword: string
}

// Extended session user interface (matches NextAuth types)
export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN' | 'MANAGER' | 'INSPECTOR'
  organizationId: string
  isOwner: boolean
  organization: {
    id: string
    name: string
  }
}

export default Organization