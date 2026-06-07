import { Library } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { BookGrid } from "@/components/sections/bookGrid"
import { BookSearch } from "@/components/sections/bookSearch"
import { SectionHeader } from "@/components/sections/sectionHeader"
import { getPageMetadata } from "@/lib/metadata"
import { parsePageParam } from "@/lib/supabase/books/constants"
import { getBooksPageWithFavorites, getNovelsCount } from "@/lib/supabase/books/getBooksinfos"

type LibraryPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("library")
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { q = "", page: pageParam } = await searchParams
  const query = q.trim()
  const page = parsePageParam(pageParam)

  const [
    { books, totalCount, favoriteNovelIds },
    totalNovelCount,
    tBookCard,
    tLibrary,
    tNav,
  ] = await Promise.all([
    getBooksPageWithFavorites({ page, query }),
    getNovelsCount(),
    getTranslations("bookCard"),
    getTranslations("library"),
    getTranslations("nav"),
  ])

  return (
    <div className="py-8 sm:py-12">
      <SectionHeader
        icon={Library}
        title={tNav("library")}
        subtitle={tLibrary("subtitle")}
        badge={tLibrary("bookCount", { count: totalNovelCount })}
      />

      <BookSearch
        searchPlaceholder={tLibrary("searchPlaceholder")}
        searchButton={tLibrary("searchButton")}
        defaultQuery={query}
      />

      <BookGrid
        books={books}
        totalCount={totalCount}
        currentPage={page}
        basePath="/library"
        searchQuery={query}
        startReadingLabel={tBookCard("startReading")}
        favoriteLabel={tBookCard("favorite")}
        favoriteNovelIds={favoriteNovelIds}
      />
    </div>
  )
}
