import type { LucideIcon } from "lucide-react"

import { BookCountBadge } from "@/components/sections/bookCountBadge"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type SectionHeaderProps = {
  title: string
  subtitle: string
  icon?: LucideIcon
  badge?: React.ReactNode
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
}: SectionHeaderProps) {
  return (
    <header className="mb-8 space-y-6">
      <div className="flex items-start gap-4">
        {Icon ? (
          <div
            aria-hidden
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue sm:size-12"
          >
            <Icon className="size-5 sm:size-6" />
          </div>
        ) : null}
        <CardHeader className="min-w-0 flex-1 gap-1.5 p-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <CardTitle
              role="heading"
              aria-level={1}
              className="text-2xl font-bold tracking-tight text-brand-blue sm:text-3xl"
            >
              {title}
            </CardTitle>
            {badge ? <BookCountBadge>{badge}</BookCountBadge> : null}
          </div>
          <CardDescription className="max-w-xl text-sm leading-relaxed sm:text-base">
            {subtitle}
          </CardDescription>
        </CardHeader>
      </div>
      <Separator className="bg-brand-green data-horizontal:h-1" />
    </header>
  )
}
