import { DashboardNovelsTable } from "@/app/dashboard/components/overview/dashboard-novels-table"
import { BookCountBadge } from "@/components/sections/bookCountBadge"
import { BookSearch } from "@/components/sections/bookSearch"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"

type DashboardPageShellProps = {
  title: string
  description: string
  bookCountLabel: string
  books: BookInfo[]
  totalCount: number
  currentPage: number
  defaultQuery?: string
  searchPlaceholder: string
  searchButton: string
  searchQuery?: string
}

export function DashboardPageShell({
  title,
  description,
  bookCountLabel,
  books,
  totalCount,
  currentPage,
  defaultQuery = "",
  searchPlaceholder,
  searchButton,
  searchQuery = "",
}: DashboardPageShellProps) {
  return (
    <section className="min-w-0 flex-1 w-full space-y-6 rounded-xl bg-muted p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-sm text-muted-foreground">{description}</p>
            <BookCountBadge>{bookCountLabel}</BookCountBadge>
          </div>
        </div>

        <BookSearch
          action="/dashboard"
          defaultQuery={defaultQuery}
          searchPlaceholder={searchPlaceholder}
          searchButton={searchButton}
        />
      </div>

      <DashboardNovelsTable
        books={books}
        totalCount={totalCount}
        currentPage={currentPage}
        searchQuery={searchQuery}
      />
    </section>
  )
}
