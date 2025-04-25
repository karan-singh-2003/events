// demo for postman use only 

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import redis from '../../../lib/redis'
import { cookies } from 'next/headers'

export async function POST(req) {
  try {
    const data = await req.json()
    const { universityId, password } = data

    if (!universityId || !password) {
      return NextResponse.json(
        { message: 'University ID and password are required.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { universityId },
    })

    if (!user || password !== user.password) {
      return NextResponse.json(
        { message: 'Invalid university ID or password' },
        { status: 401 }
      )
    }

    // Cache session in Redis
    await redis.set(`session:${user.universityId}`, JSON.stringify(user))

    // Set secure HTTP-only cookie
    
        await // ✅ **Set a cookie with only `universityId` (inside Server Action)**
        cookies().set('session_id', user.universityId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'strict',
        path: '/',
      })

    return NextResponse.json({ message: 'Login successful' }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
