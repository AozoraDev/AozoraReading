"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { AiResultCard } from "@/app/text/components/ai-result-card"
import { Button } from "@/components/ui/button"
import { loadLlmSettingsFromSession } from "@/lib/llm-settings/session-storage"
import { useAuthUser } from "@/lib/supabase/auth/hook/use-auth-user"

type TextAiActionsProps = {
  novelId?: string
  chapterNo?: number
}

/** 路由变化时通过 key 重置内部状态，隐藏 AI 结果卡片 */
export function TextAiActions(props: TextAiActionsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname}?${searchParams.toString()}`

  return <TextAiActionsInner key={routeKey} {...props} />
}

type AiStreamRequest = {
  type: "recap" | "summary"
  novelId: string
  chapterNo: number
  settings: unknown
}

/** 管理单个 AI 结果（回顾 / 总结）的流式加载态与内容，并作废过期请求 */
function useAiResult() {
  const [content, setContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const requestIdRef = useRef(0)

  // 组件卸载（路由变化导致 remount）时作废进行中的请求
  useEffect(() => {
    return () => {
      requestIdRef.current += 1
    }
  }, [])

  async function run(
    body: AiStreamRequest,
    onError: (message?: string) => void,
  ) {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    setContent(null)
    try {
      const response = await fetch("/api/text/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (requestId !== requestIdRef.current) {
        return
      }

      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as {
          message?: string
        } | null
        if (requestId === requestIdRef.current) {
          onError(data?.message)
        }
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      // 边收边追加：每读到一段就拼接并刷新画面
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        if (requestId !== requestIdRef.current) {
          void reader.cancel()
          return
        }
        accumulated += decoder.decode(value, { stream: true })
        setContent(accumulated)
      }

      if (
        requestId === requestIdRef.current &&
        accumulated.trim().length === 0
      ) {
        onError()
      }
    } catch {
      if (requestId === requestIdRef.current) {
        onError()
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }

  return { content, isLoading, run }
}

function TextAiActionsInner({ novelId, chapterNo }: TextAiActionsProps) {
  const t = useTranslations("reading")
  const { isLoggedIn, ready } = useAuthUser()
  const recap = useAiResult()
  const summary = useAiResult()

  const hasChapter = Boolean(novelId) && typeof chapterNo === "number"
  // 第一章无前文可回顾；总结只需当前章节存在
  const canRecap = hasChapter && (chapterNo as number) > 1
  const canSummary = hasChapter && (chapterNo as number) >= 1

  function handleRecap() {
    if (!canRecap || !novelId || typeof chapterNo !== "number") {
      return
    }

    const settings = loadLlmSettingsFromSession()
    if (!settings) {
      toast.error(t("recapMissingSettings"))
      return
    }

    recap.run(
      { type: "recap", novelId, chapterNo, settings },
      (message) => toast.error(message ?? t("recapGenerateFailed")),
    )
  }

  function handleSummary() {
    if (!canSummary || !novelId || typeof chapterNo !== "number") {
      return
    }

    const settings = loadLlmSettingsFromSession()
    if (!settings) {
      toast.error(t("recapMissingSettings"))
      return
    }

    summary.run(
      { type: "summary", novelId, chapterNo, settings },
      (message) => toast.error(message ?? t("summaryGenerateFailed")),
    )
  }

  if (!ready || !isLoggedIn) {
    return null
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          variant="brand"
          className="rounded-lg"
          disabled={!canRecap || recap.isLoading}
          onClick={handleRecap}
        >
          {t("aiRecap")}
        </Button>
        <Button
          type="button"
          variant="brand"
          className="rounded-lg"
          disabled={!canSummary || summary.isLoading}
          onClick={handleSummary}
        >
          {t("aiChapterSummary")}
        </Button>
      </div>

      {recap.isLoading || recap.content ? (
        <AiResultCard
          title={t("aiRecap")}
          content={recap.content ?? undefined}
          isLoading={recap.isLoading}
          loadingText={t("recapLoading")}
        />
      ) : null}

      {summary.isLoading || summary.content ? (
        <AiResultCard
          title={t("aiChapterSummary")}
          content={summary.content ?? undefined}
          isLoading={summary.isLoading}
          loadingText={t("summaryLoading")}
        />
      ) : null}
    </>
  )
}
