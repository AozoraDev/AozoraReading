import { AddNovelForm } from "@/app/dashboard/add-novel/components/add-novel-form"

type AddNovelPageShellProps = {
  title: string
  description: string
}

export function AddNovelPageShell({ title, description }: AddNovelPageShellProps) {
  return (
    <section className="min-w-0 flex-1 w-full space-y-6 rounded-xl bg-muted p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-background p-6">
        <AddNovelForm />
      </div>
    </section>
  )
}
