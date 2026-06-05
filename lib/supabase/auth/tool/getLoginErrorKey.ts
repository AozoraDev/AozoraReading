export type LoginErrorKey =
  | "emailRateLimit"
  | "invalidCredentials"
  | "emailNotConfirmed"
  | "failure"

// 获取登录错误键 
export function getLoginErrorKey(message: string): LoginErrorKey {
  const lower = message.toLowerCase()
  // 如果 message 包含 rate limit，返回 emailRateLimit
  if (lower.includes("rate limit")) return "emailRateLimit"
  // 如果 message 包含 invalid login credentials，返回 invalidCredentials
  if (lower.includes("invalid login credentials")) return "invalidCredentials"
  // 如果 message 包含 email not confirmed，返回 emailNotConfirmed
  if (lower.includes("email not confirmed")) return "emailNotConfirmed"
  
  return "failure"
}
