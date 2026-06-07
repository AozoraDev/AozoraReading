import { ImageIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type CoverPreviewPanelProps = {
  label: string
  previewUrl: string | null
  emptyLabel: string
  alt: string
}

export function CoverPreviewPanel({ label, previewUrl, emptyLabel, alt }: CoverPreviewPanelProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div
        className={cn(
          "overflow-hidden rounded-xl ring-1 ring-foreground/10",
          "aspect-2/3 w-full bg-muted/30"
        )}
      >
        {previewUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={previewUrl} alt={alt} className="size-full object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 p-4 text-center">
            <ImageIcon className="size-8 text-muted-foreground/40" aria-hidden />
            <p className="text-xs text-muted-foreground">{emptyLabel}</p>
          </div>
        )}
      </div>
    </div>
  )
}
