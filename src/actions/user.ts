'use server'

import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

import redis from '../lib/redis'

import { cookies } from 'next/headers'

export const logInUser = async (data: {
  universityId: string
  password: string
}) => {
  try {
    console.log('Logging in user with data:', data)

    if (!data.universityId) {
      return {
        status: 400,
        data: 'Invalid request. University ID is required.',
      }
    }

    // 🔍 **Fetch User from Database**
    const user = await prisma.user.findUnique({
      where: { universityId: data.universityId },
    })

    if (!user) {
      return { status: 401, data: 'Invalid university ID or password' }
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      return { status: 401, data: 'Invalid university ID or password' }
    }

    // ✅ **Cache full session in Redis**
    await redis.set(`session:${user.universityId}`, JSON.stringify(user))

    // ✅ **Set a cookie with only `universityId` (inside Server Action)**
    ;(
      await // ✅ **Set a cookie with only `universityId` (inside Server Action)**
      cookies()
    ).set('session_id', user.universityId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
      path: '/',
    })

    console.log(
      '✅ Session stored, cookie set:',
      `session_id=${user.universityId}`
    )

    return { status: 200, data: 'Login successful' }
  } catch (error) {
    console.error('Error logging in user:', error)
    return { status: 500, data: 'Internal server error' }
  }
}

export const checkIsAdmin = async (universityId: string) => {
  console.log('executing checkIsAdmin')
  console.log('Checking admin status for universityId:', universityId)
  if (!universityId) {
    throw new Error('Missing universityId')
  }

  try {
    const user = await prisma.user.findUnique({
      where: { universityId },
      select: { isAdmin: true },
    })

    return { isAdmin: user?.isAdmin ?? false }
  } catch (error) {
    console.error('Error checking admin status:', error)
    throw new Error('Internal server error')
  }
}
