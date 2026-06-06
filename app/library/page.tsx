import { Library } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { BookGrid } from "@/components/sections/bookGrid"
import { BookSearch } from "@/components/sections/bookSearch"
import { SectionHeader } from "@/components/sections/sectionHeader"
import {
  getBooksinfos,
  getNovelsCount,
  searchBooksinfos,
} from "@/lib/supabase/books/getBooksinfos"
import { getUserFavoriteNovelIds } from "@/lib/supabase/favorites/getUserFavoriteNovelIds"

type LibraryPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { q = "" } = await searchParams
  const query = q.trim()

  const [books, totalNovelCount, favoriteNovelIds, tBookCard, tLibrary, tNav] =
    await Promise.all([
      query ? searchBooksinfos(query) : getBooksinfos(),
      getNovelsCount(),
      getUserFavoriteNovelIds(),
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
        startReadingLabel={tBookCard("startReading")}
        favoriteLabel={tBookCard("favorite")}
        favoriteNovelIds={favoriteNovelIds}
      />
    </div>
  )
}
