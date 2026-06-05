"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

import type { ActionToastState } from "@/lib/auth-form/types"

// 使用动作提示
export function useActionToast(
  state: ActionToastState | null,
  onSuccess?: () => void,
) {
  // 设置 onSuccess 引用
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])
  
  // 处理状态变化
  useEffect(() => {
    // 如果状态为空，返回
    if (!state) return
    // 如果状态成功，调用 onSuccess，显示成功提示
    if (state.success) {
      onSuccessRef.current?.()
      toast.success(state.message)
      return
    }
    toast.error(state.message)
  }, [state])
}
