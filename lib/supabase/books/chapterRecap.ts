import { createClient, createServiceRoleClient } from "@/lib/supabase/server"

/** 读取指定章节已缓存的「前情回顾」，无缓存返回 null */
export async function getChapterPreReview(
  novelId: string,
  chapterNo: number,
): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chapters")
    .select("pre_review")
    .eq("novel_id", novelId)
    .eq("chapter_no", chapterNo)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  const preReview = data?.pre_review
  return typeof preReview === "string" && preReview.trim().length > 0
    ? preReview
    : null
}

/** 写入指定章节的「前情回顾」缓存（service role 绕过 RLS，回顾为公共缓存） */
export async function saveChapterPreReview(
  novelId: string,
  chapterNo: number,
  preReview: string,
): Promise<void> {
  const { error } = await createServiceRoleClient()
    .from("chapters")
    .update({ pre_review: preReview })
    .eq("novel_id", novelId)
    .eq("chapter_no", chapterNo)

  if (error) {
    throw new Error(error.message)
  }
}

/** 读取指定章节已缓存的「本章总结」，无缓存返回 null */
export async function getChapterSummary(
  novelId: string,
  chapterNo: number,
): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chapters")
    .select("summary_chapter")
    .eq("novel_id", novelId)
    .eq("chapter_no", chapterNo)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  const summary = data?.summary_chapter
  return typeof summary === "string" && summary.trim().length > 0 ? summary : null
}

/** 写入指定章节的「本章总结」缓存（service role 绕过 RLS，总结为公共缓存） */
export async function saveChapterSummary(
  novelId: string,
  chapterNo: number,
  summary: string,
): Promise<void> {
  const { error } = await createServiceRoleClient()
    .from("chapters")
    .update({ summary_chapter: summary })
    .eq("novel_id", novelId)
    .eq("chapter_no", chapterNo)

  if (error) {
    throw new Error(error.message)
  }
}
