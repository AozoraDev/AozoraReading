import type { AuthResponse } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import { throwAuthError } from "@/lib/supabase/auth/tool/throwAuthError"

export async function apiVerifyEmail(
  email: string,
  token: string,
): Promise<AuthResponse["data"]> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  })

  if (error) throwAuthError(error)

  return data
}
