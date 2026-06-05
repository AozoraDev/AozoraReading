import { getSupabaseUrl } from "@/lib/supabase/env"

const COVER_BUCKET = "cover"

// 获取封面路径
function getCoverPath(cover_url: string): string {
  // 去除引号
  const path = cover_url.trim().replace(/^["']|["']$/g, "")

  // 获取封面路径
  const marker = `/${COVER_BUCKET}/`
  // 获取封面路径索引
  const markerIdx = path.indexOf(marker)
  // 如果存在封面路径，则返回封面路径
  if (markerIdx !== -1) {
    return path.slice(markerIdx + marker.length)
  }

  // 如果封面路径以封面桶前缀开头，则返回封面路径
  const prefix = `${COVER_BUCKET}/`
  if (path.startsWith(prefix)) {
    return path.slice(prefix.length)
  }

  return path
}

// 获取封面URL
export function getCoverUrl(cover_url: string): string {
  const path = getCoverPath(cover_url)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")

  return `${getSupabaseUrl()}/storage/v1/object/public/${COVER_BUCKET}/${path}`
}
