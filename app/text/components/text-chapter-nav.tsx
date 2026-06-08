"use client"

import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { buildTextPageHref } from "@/app/text/utils/build-text-href"
import { JumpNumberForm } from "@/components/sections/bookGrid/components/jump-number-form"
import { bookGridStyles } from "@/components/sections/bookGrid/styles/styles"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
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

  function goToChapter(targetChapterNo: number) {
    const nextChapter = Math.min(Math.max(1, targetChapterNo), totalChapters)

    if (nextChapter === chapterNo) {
      return
    }

    router.push(buildTextPageHref(novelId, nextChapter))
  }

  const chapterProgress =
    totalChapters > 0 ? (chapterNo / totalChapters) * 100 : 0
  const chapterPositionLabel = t("chapterOf", {
    current: chapterNo,
    total: totalChapters,
  })

  return (
    <nav aria-label={t("goToChapter")} className={bookGridStyles.paginationNav}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-sm font-medium tracking-wide text-brand-blue">
            {chapterPositionLabel}
          </p>
          <div
            className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-brand-blue/10"
            role="progressbar"
            aria-valuenow={chapterNo}
            aria-valuemin={1}
            aria-valuemax={totalChapters}
            aria-label={chapterPositionLabel}
          >
            <div
              className="h-full rounded-full bg-brand-blue transition-all duration-300"
              style={{ width: `${chapterProgress}%` }}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:justify-between">
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  aria-label={t("prevChapter")}
                  disabled={!prevChapterNo}
                  onClick={() => prevChapterNo && goToChapter(prevChapterNo)}
                  className={cn(
                    bookGridStyles.paginationArrowButton,
                    "[&_span]:block"
                  )}
                >
                  {t("prevChapter")}
                </PaginationPrevious>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  aria-label={t("nextChapter")}
                  disabled={!nextChapterNo}
                  onClick={() => nextChapterNo && goToChapter(nextChapterNo)}
                  className={cn(
                    bookGridStyles.paginationArrowButton,
                    "[&_span]:block"
                  )}
                >
                  {t("nextChapter")}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <JumpNumberForm
            key={chapterNo}
            id="text-chapter-jump"
            current={chapterNo}
            max={totalChapters}
            label={t("goToChapter")}
            placeholder={t("chapterPlaceholder")}
            submitLabel={tPagination("go")}
            onJump={goToChapter}
          />
        </div>
      </div>
    </nav>
  )
}
