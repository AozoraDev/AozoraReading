"use client"

import { useEffect, useState } from "react"

import { createClient } from "@/lib/supabase/client"

export function useAuthUser() {
  const [email, setEmail] = useState<string | null>(null)
  const [uid, setUid] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user.email ?? null)
      setUid(session?.user.id ?? null)
      setReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null)
      setUid(session?.user.id ?? null)
      setReady(true)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    email,
    uid,
    isLoggedIn: uid !== null,
    ready,
  }
}
