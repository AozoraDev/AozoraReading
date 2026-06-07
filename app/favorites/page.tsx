import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { FavoritesPageContent } from "@/app/favorites/components/favoritesPageContent"
import { getPageMetadata } from "@/lib/metadata"
import { parsePageParam } from "@/lib/supabase/books/constants"
import { getFavoriteBooksPage } from "@/lib/supabase/favorites/getFavoriteBooksPage"

type FavoritesPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("favorites")
}

export default async function FavoritesPage({ searchParams }: FavoritesPageProps) {
  const { q = "", page: pageParam } = await searchParams
  const query = q.trim()
  const page = parsePageParam(pageParam)

  const [
    { books, totalCount, totalFavoriteCount },
    tBookCard,
    tFavorites,
    tNav,
  ] = await Promise.all([
    getFavoriteBooksPage({ page, query }),
    getTranslations("bookCard"),
    getTranslations("favorites"),
    getTranslations("nav"),
  ])

  return (
    <FavoritesPageContent
      initialBooks={books}
      totalCount={totalCount}
      currentPage={page}
      totalFavoriteCount={totalFavoriteCount}
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
