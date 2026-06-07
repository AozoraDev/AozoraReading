import type { SplitChapter } from "@/app/dashboard/add-chapter/script/split-txt-chapters"
import { createClient } from "@/lib/supabase/server"

export type AddChaptersInput = {
  novelId: number
  chapters: SplitChapter[]
}

/** 批量写入章节记录 */
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

  const rows = chapters.map((chapter) => ({
    novel_id: novelId,
    title: chapter.title,
    content: chapter.content,
    ...(chapter.chapter_no !== undefined ? { chapter_no: chapter.chapter_no } : {}),
  }))

  const { error } = await supabase.from("chapters").insert(rows)

  if (error) {
    throw new Error(error.message)
  }

  return chapters.length
}
