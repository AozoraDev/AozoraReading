import { Library } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { BookCard } from "@/components/sections/bookCard"
import { BookSearch } from "@/components/sections/bookSearch"
import { SectionHeader } from "@/components/sections/sectionHeader"
import { getBooksinfos } from "@/lib/supabase/books/getBooksinfos"
import { getUserFavoriteNovelIds } from "@/lib/supabase/favorites/getUserFavoriteNovelIds"

export default async function LibraryPage() {
  const [books, favoriteNovelIds, tBookCard, tLibrary, tNav] = await Promise.all([
    getBooksinfos(),
    getUserFavoriteNovelIds(),
    getTranslations("bookCard"),
    getTranslations("library"),
    getTranslations("nav"),
  ])

  const favoriteSet = new Set(favoriteNovelIds)

  return (
    <div className="py-8 sm:py-12">
      <SectionHeader
        icon={Library}
        title={tNav("library")}
        subtitle={tLibrary("subtitle")}
        badge={tLibrary("bookCount", { count: books.length })}
      />

      <BookSearch
        searchPlaceholder={tLibrary("searchPlaceholder")}
        searchButton={tLibrary("searchButton")}
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <li key={book.novel_id}>
            <BookCard
              {...book}
              isFavorited={favoriteSet.has(book.novel_id)}
              startReadingLabel={tBookCard("startReading")}
              favoriteLabel={tBookCard("favorite")}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
