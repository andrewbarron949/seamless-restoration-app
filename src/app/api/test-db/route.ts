import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    
    const userCount = await prisma.user.count()
    const claimCount = await prisma.claim.count()
    const inspectionCount = await prisma.inspection.count()
    const photoCount = await prisma.photo.count()

    return NextResponse.json({
      message: 'Database connection successful',
      status: 'connected',
      counts: {
        users: userCount,
        claims: claimCount,
        inspections: inspectionCount,
        photos: photoCount
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      {
        message: 'Database connection failed',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}