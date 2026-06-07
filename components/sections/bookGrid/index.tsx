"use client"

import { useMemo } from "react"

import { BookCard } from "@/components/sections/bookCard/bookCard"
import { BookGridPagination } from "@/components/sections/bookGrid/components/pagination"
import { useBookGridPagination } from "@/components/sections/bookGrid/hooks/use-book-grid-pagination"
import { bookGridStyles } from "@/components/sections/bookGrid/styles/styles"
import { buildBookGridPageHref } from "@/components/sections/bookGrid/utils/build-page-href"
import { PAGE_SIZE } from "@/components/sections/bookGrid/utils/constants"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"
import { cn } from "@/lib/utils"

type BookGridProps = {
  books: BookInfo[]
  totalCount: number
  currentPage: number
  basePath: string
  searchQuery?: string
  pageSize?: number
  startReadingLabel: string
  favoriteLabel: string
  favoriteNovelIds?: string[]
  onFavoriteChange?: (novelId: string, isFavorited: boolean) => void
  className?: string
}

export function BookGrid({
  books,
  totalCount,
  currentPage,
  basePath,
  searchQuery = "",
  pageSize = PAGE_SIZE,
  startReadingLabel,
  favoriteLabel,
  favoriteNovelIds,
  onFavoriteChange,
  className,
}: BookGridProps) {
  const favoriteSet = useMemo(
    () => new Set(favoriteNovelIds ?? []),
    [favoriteNovelIds]
  )

  const getPageHref = (page: number) =>
    buildBookGridPageHref(basePath, page, searchQuery)

  const { effectivePage, totalPages, pageNumbers, goToPage } =
    useBookGridPagination({
    currentPage,
    totalCount,
    pageSize,
    getPageHref,
  })

  const showPagination = totalCount > 0 && totalPages > 1

  return (
    <div className={cn(bookGridStyles.root, className)}>
      <ul className={bookGridStyles.list}>
        {books.map((book) => (
          <li key={book.novel_id}>
            <BookCard
              {...book}
              isFavorited={favoriteSet.has(book.novel_id)}
              startReadingLabel={startReadingLabel}
              favoriteLabel={favoriteLabel}
              onFavoriteChange={
                onFavoriteChange
                  ? (favorited) => onFavoriteChange(book.novel_id, favorited)
                  : undefined
              }
            />
          </li>
        ))}
      </ul>

      {showPagination ? (
        <BookGridPagination
          effectivePage={effectivePage}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          onGoToPage={goToPage}
        />
      ) : null}
    </div>
  )
}
