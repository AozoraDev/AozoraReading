import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { getCoverUrl } from "@/lib/supabase/books/getcover"
import { cn } from "@/lib/utils"

export type BookCardProps = {
  cover_url: string
  title: string
  author: string
  startReadingLabel: string
  favoriteLabel: string
  className?: string
}

export function BookCard({
  cover_url,
  title,
  author,
  startReadingLabel,
  favoriteLabel,
  className,
}: BookCardProps) {
  const coverSrc = getCoverUrl(cover_url)

  return (
    <Card
      role="article"
      className={cn(
        "flex-row gap-0 border-2 border-brand-blue-light bg-transparent p-0 shadow-[0_8px_32px_rgba(0,89,187,0.08)] ring-0 transition-transform duration-300 ease-out hover:scale-[1.02]",
        className
      )}
    >
      <Image
        src={coverSrc}
        alt={title}
        width={240}
        height={360}
        unoptimized
        className="aspect-2/3 w-1/3 shrink-0 object-cover"
        sizes="33vw"
      />

      <CardContent
        className={cn(
          "flex min-w-0 flex-1 flex-col justify-between px-4 pt-4 pb-3",
          "bg-linear-to-br from-brand-green/70 via-brand-blue-light/50 to-brand-green/30",
          "backdrop-blur-xl backdrop-saturate-150"
        )}
      >
        <div className="space-y-1">
          <CardTitle className="line-clamp-2 text-2xl font-semibold text-brand-blue">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-1 text-foreground">
            {author}
          </CardDescription>
        </div>

        <CardFooter className="mt-3 w-full justify-between gap-2 border-t-0 bg-transparent p-0">
          <Button
            variant="brand"
            size="lg"
            className="shrink-0 px-4 hover:border-brand-green hover:bg-brand-green hover:text-brand-blue"
            asChild
          >
            <Link href="#">{startReadingLabel}</Link>
          </Button>
          <Button
            type="button"
            variant="brandOutlineCta"
            size="icon-lg"
            aria-label={favoriteLabel}
            className="shrink-0 border-brand-blue-light bg-white/30 [&_svg]:size-5"
          >
            <Heart className="fill-none" strokeWidth={2} />
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
