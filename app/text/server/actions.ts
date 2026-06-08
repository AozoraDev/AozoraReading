"use server"

import { getTranslations } from "next-intl/server"

import { llmSettingsFormSchema } from "@/app/llm-settings/schema"
import { normalizeBaseUrl } from "@/app/llm-settings/tool/normalize-base-url"
import {
  RECAP_SYSTEM_PROMPT,
  buildRecapUserPrompt,
} from "@/app/text/server/recap-prompt"
import {
  SUMMARY_SYSTEM_PROMPT,
  buildSummaryUserPrompt,
} from "@/app/text/server/summary-prompt"
import { getChapterByNovelAndNo } from "@/lib/supabase/books/getChapterContent"
import {
  getChapterPreReview,
  getChapterSummary,
  saveChapterPreReview,
  saveChapterSummary,
} from "@/lib/supabase/books/chapterRecap"
import { createClient } from "@/lib/supabase/server"

/** LLM 生成回顾的请求超时（毫秒） */
const RECAP_TIMEOUT_MS = 60_000

export type ChapterRecapInput = {
  novelId: string
  chapterNo: number
  settings: unknown
}

export type ChapterRecapResult =
  | { success: true; content: string }
  | { success: false; message: string }

type LlmSettings = { baseUrl: string; model: string; apiKey: string }

/** 调用 OpenAI 兼容接口，返回助手生成的文本（失败返回 null） */
async function requestChatCompletion(
  settings: LlmSettings,
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  const response = await fetch(
    `${normalizeBaseUrl(settings.baseUrl)}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${settings.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: AbortSignal.timeout(RECAP_TIMEOUT_MS),
    },
  )

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const content = data.choices?.[0]?.message?.content?.trim()

  return content && content.length > 0 ? content : null
}

/**
 * 获取当前章节的「前情回顾」：
 * 命中缓存直接返回；否则用上一章正文请求 LLM 小结，写回缓存后返回。
 */
export async function getChapterRecapAction(
  input: ChapterRecapInput,
): Promise<ChapterRecapResult> {
  const t = await getTranslations("reading")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: t("recapUnauthorized") }
  }

  const { novelId, chapterNo } = input

  if (!novelId || !Number.isInteger(chapterNo) || chapterNo <= 1) {
    return { success: false, message: t("recapUnavailable") }
  }

  const parsedSettings = llmSettingsFormSchema.safeParse(input.settings)
  if (!parsedSettings.success) {
    return { success: false, message: t("recapMissingSettings") }
  }

  try {
    const cached = await getChapterPreReview(novelId, chapterNo)
    if (cached) {
      return { success: true, content: cached }
    }

    // 获取上一章节内容
    const previousChapter = await getChapterByNovelAndNo(novelId, chapterNo - 1)
    if (!previousChapter) {
      return { success: false, message: t("recapUnavailable") }
    }

    const recap = await requestChatCompletion(
      parsedSettings.data,
      RECAP_SYSTEM_PROMPT,
      buildRecapUserPrompt(previousChapter.content),
    )
    if (!recap) {
      return { success: false, message: t("recapGenerateFailed") }
    }

    await saveChapterPreReview(novelId, chapterNo, recap)

    return { success: true, content: recap }
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return { success: false, message: t("recapTimeout") }
    }

    return { success: false, message: t("recapGenerateFailed") }
  }
}

/**
 * 获取当前章节的「本章总结」：
 * 命中缓存（summary_chapter 非空）直接返回；否则用本章正文请求 LLM 总结，写回缓存后返回。
 */
export async function getChapterSummaryAction(
  input: ChapterRecapInput,
): Promise<ChapterRecapResult> {
  const t = await getTranslations("reading")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: t("recapUnauthorized") }
  }

  const { novelId, chapterNo } = input

  if (!novelId || !Number.isInteger(chapterNo) || chapterNo < 1) {
    return { success: false, message: t("summaryUnavailable") }
  }

  const parsedSettings = llmSettingsFormSchema.safeParse(input.settings)
  if (!parsedSettings.success) {
    return { success: false, message: t("recapMissingSettings") }
  }

  try {
    const cached = await getChapterSummary(novelId, chapterNo)
    if (cached) {
      return { success: true, content: cached }
    }

    // 获取本章节内容
    const chapter = await getChapterByNovelAndNo(novelId, chapterNo)
    if (!chapter) {
      return { success: false, message: t("summaryUnavailable") }
    }

    const summary = await requestChatCompletion(
      parsedSettings.data,
      SUMMARY_SYSTEM_PROMPT,
      buildSummaryUserPrompt(chapter.content),
    )
    if (!summary) {
      return { success: false, message: t("summaryGenerateFailed") }
    }

    await saveChapterSummary(novelId, chapterNo, summary)

    return { success: true, content: summary }
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return { success: false, message: t("recapTimeout") }
    }

    return { success: false, message: t("summaryGenerateFailed") }
  }
}
