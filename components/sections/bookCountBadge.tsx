type BookCountBadgeProps = {
  children: React.ReactNode
}

export function BookCountBadge({ children }: BookCountBadgeProps) {
  return (
    <span className="inline-flex h-7 shrink-0 cursor-default items-center rounded-full border border-brand-green bg-brand-green px-2.5 text-sm font-medium tabular-nums text-brand-blue transition-colors hover:border-brand-blue hover:bg-white hover:text-brand-blue">
      {children}
    </span>
  )
}
