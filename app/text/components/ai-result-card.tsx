import { Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AiResultCardProps = {
  title: string
  content?: string
  isLoading?: boolean
  loadingText?: string
  className?: string
}

/** AI 结果展示卡片：浅蓝色渐变背景、黑色文字，可复用于回顾 / 总结等 */
export function AiResultCard({
  title,
  content,
  isLoading = false,
  loadingText,
  className,
}: AiResultCardProps) {
  return (
    <Card
      className={cn(
        "mt-4 mb-4 border-0 bg-linear-to-br from-sky-100 via-sky-50 to-blue-100 text-black shadow-none ring-1 ring-sky-200/60 sm:mb-6",
        className,
      )}
    >
      <CardContent className="space-y-3 px-6 py-5 sm:px-8">
        <h2 className="text-base font-semibold text-black sm:text-lg">{title}</h2>

        {content ? (
          <p className="indent-[2em] whitespace-pre-wrap text-sm leading-relaxed text-black/90 sm:text-base">
            {content}
            {isLoading ? (
              <span className="ml-0.5 inline-block animate-pulse">▍</span>
            ) : null}
          </p>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-sm text-black/70">
            <Loader2 className="size-4 animate-spin" />
            <span>{loadingText}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
