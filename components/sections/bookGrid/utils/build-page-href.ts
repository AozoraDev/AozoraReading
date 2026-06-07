export function buildBookGridPageHref(
  pathname: string,
  page: number,
  searchQuery?: string,
): string {
  const params = new URLSearchParams()

  if (searchQuery) {
    params.set("q", searchQuery)
  }

  if (page > 1) {
    params.set("page", String(page))
  }

  const queryString = params.toString()

  return queryString ? `${pathname}?${queryString}` : pathname
}
