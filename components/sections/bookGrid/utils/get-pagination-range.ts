export type PageToken = number | "ellipsis"

export function getPaginationRange(current: number, total: number): PageToken[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const range: number[] = []

  for (let page = 1; page <= total; page += 1) {
    if (
      page === 1 ||
      page === total ||
      (page >= current - 1 && page <= current + 1)
    ) {
      range.push(page)
    }
  }

  const rangeWithDots: PageToken[] = []
  let previous: number | undefined

  for (const page of range) {
    if (previous !== undefined) {
      if (page - previous === 2) {
        rangeWithDots.push(previous + 1)
      } else if (page - previous > 2) {
        rangeWithDots.push("ellipsis")
      }
    }

    rangeWithDots.push(page)
    previous = page
  }

  return rangeWithDots
}
