// 定义邮箱正则表达式

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 验证邮箱是否有效

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim())
}
