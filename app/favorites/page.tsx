import { getTranslations } from "next-intl/server"

import { FavoritesPageContent } from "@/app/favorites/components/favoritesPageContent"
import {
  getBooksinfosByIds,
  searchBooksinfosByIds,
} from "@/lib/supabase/books/getBooksinfos"
import { getUserFavoriteNovelIds } from "@/lib/supabase/favorites/getUserFavoriteNovelIds"

type FavoritesPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const { q = "" } = await searchParams
  const query = q.trim()
  const favoriteNovelIds = await getUserFavoriteNovelIds()

  const [books, tBookCard, tFavorites, tNav] = await Promise.all([
    query
      ? searchBooksinfosByIds(favoriteNovelIds, query)
      : getBooksinfosByIds(favoriteNovelIds),
    getTranslations("bookCard"),
    getTranslations("favorites"),
    getTranslations("nav"),
  ])

  return (
    <FavoritesPageContent
      initialBooks={books}
      totalFavoriteCount={favoriteNovelIds.length}
      defaultQuery={query}
      title={tNav("favorites")}
      subtitle={tFavorites("subtitle")}
      searchPlaceholder={tFavorites("searchPlaceholder")}
      searchButton={tFavorites("searchButton")}
      startReadingLabel={tBookCard("startReading")}
      favoriteLabel={tBookCard("favorite")}
    />
  )
}
