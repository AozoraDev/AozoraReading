"use client"

import { useMemo } from "react"

import { BookCard } from "@/components/sections/bookCard/bookCard"
import { BookGridPagination } from "@/components/sections/bookGrid/components/pagination"
import { useBookGridPagination } from "@/components/sections/bookGrid/hooks/use-book-grid-pagination"
import { bookGridStyles } from "@/components/sections/bookGrid/styles/styles"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"
import { cn } from "@/lib/utils"

type BookGridProps = {
  books: BookInfo[]
  startReadingLabel: string
  favoriteLabel: string
  favoriteNovelIds?: string[]
  onFavoriteChange?: (novelId: string, isFavorited: boolean) => void
  className?: string
}

export function BookGrid({
  books,
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

  const {
    effectivePage,
    totalPages,
    startIndex,
    pageSize,
    pageNumbers,
    jumpInput,
    setJumpInput,
    goToPage,
    handleJumpSubmit,
  } = useBookGridPagination({ itemCount: books.length })

  const paginatedBooks = books.slice(startIndex, startIndex + pageSize)
  const showPagination = books.length > 0 && totalPages > 1

  return (
    <div className={cn(bookGridStyles.root, className)}>
      <ul className={bookGridStyles.list}>
        {paginatedBooks.map((book) => (
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
          jumpInput={jumpInput}
          onJumpInputChange={setJumpInput}
          onJumpSubmit={handleJumpSubmit}
          onGoToPage={goToPage}
        />
      ) : null}
    </div>
  )
}
