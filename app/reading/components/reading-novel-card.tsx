import { BookOpen } from "lucide-react"
import Image from "next/image"

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
  return (
    <Card className="bg-muted shadow-none ring-0">
      <CardHeader className="flex h-30 min-w-0 flex-row items-center gap-4 overflow-hidden py-0">
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

        <div className="flex min-w-0 shrink-0 flex-col justify-center space-y-1">
          <CardTitle className="line-clamp-2 text-xl font-semibold text-brand-blue sm:text-2xl">
            {title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {author}
          </CardDescription>
        </div>

        <div className="ml-6 min-w-0 flex-1 space-y-1 overflow-hidden sm:ml-10 sm:max-w-md">
          <p className="text-lg font-semibold text-brand-blue sm:text-xl">
            {summaryLabel}
          </p>
          <p className="line-clamp-3 indent-[2em] wrap-break-word text-sm text-brand-blue sm:text-base">
            {summary}
          </p>
        </div>
      </CardHeader>
    </Card>
  )
}
