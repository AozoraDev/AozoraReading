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
  totalCount: number
  currentPage: number
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
  totalCount,
  currentPage,
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
  const [listTotalCount, setListTotalCount] = useState(totalCount)
  const [favoriteCount, setFavoriteCount] = useState(totalFavoriteCount)

  
  function handleFavoriteChange(novelId: string, isFavorited: boolean) {
    if (!isFavorited) {
      setBooks((prev) => prev.filter((book) => book.novel_id !== novelId))
      setListTotalCount((prev) => Math.max(0, prev - 1))
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
        totalCount={listTotalCount}
        currentPage={currentPage}
        basePath="/favorites"
        searchQuery={defaultQuery}
        startReadingLabel={startReadingLabel}
        favoriteLabel={favoriteLabel}
        favoriteNovelIds={books.map((book) => book.novel_id)}
        onFavoriteChange={handleFavoriteChange}
      />
    </div>
  )
}
