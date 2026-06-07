import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type FormSubmitButtonProps = {
  isPending: boolean
  submitLabel: string
  submittingLabel: string
}

export function FormSubmitButton({
  isPending,
  submitLabel,
  submittingLabel,
}: FormSubmitButtonProps) {
  return (
    <div className="flex justify-end">
      <Button type="submit" variant="brandCta" size="lg" disabled={isPending} className="min-w-32">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            {submittingLabel}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  )
}
