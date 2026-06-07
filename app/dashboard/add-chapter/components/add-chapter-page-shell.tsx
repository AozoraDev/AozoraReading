import { AddChapterForm } from "@/app/dashboard/add-chapter/components/add-chapter-form"

type AddChapterPageShellProps = {
  title: string
  description: string
}

export function AddChapterPageShell({ title, description }: AddChapterPageShellProps) {
  return (
    <section className="min-w-0 flex-1 w-full space-y-6 rounded-xl bg-muted p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-background p-6">
        <AddChapterForm />
      </div>
    </section>
  )
}
