import { BookCard } from "@/components/sections/bookCard/bookCard"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"
import { cn } from "@/lib/utils"

type BookGridProps = {
  books: BookInfo[]
  startReadingLabel: string
  favoriteLabel: string
  isFavorited?: (novelId: string) => boolean
  onFavoriteChange?: (novelId: string, isFavorited: boolean) => void
  className?: string
}

export function BookGrid({
  books,
  startReadingLabel,
  favoriteLabel,
  isFavorited,
  onFavoriteChange,
  className,
}: BookGridProps) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {books.map((book) => (
        <li key={book.novel_id}>
          <BookCard
            {...book}
            isFavorited={isFavorited?.(book.novel_id) ?? false}
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
  )
}
