/**
 * TXT 章节切分工具
 *
 * 将整本小说的 .txt 文本按章节标题拆分为结构化数据，便于后续写入 `chapters` 表。
 * 典型用法：上传 txt → 自动识别 UTF-8 / GBK 编码 → 调用 splitTxtContent → 得到 JSON → 批量 insert。
 *
 * @example
 * ```ts
 * import { splitTxtContent } from "@/app/dashboard/add-chapter/script/split-txt-chapters"
 *
 * const { chapters } = splitTxtContent(rawText)
 * // [{ "title": "第一章 开端", "chapter_no": 1, "content": "..." }, ...]
 * ```
 */

/** 单章数据，便于写入 chapters 表 */
export type SplitChapter = {
  /** 章节标题，如「第一章 开端」 */
  title: string
  /** 章节序号（仅「第 N 章 / Chapter N」等可解析标题时有值） */
  chapter_no?: number
  /** 章节正文 */
  content: string
}

/** 支持的 txt 源文件编码（`gbk` 解码时使用 GB18030，兼容 GBK） */
export type TxtEncoding = "auto" | "utf-8" | "gbk"

/** 切分结果 */
export type SplitTxtChaptersResult = {
  chapters: SplitChapter[]
  /** 是否因未识别到章节标题而回退为「整文件一章」 */
  fallbackUsed: boolean
}

export type SplitTxtChaptersOptions = {
  /**
   * 自定义章节标题行正则（需匹配整行）。
   * 默认支持：第 N 章/节/回、Chapter N、序章/楔子/番外等常见格式。
   */
  chapterTitlePattern?: RegExp
  /** 是否去除每章正文首尾空白，默认 true */
  trimContent?: boolean
  /**
   * 全文未匹配到任何章节标题时的策略：
   * - `single`：整份 txt 作为一章，标题为「正文」
   * - `throw`：抛出错误，提示需检查文件格式
   */
  onNoMatch?: "single" | "throw"
  /**
   * 源文件文本编码。国内常见 txt 为 UTF-8 或 GBK。
   * - `auto`（默认）：根据 BOM 与内容启发式自动选择
   * - `utf-8` / `gbk`：强制指定
   */
  encoding?: TxtEncoding
}

/**
 * 默认章节标题行匹配规则（行首可有空格，整行视为标题）
 *
 * 覆盖示例：
 * - 第一章 / 第1章 / 第001章 标题
 * - 第一章山边小村（章号与标题连写、无空格）
 * - Chapter 1 / CHAPTER 1 Title
 * - 【第一章】标题
 * - 序章、楔子、番外一、后记 等
 */
const DEFAULT_CHAPTER_TITLE_PATTERN =
  /^\s*(?:第[〇零一二三四五六七八九十百千万0-9]+[章节回](?:[：:\s][^\n]{0,80}|[^\n]{0,80})?|Chapter\s+\d+(?:[：:\s][^\n]{0,80})?|CHAPTER\s+\d+(?:[：:\s][^\n]{0,80})?|[【\[]第[〇零一二三四五六七八九十百千万0-9]+[章节回][】\]](?:[^\n]{0,80})?|(?:序章|楔子|前言|引子|尾声|后记|番外[一二三四五六七八九十0-9]*)(?:[：:\s][^\n]{0,80})?)\s*$/u

const FALLBACK_CHAPTER_TITLE = "正文"

/** GBK 在 TextDecoder 中通常以 GB18030 标签解码（超集，兼容 GBK 文件） */
const GBK_DECODER_LABEL = "gb18030"

const UTF8_BOM = [0xef, 0xbb, 0xbf] as const
const UTF16LE_BOM = [0xff, 0xfe] as const
const UTF16BE_BOM = [0xfe, 0xff] as const

const ARABIC_CHAPTER_NO_IN_TITLE = /第\s*(\d+)\s*[章节回]/u
const CHINESE_CHAPTER_NO_IN_TITLE = /第\s*([〇零一二三四五六七八九十百千万]+)\s*[章节回]/u
const ENGLISH_CHAPTER_NO_IN_TITLE = /^Chapter\s+(\d+)/iu

