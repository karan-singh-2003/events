import { NextResponse } from 'next/server'
import redis from '../../../../lib/redis'
import { cookies } from 'next/headers'
import { serialize } from 'cookie'

export async function POST() {
  try {
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get('session_id')?.value

    if (sessionId) {
      await redis.del(`session:${sessionId}`)
    }

    const cookie = serialize('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Immediately expires the cookie
    })

    return new Response('Logged out', {
      headers: { 'Set-Cookie': cookie },
    })
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
