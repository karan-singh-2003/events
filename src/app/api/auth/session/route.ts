import { NextResponse } from 'next/server'
import redis from '../../../../lib/redis'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value // ✅ Now correctly getting universityId

    console.log('session_id in api/auth/session:', sessionId)

    if (!sessionId) {
      return NextResponse.json({ isLoggedIn: false })
    }

    // 🔍 Fetch session from Redis
    const sessionData = await redis.get(`session:${sessionId}`)
    console.log('sessionData in api/auth/session:', sessionData)

    if (!sessionData) {
      return NextResponse.json({ isLoggedIn: false })
    }

    // ✅ Parse session data
    const user = JSON.parse(sessionData)

    return NextResponse.json({
      isLoggedIn: true,
      name: user.name,
      user,
    })
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json({ isLoggedIn: false })
  }
}
