"use client"

import { useState } from "react"

import { PAGE_SIZE } from "@/components/sections/bookGrid/utils/constants"
import { getPaginationRange } from "@/components/sections/bookGrid/utils/get-pagination-range"

type UseBookGridPaginationOptions = {
  itemCount: number
  pageSize?: number
}

export function useBookGridPagination({
  itemCount,
  pageSize = PAGE_SIZE,
}: UseBookGridPaginationOptions) {
  const [currentPage, setCurrentPage] = useState(1)
  const [jumpInput, setJumpInput] = useState("1")

  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize))
  const effectivePage = Math.min(currentPage, totalPages)
  const startIndex = (effectivePage - 1) * pageSize
  const pageNumbers = getPaginationRange(effectivePage, totalPages)

  function goToPage(page: number) {
    const nextPage = Math.min(Math.max(1, page), totalPages)
    setCurrentPage(nextPage)
    setJumpInput(String(nextPage))
  }

  function handleJumpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const page = Number.parseInt(jumpInput, 10)
    if (Number.isNaN(page)) {
      return
    }

    goToPage(page)
  }

  return {
    effectivePage,
    totalPages,
    startIndex,
    pageSize,
    pageNumbers,
    jumpInput,
    setJumpInput,
    goToPage,
    handleJumpSubmit,
  }
}
