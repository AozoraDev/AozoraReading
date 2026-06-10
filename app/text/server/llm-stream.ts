import { normalizeBaseUrl } from "@/app/llm-settings/tool/normalize-base-url"

export type LlmSettings = { baseUrl: string; model: string; apiKey: string }

/**
 * 以流式（SSE）方式打开 OpenAI 兼容的对话补全请求。
 * 与非流式的区别仅在于 body 里的 `stream: true`，返回值是带可读流 body 的 Response。
 */
export async function openChatCompletionStream(
  settings: LlmSettings,
  systemPrompt: string,
  userPrompt: string,
  timeoutMs: number,
): Promise<Response> {
  return fetch(`${normalizeBaseUrl(settings.baseUrl)}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: settings.model,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(timeoutMs),
  })
}

/**
 * 从一行 SSE 文本中解析出本次新增的内容片段（delta），无内容返回 null。
 * 形如：`data: {"choices":[{"delta":{"content":"今"}}]}`，结束标记 `data: [DONE]`。
 */
export function extractDeltaFromLine(line: string): string | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith("data:")) {
    return null
  }

  const payload = trimmed.slice(5).trim()
  if (payload === "" || payload === "[DONE]") {
    return null
  }

  try {
    const json = JSON.parse(payload) as {
      choices?: { delta?: { content?: string } }[]
    }
    const delta = json.choices?.[0]?.delta?.content
    return typeof delta === "string" && delta.length > 0 ? delta : null
  } catch {
    return null
  }
}
