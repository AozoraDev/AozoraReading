import { getTranslations } from "next-intl/server"

import { llmSettingsFormSchema } from "@/app/llm-settings/schema"
import {
  extractDeltaFromLine,
  openChatCompletionStream,
} from "@/app/text/server/llm-stream"
import {
  RECAP_SYSTEM_PROMPT,
  buildRecapUserPrompt,
} from "@/app/text/server/recap-prompt"
import {
  SUMMARY_SYSTEM_PROMPT,
  buildSummaryUserPrompt,
} from "@/app/text/server/summary-prompt"
import {
  getChapterPreReview,
  getChapterSummary,
  saveChapterPreReview,
  saveChapterSummary,
} from "@/lib/supabase/books/chapterRecap"
import { getChapterByNovelAndNo } from "@/lib/supabase/books/getChapterContent"
import { createClient } from "@/lib/supabase/server"

/** 流式生成的整体超时（毫秒），超时会中断当前请求 */
const STREAM_TIMEOUT_MS = 120_000

type AiType = "recap" | "summary"

function jsonError(message: string, status: number) {
  return Response.json({ message }, { status })
}

/**
 * AI 回顾 / 总结的流式接口：
 * - 命中缓存：直接以纯文本一次性返回；
 * - 未命中：以 `stream: true` 调用 LLM，边收边转发给前端，结束后把完整文本写回缓存。
 */
export async function POST(request: Request) {
  const t = await getTranslations("reading")

  let body: {
    type?: unknown
    novelId?: unknown
    chapterNo?: unknown
    settings?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return jsonError(t("recapGenerateFailed"), 400)
  }

  const type: AiType | null =
    body.type === "summary" ? "summary" : body.type === "recap" ? "recap" : null
  const novelId = typeof body.novelId === "string" ? body.novelId : ""
  const chapterNo = typeof body.chapterNo === "number" ? body.chapterNo : NaN

  if (!type) {
    return jsonError(t("recapGenerateFailed"), 400)
  }

  const failMessage =
    type === "recap" ? t("recapGenerateFailed") : t("summaryGenerateFailed")
  const unavailableMessage =
    type === "recap" ? t("recapUnavailable") : t("summaryUnavailable")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return jsonError(t("recapUnauthorized"), 401)
  }

  // 回顾依赖上一章，故至少从第 2 章开始；总结只需当前章存在
  const minChapter = type === "recap" ? 2 : 1
  if (!novelId || !Number.isInteger(chapterNo) || chapterNo < minChapter) {
    return jsonError(unavailableMessage, 400)
  }

  const parsedSettings = llmSettingsFormSchema.safeParse(body.settings)
  if (!parsedSettings.success) {
    return jsonError(t("recapMissingSettings"), 400)
  }

  try {
    const cached =
      type === "recap"
        ? await getChapterPreReview(novelId, chapterNo)
        : await getChapterSummary(novelId, chapterNo)
    if (cached) {
      return new Response(cached, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Cache": "hit",
        },
      })
    }

    // 回顾取上一章正文，总结取本章正文
    const sourceChapterNo = type === "recap" ? chapterNo - 1 : chapterNo
    const sourceChapter = await getChapterByNovelAndNo(novelId, sourceChapterNo)
    if (!sourceChapter) {
      return jsonError(unavailableMessage, 404)
    }

    const systemPrompt =
      type === "recap" ? RECAP_SYSTEM_PROMPT : SUMMARY_SYSTEM_PROMPT
    const userPrompt =
      type === "recap"
        ? buildRecapUserPrompt(sourceChapter.content)
        : buildSummaryUserPrompt(sourceChapter.content)

    const upstream = await openChatCompletionStream(
      parsedSettings.data,
      systemPrompt,
      userPrompt,
      STREAM_TIMEOUT_MS,
    )
    if (!upstream.ok || !upstream.body) {
      return jsonError(failMessage, 502)
    }

    const reader = upstream.body.getReader()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()
    let buffer = ""
    let full = ""

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              break
            }

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            // 最后一段可能是被截断的半行，留到下次拼接
            buffer = lines.pop() ?? ""

            for (const line of lines) {
              const delta = extractDeltaFromLine(line)
              if (delta) {
                full += delta
                controller.enqueue(encoder.encode(delta))
              }
            }
          }

          // 处理残留在 buffer 中的最后一行
          const tailDelta = extractDeltaFromLine(buffer)
          if (tailDelta) {
            full += tailDelta
            controller.enqueue(encoder.encode(tailDelta))
          }

          // 流结束后把完整文本写回缓存（在关闭前完成，保证落库）
          if (full.trim().length > 0) {
            if (type === "recap") {
              await saveChapterPreReview(novelId, chapterNo, full)
            } else {
              await saveChapterSummary(novelId, chapterNo, full)
            }
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
      cancel() {
        void reader.cancel()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Cache": "miss",
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return jsonError(t("recapTimeout"), 504)
    }
    return jsonError(failMessage, 500)
  }
}
