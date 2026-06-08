export function buildTextPageHref(novelId: string, chapterNo: number): string {
  const params = new URLSearchParams()
  params.set("novel_id", novelId)
  params.set("chapter_no", String(chapterNo))

  return `/text?${params.toString()}`
}
