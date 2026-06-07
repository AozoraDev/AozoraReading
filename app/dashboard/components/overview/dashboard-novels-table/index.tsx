"use client"

import { useTranslations } from "next-intl"

import { NovelsTable } from "@/app/dashboard/components/overview/dashboard-novels-table/components/novels-table"
import { dashboardNovelsTableStyles as styles } from "@/app/dashboard/components/overview/dashboard-novels-table/styles/styles"
import type { NovelsTableCopy } from "@/app/dashboard/components/overview/dashboard-novels-table/types"
import { BookGridPagination } from "@/components/sections/bookGrid/components/pagination"
import { useBookGridPagination } from "@/components/sections/bookGrid/hooks/use-book-grid-pagination"
import { buildBookGridPageHref } from "@/components/sections/bookGrid/utils/build-page-href"
import { PAGE_SIZE } from "@/components/sections/bookGrid/utils/constants"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"

type DashboardNovelsTableProps = {
  books: BookInfo[]
  totalCount: number
  currentPage: number
  searchQuery?: string
}

export function DashboardNovelsTable({
  books,
  totalCount,
  currentPage,
  searchQuery = "",
}: DashboardNovelsTableProps) {
  const t = useTranslations("dashboard.table")

  const copy: NovelsTableCopy = {
    cover: t("cover"),
    novelId: t("novelId"),
    title: t("title"),
    author: t("author"),
    actions: t("actions"),
    empty: t("empty"),
    delete: t("delete"),
    deleteConfirmTitle: t("deleteConfirmTitle"),
    deleteConfirmDescription: t("deleteConfirmDescription"),
    cancel: t("cancel"),
    confirm: t("confirm"),
  }

  const getPageHref = (page: number) =>
    buildBookGridPageHref("/dashboard", page, searchQuery)

  const { effectivePage, totalPages, pageNumbers, goToPage } =
    useBookGridPagination({
      currentPage,
      totalCount,
      pageSize: PAGE_SIZE,
      getPageHref,
    })

  const showPagination = totalCount > 0 && totalPages > 1

  return (
    <div className={styles.root}>
      <NovelsTable books={books} copy={copy} />

      {showPagination && (
        <BookGridPagination
          effectivePage={effectivePage}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          onGoToPage={goToPage}
        />
      )}
    </div>
  )
}
