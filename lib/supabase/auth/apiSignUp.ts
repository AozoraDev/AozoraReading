import type { AuthResponse } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import { throwAuthError } from "@/lib/supabase/auth/tool/throwAuthError"

export async function apiSignUp(
  email: string,
  password: string,
): Promise<AuthResponse["data"]> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throwAuthError(error)

  if (data.user?.identities?.length === 0) {
    throw new Error("EMAIL_ALREADY_REGISTERED")
  }

  return data
}
