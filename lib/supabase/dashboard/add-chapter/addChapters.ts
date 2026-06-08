import type { SplitChapter } from "@/app/dashboard/add-chapter/script/split-txt-chapters"
import { createClient } from "@/lib/supabase/server"

export type AddChaptersInput = {
  novelId: number
  chapters: SplitChapter[]
}

type ChapterRow = {
  novel_id: number
  title: string
  content: string
  chapter_no?: number
}

/** 单批最多写入的章节数，避免单次请求行数过多 */
const MAX_ROWS_PER_BATCH = 200

/**
 * 单批正文累计字符上限。
 * 长篇小说（如《剑来》1200+ 章、千万字）一次性 insert 会让请求体高达数十 MB，
 * 触发 PostgREST 请求体大小限制 / 语句超时而失败，故按累计字符再切块。
 */
const MAX_CHARS_PER_BATCH = 1_000_000

/** 按行数与累计字符双重上限切分待写入的章节行 */
function chunkChapterRows(rows: ChapterRow[]): ChapterRow[][] {
  const batches: ChapterRow[][] = []
  let current: ChapterRow[] = []
  let currentChars = 0

  for (const row of rows) {
    const rowChars = row.content.length + row.title.length
    const wouldExceed =
      current.length >= MAX_ROWS_PER_BATCH || currentChars + rowChars > MAX_CHARS_PER_BATCH

    if (current.length > 0 && wouldExceed) {
      batches.push(current)
      current = []
      currentChars = 0
    }

    current.push(row)
    currentChars += rowChars
  }

  if (current.length > 0) {
    batches.push(current)
  }

  return batches
}

/** 批量写入章节记录（自动分批，支持千万字长篇） */
export async function addChapters({ novelId, chapters }: AddChaptersInput): Promise<number> {
  const supabase = await createClient()

  const { data: novel, error: novelError } = await supabase
    .from("novels")
    .select("id")
    .eq("id", novelId)
    .maybeSingle()

  if (novelError) {
    throw new Error(novelError.message)
  }

  if (!novel) {
    throw new Error("novelNotFound")
  }

  const rows: ChapterRow[] = chapters.map((chapter) => ({
    novel_id: novelId,
    title: chapter.title,
    content: chapter.content,
    ...(chapter.chapter_no !== undefined ? { chapter_no: chapter.chapter_no } : {}),
  }))

  for (const batch of chunkChapterRows(rows)) {
    const { error } = await supabase.from("chapters").insert(batch)

    if (error) {
      throw new Error(error.message)
    }
  }

  return chapters.length
}
