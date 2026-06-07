"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"

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

type JumpToPageFormProps = {
  effectivePage: number
  totalPages: number
  onGoToPage: (page: number) => void
}

function JumpToPageForm({
  effectivePage,
  totalPages,
  onGoToPage,
}: JumpToPageFormProps) {
  const t = useTranslations("pagination")
  const [jumpInput, setJumpInput] = useState(String(effectivePage))

  function handleJumpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const page = Number.parseInt(jumpInput, 10)
    if (Number.isNaN(page)) {
      return
    }

    onGoToPage(page)
  }

  return (
    <form
      onSubmit={handleJumpSubmit}
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
        onChange={(event) => setJumpInput(event.target.value)}
        placeholder={t("pagePlaceholder")}
        className={bookGridStyles.paginationJumpInput}
      />
      <Button type="submit" variant="brand" size="sm" className="h-7 px-3">
        {t("go")}
      </Button>
    </form>
  )
}

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

          <JumpToPageForm
            key={effectivePage}
            effectivePage={effectivePage}
            totalPages={totalPages}
            onGoToPage={onGoToPage}
          />
        </div>
      </div>
    </nav>
  )
}
