"use client"

import { useTranslations } from "next-intl"

import { bookGridStyles } from "@/components/sections/bookGrid/styles/styles"
import type { PageToken } from "@/components/sections/bookGrid/utils/get-pagination-range"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

type BookGridPaginationProps = {
  effectivePage: number
  totalPages: number
  pageNumbers: PageToken[]
  jumpInput: string
  onJumpInputChange: (value: string) => void
  onJumpSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onGoToPage: (page: number) => void
}

export function BookGridPagination({
  effectivePage,
  totalPages,
  pageNumbers,
  jumpInput,
  onJumpInputChange,
  onJumpSubmit,
  onGoToPage,
}: BookGridPaginationProps) {
  const t = useTranslations("pagination")

  return (
    <nav aria-label={t("goToPage")} className={bookGridStyles.paginationNav}>
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm font-medium tracking-wide text-brand-blue">
          {t("pageOf", { current: effectivePage, total: totalPages })}
        </p>

        <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  aria-label={t("previous")}
                  disabled={effectivePage === 1}
                  onClick={() => onGoToPage(effectivePage - 1)}
                  className={bookGridStyles.paginationArrowButton}
                >
                  {t("previous")}
                </PaginationPrevious>
              </PaginationItem>

              {pageNumbers.map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-brand-blue/60" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      aria-label={t("pageOf", {
                        current: page,
                        total: totalPages,
                      })}
                      isActive={page === effectivePage}
                      onClick={() => onGoToPage(page)}
                      className={cn(
                        bookGridStyles.paginationPageLink.base,
                        page === effectivePage
                          ? bookGridStyles.paginationPageLink.active
                          : bookGridStyles.paginationPageLink.inactive
                      )}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  aria-label={t("next")}
                  disabled={effectivePage === totalPages}
                  onClick={() => onGoToPage(effectivePage + 1)}
                  className={bookGridStyles.paginationArrowButton}
                >
                  {t("next")}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <form
            onSubmit={onJumpSubmit}
            className={bookGridStyles.paginationJumpForm}
          >
            <label
              htmlFor="book-grid-page"
              className="text-xs font-medium whitespace-nowrap text-brand-blue/80"
            >
              {t("goToPage")}
            </label>
            <Input
              id="book-grid-page"
              type="number"
              min={1}
              max={totalPages}
              value={jumpInput}
              onChange={(event) => onJumpInputChange(event.target.value)}
              placeholder={t("pagePlaceholder")}
              className={bookGridStyles.paginationJumpInput}
            />
            <Button type="submit" variant="brand" size="sm" className="h-7 px-3">
              {t("go")}
            </Button>
          </form>
        </div>
      </div>
    </nav>
  )
}
