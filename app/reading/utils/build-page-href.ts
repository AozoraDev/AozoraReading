export function buildReadingPageHref(novelId: string, page: number): string {
  const params = new URLSearchParams()
  params.set("id", novelId)

  if (page > 1) {
    params.set("page", String(page))
  }

  return `/reading?${params.toString()}`
}
