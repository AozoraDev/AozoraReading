"use client"

import Link from "next/link"

import { BookGridPagination } from "@/components/sections/bookGrid/components/pagination"
import { useBookGridPagination } from "@/components/sections/bookGrid/hooks/use-book-grid-pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { buildReadingPageHref } from "@/app/reading/utils/build-page-href"
import { buildTextPageHref } from "@/app/text/utils/build-text-href"
import { CHAPTERS_PAGE_SIZE } from "@/lib/supabase/books/constants"
import type { ChapterInfo } from "@/lib/supabase/books/getChapters"
import { cn } from "@/lib/utils"

type ReadingChapterListProps = {
  chapters: ChapterInfo[]
  totalCount: number
  currentPage: number
  novelId: string
  className?: string
}

export function ReadingChapterList({
  chapters,
  totalCount,
  currentPage,
  novelId,
  className,
}: ReadingChapterListProps) {
  const getPageHref = (page: number) => buildReadingPageHref(novelId, page)

  const { effectivePage, totalPages, pageNumbers, goToPage } =
    useBookGridPagination({
      currentPage,
      totalCount,
      pageSize: CHAPTERS_PAGE_SIZE,
      getPageHref,
    })

  const showPagination = totalCount > 0 && totalPages > 1

  return (
    <Card className={cn("bg-muted shadow-none ring-0", className)}>
      <CardContent className="space-y-6">
        <ul className="grid gap-2 sm:grid-cols-2">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <Button
                variant="outline"
                className="h-auto w-full justify-start gap-3 rounded-lg border-border/80 bg-background px-4 py-3 text-left hover:border-brand-green hover:bg-brand-green"
                asChild
              >
                <Link href={buildTextPageHref(novelId, chapter.chapter_no)}>
                  <span className="shrink-0 tabular-nums font-semibold text-brand-blue">
                    {chapter.chapter_no}
                  </span>
                  <span className="min-w-0 truncate text-brand-blue">
                    {chapter.title}
                  </span>
                </Link>
              </Button>
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
      </CardContent>
    </Card>
  )
}
