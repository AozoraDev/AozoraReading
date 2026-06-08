/** 去掉末尾斜杠，便于拼接 /models、/chat/completions */
export function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "")
}
