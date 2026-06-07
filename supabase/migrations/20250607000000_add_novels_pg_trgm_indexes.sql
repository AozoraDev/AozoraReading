-- 为 novels.title / novels.author 的 ILIKE '%关键词%' 搜索加速
-- 应用层查询不变（lib/supabase/books/getBooksinfos.ts 中的 .ilike）

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_novels_title_trgm
  ON public.novels USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_novels_author_trgm
  ON public.novels USING gin (author gin_trgm_ops);
