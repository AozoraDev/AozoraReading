import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"

// 把「标签 + 输入框 + 错误提示」包在一起
// 避免每个字段重复写同样的结构
export function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
