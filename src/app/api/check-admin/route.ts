import { NextResponse } from 'next/server'
import { checkIsAdmin } from '../../../actions/user'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const universityId = url.searchParams.get('id')

  if (!universityId) {
    return NextResponse.json({ error: 'Missing universityId' }, { status: 400 })
  }

  try {
    const result = await checkIsAdmin(universityId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
