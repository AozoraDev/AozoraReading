import { getTranslations } from "next-intl/server"

import { FavoritesPageContent } from "@/app/favorites/components/favoritesPageContent"
import { getBooksinfosByIds } from "@/lib/supabase/books/getBooksinfos"
import { getUserFavoriteNovelIds } from "@/lib/supabase/favorites/getUserFavoriteNovelIds"

export default async function FavoritesPage() {
  const favoriteNovelIds = await getUserFavoriteNovelIds()

  const [books, tBookCard, tFavorites, tNav] = await Promise.all([
    getBooksinfosByIds(favoriteNovelIds),
    getTranslations("bookCard"),
    getTranslations("favorites"),
    getTranslations("nav"),
  ])

  return (
    <FavoritesPageContent
      initialBooks={books}
      title={tNav("favorites")}
      subtitle={tFavorites("subtitle")}
      searchPlaceholder={tFavorites("searchPlaceholder")}
      searchButton={tFavorites("searchButton")}
      startReadingLabel={tBookCard("startReading")}
      favoriteLabel={tBookCard("favorite")}
    />
  )
}
