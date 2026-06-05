"use client"

import { useCallback, useEffect, useState } from "react"

import { RESEND_COOLDOWN_SECONDS } from "@/lib/auth-form/types"

// 使用冷却时间
export function useCooldown() {
  const [seconds, setSeconds] = useState(0)

  // 使用 effect 设置计时器
  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [seconds])

  const start = useCallback(() => setSeconds(RESEND_COOLDOWN_SECONDS), [])

  return { seconds, isActive: seconds > 0, start }
}
