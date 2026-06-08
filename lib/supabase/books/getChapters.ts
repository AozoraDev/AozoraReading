import { CHAPTERS_PAGE_SIZE } from "@/lib/supabase/books/constants"
import { createClient } from "@/lib/supabase/server"

export type ChapterInfo = {
  id: string
  chapter_no: number
  title: string
}

export type ChaptersPageResult = {
  chapters: ChapterInfo[]
  totalCount: number
}

export type GetChaptersPageOptions = {
  novelId: string
  page: number
  pageSize?: number
}

function mapChapterRows(
  rows: {
    id: string | number
    chapter_no: number
    title: string
  }[]
): ChapterInfo[] {
  return rows.map(({ id, chapter_no, title }) => ({
    id: String(id),
    chapter_no,
    title,
  }))
}

export async function getChaptersPage({
  novelId,
  page,
  pageSize = CHAPTERS_PAGE_SIZE,
}: GetChaptersPageOptions): Promise<ChaptersPageResult> {
  const safePage = Math.max(1, page)
  const from = (safePage - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  const { data, count, error } = await supabase
    .from("chapters")
    .select("id, chapter_no, title", { count: "exact" })
    .eq("novel_id", novelId)
    .not("chapter_no", "is", null)
    .order("chapter_no", { ascending: true })
    .range(from, to)

  if (error) {
    throw new Error(error.message)
  }

  return {
    chapters: mapChapterRows(data ?? []),
    totalCount: count ?? 0,
  }
}
