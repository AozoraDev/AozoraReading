export type {
  CooldownState,
  SendEmailButtonState,
  TranslateFn,
} from "@/lib/auth-form/types"
export { RESEND_COOLDOWN_SECONDS } from "@/lib/auth-form/types"

export type ForgetIntent = "send" | "resend" | "verify"

export type ForgetActionState = {
  intent: ForgetIntent
  success: boolean
  message: string
}

export const INITIAL_FORGET_ACTION_STATE: ForgetActionState | null = null
