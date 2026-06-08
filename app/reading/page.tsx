import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { ReadingChapterList } from "@/app/reading/components/reading-chapter-list"
import { ReadingNovelCard } from "@/app/reading/components/reading-novel-card"
import { getPageMetadata } from "@/lib/metadata"
import { parsePageParam } from "@/lib/supabase/books/constants"
import { getChaptersPage } from "@/lib/supabase/books/getChapters"
import { getNovelById } from "@/lib/supabase/books/getBooksinfos"

type ReadingPageProps = {
  searchParams: Promise<{ id?: string; page?: string }>
}

export async function generateMetadata({
  searchParams,
}: ReadingPageProps): Promise<Metadata> {
  const { id } = await searchParams

  if (id) {
    const novel = await getNovelById(id)

    if (novel) {
      return { title: novel.title }
    }
  }

  return getPageMetadata("reading")
}

export default async function ReadingPage({ searchParams }: ReadingPageProps) {
  const { id, page: pageParam } = await searchParams
  const page = parsePageParam(pageParam)

  const [t, novel, chaptersResult] = await Promise.all([
    getTranslations("reading"),
    id ? getNovelById(id) : Promise.resolve(null),
    id ? getChaptersPage({ novelId: id, page }) : Promise.resolve(null),
  ])

  const title = novel?.title ?? t("novelTitle")
  const author = novel?.author ?? t("authorPlaceholder")
  const summary = novel?.summary?.trim() || t("summaryPlaceholder")

  return (
    <div className="space-y-4 py-8 sm:space-y-6 sm:py-12">
      <ReadingNovelCard
        novel={novel}
        title={title}
        author={author}
        summary={summary}
        summaryLabel={t("summaryLabel")}
      />

      {id && chaptersResult ? (
        <ReadingChapterList
          chapters={chaptersResult.chapters}
          totalCount={chaptersResult.totalCount}
          currentPage={page}
          novelId={id}
        />
      ) : null}
    </div>
  )
}
