import type { LucideIcon } from "lucide-react"

type FormSectionHeaderProps = {
  icon: LucideIcon
  title: string
  description: string
}

export function FormSectionHeader({ icon: Icon, title, description }: FormSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
        <Icon className="size-4" aria-hidden />
      </div>
      <div>
        <p className="text-sm font-medium text-brand-blue">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
