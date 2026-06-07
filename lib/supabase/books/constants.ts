// 每页显示的小说数量
export const BOOKS_PAGE_SIZE = 6

// 把 URL 里的 page 参数转成合法页码, 无效或缺失时默认第 1 页
export function parsePageParam(value?: string): number {
  const parsed = Number.parseInt(value ?? "1", 10)

  if (Number.isNaN(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}
