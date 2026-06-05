import { createClient } from "@/lib/supabase/server"
import { throwAuthError } from "@/lib/supabase/auth/tool/throwAuthError"

export async function apiResend(email: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  })

  if (error) throwAuthError(error)
}
