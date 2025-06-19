import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only allow admins to update users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { name, role } = await request.json()
    const { id: userId } = await context.params

    // Validate role if provided
    if (role) {
      const validRoles = ['INSPECTOR', 'MANAGER', 'ADMIN']
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        )
      }
    }

    await prisma.$connect()

    // Check if user exists and belongs to the same organization
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.user.organizationId
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent demoting or removing the organization owner
    if (existingUser.isOwner && role && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot change role of organization owner' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isOwner: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only allow admins to delete users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: userId } = await context.params

    await prisma.$connect()

    // Check if user exists and belongs to the same organization
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        organizationId: session.user.organizationId
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deleting the organization owner
    if (existingUser.isOwner) {
      return NextResponse.json(
        { error: 'Cannot delete organization owner' },
        { status: 400 }
      )
    }

    // Prevent user from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete yourself' },
        { status: 400 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}