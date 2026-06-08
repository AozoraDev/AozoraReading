"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { buildTextPageHref } from "@/app/text/utils/build-text-href"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"

type TextChapterNavProps = {
  novelId: string
  chapterNo: number
  prevChapterNo: number | null
  nextChapterNo: number | null
  totalChapters: number
}

export function TextChapterNav({
  novelId,
  chapterNo,
  prevChapterNo,
  nextChapterNo,
  totalChapters,
}: TextChapterNavProps) {
  const router = useRouter()
  const t = useTranslations("reading")
  const tPagination = useTranslations("pagination")
  const [jumpInput, setJumpInput] = useState(String(chapterNo))

  function goToChapter(targetChapterNo: number) {
    const nextChapter = Math.min(Math.max(1, targetChapterNo), totalChapters)

    if (nextChapter === chapterNo) {
      return
    }

    router.push(buildTextPageHref(novelId, nextChapter))
  }

  function handleJumpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const value = Number.parseInt(jumpInput, 10)
    if (Number.isNaN(value)) {
      return
    }

    goToChapter(value)
  }

  return (
    <div className="space-y-6">
      <Separator />
      <Pagination className="mx-0 w-full">
        <PaginationContent className="w-full flex-col gap-4 sm:flex-row sm:justify-between">
          <PaginationItem className="w-full sm:w-auto">
            <PaginationPrevious
              aria-label={t("prevChapter")}
              disabled={!prevChapterNo}
              onClick={() =>
                prevChapterNo && goToChapter(prevChapterNo)
              }
              className="w-full sm:w-auto"
            >
              {t("prevChapter")}
            </PaginationPrevious>
          </PaginationItem>

          <PaginationItem>
            <form
              onSubmit={handleJumpSubmit}
              className="flex items-center gap-2"
            >
              <Label htmlFor="text-chapter-jump" className="shrink-0">
                {t("goToChapter")}
              </Label>
              <Input
                id="text-chapter-jump"
                type="number"
                min={1}
                max={totalChapters}
                value={jumpInput}
                onChange={(event) => setJumpInput(event.target.value)}
                placeholder={t("chapterPlaceholder")}
                className="h-8 w-20"
              />
              <Button type="submit" size="sm">
                {tPagination("go")}
              </Button>
            </form>
          </PaginationItem>

          <PaginationItem className="w-full sm:w-auto">
            <PaginationNext
              aria-label={t("nextChapter")}
              disabled={!nextChapterNo}
              onClick={() =>
                nextChapterNo && goToChapter(nextChapterNo)
              }
              className="w-full sm:w-auto"
            >
              {t("nextChapter")}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
