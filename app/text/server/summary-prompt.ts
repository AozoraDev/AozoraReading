/** 送入 LLM 的本章正文最大字符数，超出截断以控制 token 消耗 */
export const SUMMARY_SOURCE_MAX_CHARS = 8_000

/** 生成「本章总结」的系统提示词 */
export const SUMMARY_SYSTEM_PROMPT =
  "你是一位中文小说阅读助理，擅长用精炼的语言为读者梳理剧情。"

/** 基于本章正文构造「本章总结」用户提示词 */
export function buildSummaryUserPrompt(chapterContent: string): string {
  const source = chapterContent.slice(0, SUMMARY_SOURCE_MAX_CHARS)

  return [
    "请阅读下面这一章的正文，为读者写一段「本章总结」，帮助读者快速把握本章的核心内容。",
    "要求：",
    "- 用第三人称、客观语气叙述",
    "- 概括本章发生的关键事件、人物动向与重要转折",
    "- 控制在 150-250 字之间",
    "- 不要剧透后续、不要加入评论或额外说明",
    "- 直接输出总结正文，不要加标题或前缀",
    "",
    "本章正文：",
    '"""',
    source,
    '"""',
  ].join("\n")
}