const CHINESE_DIGIT: Record<string, number> = {
  〇: 0,
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
}

function toUint8Array(input: ArrayBuffer | Uint8Array): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input)
}

function hasBom(bytes: Uint8Array, bom: readonly number[]): boolean {
  if (bytes.length < bom.length) return false
  return bom.every((value, index) => bytes[index] === value)
}

/** 使用指定编码标签解码；环境不支持该编码时返回 undefined */
function decodeBytesWithLabel(bytes: Uint8Array, label: string): string | undefined {
  try {
    return new TextDecoder(label).decode(bytes)
  } catch {
    return undefined
  }
}

/**
 * 对解码后的文本打分，用于 `encoding: auto` 时在 UTF-8 与 GBK 之间择优。
 * 分数越高越像正确的中文小说 txt（常见章节标题、汉字占比、少乱码）。
 */
function scoreDecodedTxt(text: string, chapterTitlePattern: RegExp): number {
  let score = 0
  score -= (text.match(/\uFFFD/g)?.length ?? 0) * 100

  const sample = text.slice(0, 65536)
  score += Math.min(sample.match(/[\u3400-\u9fff]/g)?.length ?? 0, 800)

  for (const line of sample.split("\n").slice(0, 500)) {
    if (chapterTitlePattern.test(line)) {
      score += 120
    }
  }

  return score
}

type ResolvedTxtEncoding = "utf-8" | "gbk"

function resolveForcedEncoding(encoding: Exclude<TxtEncoding, "auto">): ResolvedTxtEncoding {
  return encoding
}

/**
 * 将 txt 二进制内容解码为字符串。
 * 支持 UTF-8 BOM、UTF-16 LE/BE BOM，以及 UTF-8 / GBK(GB18030) 自动识别。
 */
export function decodeTxtBytes(
  input: ArrayBuffer | Uint8Array,
  options: Pick<SplitTxtChaptersOptions, "encoding" | "chapterTitlePattern"> = {},
): string {
  const { encoding = "auto", chapterTitlePattern = DEFAULT_CHAPTER_TITLE_PATTERN } = options
  const bytes = toUint8Array(input)

  if (hasBom(bytes, UTF8_BOM)) {
    return decodeBytesWithLabel(bytes.subarray(UTF8_BOM.length), "utf-8") ?? ""
  }

  if (hasBom(bytes, UTF16LE_BOM)) {
    return decodeBytesWithLabel(bytes.subarray(UTF16LE_BOM.length), "utf-16le") ?? ""
  }

  if (hasBom(bytes, UTF16BE_BOM)) {
    return decodeBytesWithLabel(bytes.subarray(UTF16BE_BOM.length), "utf-16be") ?? ""
  }

  if (encoding !== "auto") {
    const label = resolveForcedEncoding(encoding) === "gbk" ? GBK_DECODER_LABEL : "utf-8"
    return decodeBytesWithLabel(bytes, label) ?? decodeBytesWithLabel(bytes, "utf-8") ?? ""
  }

  const utf8Text = decodeBytesWithLabel(bytes, "utf-8")
  const gbkText = decodeBytesWithLabel(bytes, GBK_DECODER_LABEL)

  if (!gbkText) {
    return utf8Text ?? ""
  }

  if (!utf8Text) {
    return gbkText
  }

  const utf8Score = scoreDecodedTxt(utf8Text, chapterTitlePattern)
  const gbkScore = scoreDecodedTxt(gbkText, chapterTitlePattern)

  return gbkScore > utf8Score ? gbkText : utf8Text
}

/** 去除 UTF-8 BOM，统一换行符 */
function normalizeRawText(rawText: string): string {
  return rawText.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")
}

/** 判断某一行是否为章节标题行 */
function isChapterTitleLine(line: string, pattern: RegExp): boolean {
  return pattern.test(line)
}

