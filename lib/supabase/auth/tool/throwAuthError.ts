// 抛出错误
export function throwAuthError(error: { message: string }): never {
  // 如果 error.message 包含 rate limit，抛出 EMAIL_RATE_LIMIT 错误
  if (error.message.toLowerCase().includes("rate limit")) {
    throw new Error("EMAIL_RATE_LIMIT")
  }
  // 否则抛出 error.message
  throw new Error(error.message)
}
