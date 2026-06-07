import { Upload } from "lucide-react"
import type { RefObject } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type TxtUploadZoneProps = {
  id: string
  label: string
  fileName?: string
  emptyLabel: string
  hint: string
  chooseLabel: string
  error?: string
  inputRef: RefObject<HTMLInputElement | null>
  fileRef: (element: HTMLInputElement | null) => void
  registration: Omit<UseFormRegisterReturn, "ref">
}

export function TxtUploadZone({
  id,
  label,
  fileName,
  emptyLabel,
  hint,
  chooseLabel,
  error,
  inputRef,
  fileRef,
  registration,
}: TxtUploadZoneProps) {
  const hasFile = Boolean(fileName)
  const hasError = Boolean(error)

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>

      <div
        className={cn(
          "rounded-xl border-2 border-dashed p-6 transition-colors",
          hasError
            ? "border-destructive/50 bg-destructive/5"
            : "border-border bg-muted/20 hover:border-ring/40 hover:bg-muted/40",
          hasFile && "border-solid border-border bg-background"
        )}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Upload className="size-5 text-muted-foreground" aria-hidden />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{fileName ?? emptyLabel}</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            {chooseLabel}
          </Button>
        </div>

        <Input
          id={id}
          type="file"
          accept=".txt,text/plain"
          className="sr-only"
          aria-invalid={hasError}
          {...registration}
          ref={(element) => {
            fileRef(element)
            inputRef.current = element
          }}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
