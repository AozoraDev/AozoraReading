"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { BookGrid } from "@/components/sections/bookGrid"
import { BookSearch } from "@/components/sections/bookSearch"
import { SectionHeader } from "@/components/sections/sectionHeader"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"

type FavoritesPageContentProps = {
  initialBooks: BookInfo[]
  totalFavoriteCount: number
  defaultQuery?: string
  title: string
  subtitle: string
  searchPlaceholder: string
  searchButton: string
  startReadingLabel: string
  favoriteLabel: string
}

export function FavoritesPageContent({
  initialBooks,
  totalFavoriteCount,
  defaultQuery = "",
  title,
  subtitle,
  searchPlaceholder,
  searchButton,
  startReadingLabel,
  favoriteLabel,
}: FavoritesPageContentProps) {
  const t = useTranslations("favorites")
  const [books, setBooks] = useState(initialBooks)
  const [favoriteCount, setFavoriteCount] = useState(totalFavoriteCount)

  function handleFavoriteChange(novelId: string, isFavorited: boolean) {
    if (!isFavorited) {
      setBooks((prev) => prev.filter((book) => book.novel_id !== novelId))
      setFavoriteCount((prev) => prev - 1)
    }
  }

  return (
    <div className="py-8 sm:py-12">
      <SectionHeader
        icon={Heart}
        title={title}
        subtitle={subtitle}
        badge={t("bookCount", { count: favoriteCount })}
      />

      <BookSearch
        action="/favorites"
        defaultQuery={defaultQuery}
        searchPlaceholder={searchPlaceholder}
        searchButton={searchButton}
      />

      <BookGrid
        books={books}
        startReadingLabel={startReadingLabel}
        favoriteLabel={favoriteLabel}
        isFavorited={() => true}
        onFavoriteChange={handleFavoriteChange}
      />
    </div>
  )
}
