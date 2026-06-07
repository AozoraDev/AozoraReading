"use client"

import { useRouter } from "next/navigation"

import { PAGE_SIZE } from "@/components/sections/bookGrid/utils/constants"
import { getPaginationRange } from "@/components/sections/bookGrid/utils/get-pagination-range"

type UseBookGridPaginationOptions = {
  currentPage: number
  totalCount: number
  pageSize?: number
  getPageHref: (page: number) => string
}

export function useBookGridPagination({
  currentPage,
  totalCount,
  pageSize = PAGE_SIZE,
  getPageHref,
}: UseBookGridPaginationOptions) {
  const router = useRouter()

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const effectivePage = Math.min(Math.max(1, currentPage), totalPages)
  const pageNumbers = getPaginationRange(effectivePage, totalPages)

  function goToPage(page: number) {
    const nextPage = Math.min(Math.max(1, page), totalPages)

    if (nextPage === effectivePage) {
      return
    }

    router.push(getPageHref(nextPage))
  }

  return {
    effectivePage,
    totalPages,
    pageNumbers,
    goToPage,
  }
}
