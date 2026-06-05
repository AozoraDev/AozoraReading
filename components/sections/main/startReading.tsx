import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"

const START_READING_HEADING_ID = "start-reading-heading"

function StartReadingTitle({ title }: { title: string }) {
  return (
    <h2
      id={START_READING_HEADING_ID}
      className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
    >
      {title}
    </h2>
  )
}

function StartReadingDescription({ description }: { description: string }) {
  return (
    <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
      {description}
    </p>
  )
}

function StartReadingActions({ signup }: { signup: string }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <Button variant="brandCta" size="pill" asChild>
        <Link href="/login">{signup}</Link>
      </Button>
    </div>
  )
}

export async function StartReading() {
  const t = await getTranslations("startReading")

  return (
    <section
      aria-labelledby={START_READING_HEADING_ID}
      className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-brand-blue-light"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <StartReadingTitle title={t("title")} />
        <StartReadingDescription description={t("description")} />
        <StartReadingActions signup={t("signup")} />
      </div>
    </section>
  )
}