/** 将中文数字（如「一百二十三」）转为阿拉伯数字，无法解析时返回 undefined */
function parseChineseNumeral(raw: string): number | undefined {
  if (!raw) return undefined

  let total = 0
  let section = 0
  let digit = 0

  for (const char of raw) {
    if (char in CHINESE_DIGIT) {
      digit = CHINESE_DIGIT[char]!
      continue
    }

    if (char === "十") {
      section += (digit || 1) * 10
      digit = 0
      continue
    }

    if (char === "百") {
      section += (digit || 1) * 100
      digit = 0
      continue
    }

    if (char === "千") {
      section += (digit || 1) * 1000
      digit = 0
      continue
    }

    if (char === "万") {
      section = (section + digit) * 10000
      total += section
      section = 0
      digit = 0
      continue
    }

    return undefined
  }

  const value = total + section + digit
  return value > 0 ? value : undefined
}

/**
 * 从章节标题解析序号。
 * 仅「第 N 章/节/回」「Chapter N」等带数字的标题有值；前言、序章、番外等返回 undefined。
 */
function extractChapterNoFromTitle(title: string): number | undefined {
  const arabicMatch = title.match(ARABIC_CHAPTER_NO_IN_TITLE)
  if (arabicMatch) {
    return Number(arabicMatch[1])
  }

  const englishMatch = title.match(ENGLISH_CHAPTER_NO_IN_TITLE)
  if (englishMatch) {
    return Number(englishMatch[1])
  }

  const chineseMatch = title.match(CHINESE_CHAPTER_NO_IN_TITLE)
  if (chineseMatch) {
    return parseChineseNumeral(chineseMatch[1]!)
  }

  return undefined
}

function toSplitChapter(
  title: string,
  contentLines: string[],
  trimContent: boolean,
): SplitChapter {
  const joined = contentLines.join("\n")
  const chapterNo = extractChapterNoFromTitle(title)

  return {
    title,
    content: trimContent ? joined.trim() : joined,
    ...(chapterNo !== undefined ? { chapter_no: chapterNo } : {}),
  }
}

/**
 * 按章节标题行切分纯文本
 *
 * 算法：逐行扫描，遇到标题行则开启新章节；标题行之间的各行累积为该章 content。
 */
export function splitTxtContent(
  rawText: string,
  options: SplitTxtChaptersOptions = {},
): SplitTxtChaptersResult {
  const {
    chapterTitlePattern = DEFAULT_CHAPTER_TITLE_PATTERN,
    trimContent = true,
    onNoMatch = "single",
  } = options

  const text = normalizeRawText(rawText)
  const lines = text.split("\n")

  type DraftChapter = { title: string; contentLines: string[] }
  const drafts: DraftChapter[] = []
  let current: DraftChapter | null = null
  /** 首个章节标题出现前的行（简介、公告等） */
  let preambleLines: string[] = []

  for (const line of lines) {
    if (isChapterTitleLine(line, chapterTitlePattern)) {
      // 标题前的非空内容合并为「前言」一章
      if (!current && preambleLines.some((l) => l.trim().length > 0)) {
        drafts.push({ title: "前言", contentLines: preambleLines })
        preambleLines = []
      }

      current = { title: line.trim(), contentLines: [] }
      drafts.push(current)
      continue
    }

    if (current) {
      current.contentLines.push(line)
    } else {
      preambleLines.push(line)
    }
  }

  // 没有任何章节标题命中
  if (drafts.length === 0) {
    if (onNoMatch === "throw") {
      throw new Error("未能识别章节标题，请检查 txt 格式或传入自定义 chapterTitlePattern")
    }

    const content = trimContent ? text.trim() : text
    return {
      chapters: [{ title: FALLBACK_CHAPTER_TITLE, content }],
      fallbackUsed: true,
    }
  }

  const chapters: SplitChapter[] = drafts.map(({ title, contentLines }) =>
    toSplitChapter(title, contentLines, trimContent),
  )

  return {
    chapters,
    fallbackUsed: false,
  }
}
