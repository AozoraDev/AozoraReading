import { BookOpen } from "lucide-react"
import Image from "next/image"

import { BookCountBadge } from "@/components/sections/bookCountBadge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"
import { getCoverUrl } from "@/lib/supabase/books/getcover"

export type ReadingNovelCardProps = {
  novel: BookInfo | null
  title: string
  author: string
  summary: string
  summaryLabel: string
}

export function ReadingNovelCard({
  novel,
  title,
  author,
  summary,
  summaryLabel,
}: ReadingNovelCardProps) {
  const tags = novel?.tags ?? []

  return (
    <Card className="bg-muted shadow-none ring-0">
      <CardHeader className="flex min-w-0 flex-wrap items-start gap-x-4 gap-y-3 py-0 sm:flex-nowrap sm:gap-4">
        <div className="shrink-0">
          {novel ? (
            <Image
              src={getCoverUrl(novel.cover_url)}
              alt={title}
              width={80}
              height={120}
              className="aspect-2/3 w-20 rounded-lg object-cover"
              sizes="80px"
            />
          ) : (
            <div
              aria-hidden
              className="flex size-10 items-center justify-center rounded-lg bg-background text-brand-blue"
            >
              <BookOpen className="size-5" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1 sm:shrink-0 sm:flex-none">
          <CardTitle className="line-clamp-2 text-xl font-semibold text-brand-blue sm:text-2xl">
            {title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {author}
          </CardDescription>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {tags.map((tag, index) => (
                <BookCountBadge key={`${tag}-${index}`}>{tag}</BookCountBadge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 basis-full space-y-1 pr-2 sm:ml-10 sm:basis-auto sm:flex-1">
          <p className="text-lg font-semibold text-brand-blue sm:text-xl">
            {summaryLabel}
          </p>
          <p className="indent-[2em] wrap-break-word text-sm text-brand-blue sm:text-base">
            {summary}
          </p>
        </div>
      </CardHeader>
    </Card>
  )
}
