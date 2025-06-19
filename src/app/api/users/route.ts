import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/users - List all users in the organization
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only allow admins to view users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.$connect()

    const users = await prisma.user.findMany({
      where: {
        organizationId: session.user.organizationId
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isOwner: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ users })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST /api/users - Create new user in the organization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only allow admins to create users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { email, name, role, temporaryPassword } = await request.json()

    // Validate required fields
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['INSPECTOR', 'MANAGER', 'ADMIN']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Generate temporary password if not provided
    const password = temporaryPassword || Math.random().toString(36).slice(-12)
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    await prisma.$connect()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user in the same organization
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        role,
        password: hashedPassword,
        organizationId: session.user.organizationId,
        isOwner: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isOwner: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user,
        temporaryPassword: password // Return the password for the admin to share
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}