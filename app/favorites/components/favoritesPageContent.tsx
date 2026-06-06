"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { BookCard } from "@/components/sections/bookCard"
import { BookSearch } from "@/components/sections/bookSearch"
import { SectionHeader } from "@/components/sections/sectionHeader"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"

type FavoritesPageContentProps = {
  initialBooks: BookInfo[]
  title: string
  subtitle: string
  searchPlaceholder: string
  searchButton: string
  startReadingLabel: string
  favoriteLabel: string
}

export function FavoritesPageContent({
  initialBooks,
  title,
  subtitle,
  searchPlaceholder,
  searchButton,
  startReadingLabel,
  favoriteLabel,
}: FavoritesPageContentProps) {
  const t = useTranslations("favorites")
  const [books, setBooks] = useState(initialBooks)

  function handleFavoriteChange(novelId: string, isFavorited: boolean) {
    if (!isFavorited) {
      setBooks((prev) => prev.filter((book) => book.novel_id !== novelId))
    }
  }

  return (
    <div className="py-8 sm:py-12">
      <SectionHeader
        icon={Heart}
        title={title}
        subtitle={subtitle}
        badge={t("bookCount", { count: books.length })}
      />

      <BookSearch
        searchPlaceholder={searchPlaceholder}
        searchButton={searchButton}
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <li key={book.novel_id}>
            <BookCard
              {...book}
              isFavorited
              startReadingLabel={startReadingLabel}
              favoriteLabel={favoriteLabel}
              onFavoriteChange={(isFavorited) =>
                handleFavoriteChange(book.novel_id, isFavorited)
              }
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
