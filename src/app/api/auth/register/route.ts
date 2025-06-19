import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, organizationName } = await request.json()

    // Validate required fields
    if (!email || !password || !organizationName) {
      return NextResponse.json(
        { error: 'Email, password, and organization name are required' },
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

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Validate organization name
    if (organizationName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Organization name must be at least 2 characters long' },
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

    // Create organization and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: organizationName.trim(),
        }
      })

      // Create user as organization admin/owner
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          role: 'ADMIN',
          isOwner: true,
          organizationId: organization.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isOwner: true,
          organizationId: true,
          createdAt: true,
          organization: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      })

      return { user, organization }
    })

    return NextResponse.json(
      {
        message: 'Organization created successfully',
        user: result.user,
        organization: result.organization
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}