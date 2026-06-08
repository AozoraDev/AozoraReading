"use server"

import { getTranslations } from "next-intl/server"

import { llmSettingsFormSchema } from "@/app/llm-settings/schema"
import { normalizeBaseUrl } from "@/app/llm-settings/tool/normalize-base-url"
import { getFirstZodIssueMessage } from "@/app/llm-settings/tool/validation"
import { createClient } from "@/lib/supabase/server"

/** 连接测试请求超时（毫秒） */
const TEST_TIMEOUT_MS = 10_000

export type TestConnectionActionResult = {
  success: boolean
  message: string
}

/** 带超时的 fetch，避免上游 API 无响应时长时间挂起 */
async function fetchWithTimeout(url: string, init: RequestInit) {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(TEST_TIMEOUT_MS),
  })
}

/** 优先用 GET /models 探测（OpenAI 标准路径） */
async function testModelsEndpoint(baseUrl: string, apiKey: string) {
  return fetchWithTimeout(`${normalizeBaseUrl(baseUrl)}/models`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
}

/** 部分兼容服务无 /models，改用最小 chat 请求验证 */
async function testChatCompletionsEndpoint(
  baseUrl: string,
  apiKey: string,
  model: string,
) {
  return fetchWithTimeout(`${normalizeBaseUrl(baseUrl)}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 1,
    }),
  })
}

/** 测试 OpenAI 兼容 API 是否可用；配置不落库，仅服务端代发请求 */
export async function testConnectionAction(
  input: unknown,
): Promise<TestConnectionActionResult> {
  const t = await getTranslations("llmSettings.form")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: t("unauthorized") }
  }

  const parsed = llmSettingsFormSchema.safeParse(input)
  if (!parsed.success) {
    const messageKey = getFirstZodIssueMessage(parsed.error)
    return {
      success: false,
      message: messageKey ? t(messageKey) : t("validationError"),
    }
  }

  const { baseUrl, model, apiKey } = parsed.data

  try {
    let response = await testModelsEndpoint(baseUrl, apiKey)

    // /models 不存在时回退到 chat completions
    if (response.status === 404 || response.status === 405) {
      response = await testChatCompletionsEndpoint(baseUrl, apiKey, model)
    }

    if (response.ok) {
      return { success: true, message: t("testSuccess") }
    }

    if (response.status === 401 || response.status === 403) {
      return { success: false, message: t("testUnauthorized") }
    }

    return { success: false, message: t("testFailed") }
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return { success: false, message: t("testTimeout") }
    }

    return { success: false, message: t("testNetworkError") }
  }
}
