import { createClient } from "@/lib/supabase/server"

export type ChapterContent = {
  id: string
  chapter_no: number
  title: string
  content: string
}

export type ChapterNavigation = {
  prevChapterNo: number | null
  nextChapterNo: number | null
  totalChapters: number
}

export async function getChapterNavigation(
  novelId: string,
  chapterNo: number,
): Promise<ChapterNavigation> {
  const supabase = await createClient()

  const [{ count, error: countError }, { data: prev, error: prevError }, { data: next, error: nextError }] =
    await Promise.all([
      supabase
        .from("chapters")
        .select("id", { count: "exact", head: true })
        .eq("novel_id", novelId)
        .not("chapter_no", "is", null),
      supabase
        .from("chapters")
        .select("chapter_no")
        .eq("novel_id", novelId)
        .lt("chapter_no", chapterNo)
        .not("chapter_no", "is", null)
        .order("chapter_no", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("chapters")
        .select("chapter_no")
        .eq("novel_id", novelId)
        .gt("chapter_no", chapterNo)
        .not("chapter_no", "is", null)
        .order("chapter_no", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ])

  if (countError) {
    throw new Error(countError.message)
  }

  if (prevError) {
    throw new Error(prevError.message)
  }

  if (nextError) {
    throw new Error(nextError.message)
  }

  return {
    prevChapterNo: prev?.chapter_no ?? null,
    nextChapterNo: next?.chapter_no ?? null,
    totalChapters: count ?? 0,
  }
}

export async function getChapterByNovelAndNo(
  novelId: string,
  chapterNo: number,
): Promise<ChapterContent | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chapters")
    .select("id, chapter_no, title, content")
    .eq("novel_id", novelId)
    .eq("chapter_no", chapterNo)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  return {
    id: String(data.id),
    chapter_no: data.chapter_no,
    title: data.title,
    content: data.content,
  }
}
