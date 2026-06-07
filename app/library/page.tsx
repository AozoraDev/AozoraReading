import { Library } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { BookGrid } from "@/components/sections/bookGrid"
import { BookSearch } from "@/components/sections/bookSearch"
import { SectionHeader } from "@/components/sections/sectionHeader"
import { getPageMetadata } from "@/lib/metadata"
import { parsePageParam } from "@/lib/supabase/books/constants"
import { getBooksPage, getNovelsCount } from "@/lib/supabase/books/getBooksinfos"
import { getUserFavoriteNovelIds } from "@/lib/supabase/favorites/getUserFavoriteNovelIds"

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
    { books, totalCount },
    totalNovelCount,
    tBookCard,
    tLibrary,
    tNav,
  ] = await Promise.all([
    getBooksPage({ page, query }),
    getNovelsCount(),
    getTranslations("bookCard"),
    getTranslations("library"),
    getTranslations("nav"),
  ])

  const favoriteNovelIds = await getUserFavoriteNovelIds(
    books.map((book) => book.novel_id)
  )

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
