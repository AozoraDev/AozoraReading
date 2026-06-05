export type {
  CooldownState,
  SendEmailButtonState,
  TranslateFn,
} from "@/lib/auth-form/types"
export { RESEND_COOLDOWN_SECONDS } from "@/lib/auth-form/types"

export type SignUpIntent = "send" | "resend" | "verify"

export type AuthActionState = {
  intent: SignUpIntent
  success: boolean
  message: string
}

export const INITIAL_ACTION_STATE: AuthActionState | null = null
