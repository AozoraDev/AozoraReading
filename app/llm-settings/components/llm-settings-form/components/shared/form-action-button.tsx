import { Loader2 } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { Button } from "@/components/ui/button"

type FormActionButtonProps = {
  isLoading: boolean
  loadingLabel: string
  children: ReactNode
} & ComponentProps<typeof Button>

export function FormActionButton({
  isLoading,
  loadingLabel,
  children,
  disabled,
  ...props
}: FormActionButtonProps) {
  return (
    <Button
      disabled={disabled || isLoading}
      className="min-w-32"
      size="lg"
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" aria-hidden />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
