"use client"

import { useTranslations } from "next-intl"

import { JumpNumberForm } from "@/components/sections/bookGrid/components/jump-number-form"
import { bookGridStyles } from "@/components/sections/bookGrid/styles/styles"
import type { PageToken } from "@/components/sections/bookGrid/utils/get-pagination-range"
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
  onGoToPage: (page: number) => void
}

export function BookGridPagination({
  effectivePage,
  totalPages,
  pageNumbers,
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

          <JumpNumberForm
            key={effectivePage}
            id="book-grid-page"
            current={effectivePage}
            max={totalPages}
            label={t("goToPage")}
            placeholder={t("pagePlaceholder")}
            submitLabel={t("go")}
            onJump={onGoToPage}
          />
        </div>
      </div>
    </nav>
  )
}
