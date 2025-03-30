'use client'
import { useEffect, useState } from 'react'

export default function useSession() {
  const [session, setSession] = useState<{
    isLoggedIn: boolean
    email?: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setSession(data))
  }, [])

  return session
}
