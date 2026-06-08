import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { TextChapterNav } from "@/app/text/components/text-chapter-nav"
import { Card, CardContent } from "@/components/ui/card"
import { getPageMetadata } from "@/lib/metadata"
import {
  getChapterByNovelAndNo,
  getChapterNavigation,
} from "@/lib/supabase/books/getChapterContent"

type TextPageProps = {
  searchParams: Promise<{ novel_id?: string; chapter_no?: string }>
}

function parseChapterNoParam(value?: string): number | null {
  const parsed = Number.parseInt(value ?? "", 10)

  if (Number.isNaN(parsed) || parsed < 1) {
    return null
  }

  return parsed
}

export async function generateMetadata({
  searchParams,
}: TextPageProps): Promise<Metadata> {
  const { novel_id, chapter_no } = await searchParams
  const chapterNo = parseChapterNoParam(chapter_no)

  if (novel_id && chapterNo) {
    const chapter = await getChapterByNovelAndNo(novel_id, chapterNo)

    if (chapter) {
      return { title: chapter.title }
    }
  }

  return getPageMetadata("reading")
}

export default async function TextPage({ searchParams }: TextPageProps) {
  const { novel_id, chapter_no } = await searchParams
  const chapterNo = parseChapterNoParam(chapter_no)
  const t = await getTranslations("reading")

  const [chapter, navigation] = await Promise.all([
    novel_id && chapterNo
      ? getChapterByNovelAndNo(novel_id, chapterNo)
      : Promise.resolve(null),
    novel_id && chapterNo
      ? getChapterNavigation(novel_id, chapterNo)
      : Promise.resolve(null),
  ])

  const title = chapter?.title ?? t("novelTitle")
  const content = chapter?.content ?? t("contentPlaceholder")
  const showChapterNav =
    novel_id && chapterNo && chapter && navigation && navigation.totalChapters > 0

  return (
    <div className="py-8 sm:py-12">
      <Card className="bg-muted shadow-none ring-0">
        <CardContent className="space-y-6 px-6 py-6 sm:px-10 sm:py-8 md:px-14">
          <h1 className="text-center text-2xl font-semibold text-brand-blue sm:text-3xl">
            {title}
          </h1>
          <p className="indent-[2em] whitespace-pre-wrap text-base leading-relaxed text-brand-blue sm:text-lg">
            {content}
          </p>

          {showChapterNav ? (
            <TextChapterNav
              novelId={novel_id}
              chapterNo={chapterNo}
              prevChapterNo={navigation.prevChapterNo}
              nextChapterNo={navigation.nextChapterNo}
              totalChapters={navigation.totalChapters}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
