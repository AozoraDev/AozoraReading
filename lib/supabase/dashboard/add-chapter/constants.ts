// 章节 txt 临时上传桶：浏览器直传此私有桶，绕过 Vercel 4.5MB 函数请求体限制
export const CHAPTER_UPLOAD_BUCKET = "chapter-uploads"

// 章节 txt 最大体积，需与 Supabase 桶 fileSizeLimit 保持一致
export const MAX_CHAPTER_FILE_SIZE = 50 * 1024 * 1024
