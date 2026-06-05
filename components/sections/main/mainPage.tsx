import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"

function HeroBackground() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <Image
        src="/img/background.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-r from-white/85 via-white/60 to-white/20" />
    </div>
  )
}

function HeroTitle({
  highlight,
  rest,
}: {
  highlight: string
  rest: string
}) {
  return (
    <h1
      id="hero-heading"
      className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
    >
      <span className="text-brand-blue">{highlight}</span>
      {rest}
    </h1>
  )
}

function HeroDescription({ description }: { description: string }) {
  return (
    <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
      {description}
    </p>
  )
}

function HeroActions({
  exploreLibrary,
  howItWorks,
}: {
  exploreLibrary: string
  howItWorks: string
}) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <Button variant="brandCta" size="pill" asChild>
        <Link href="/library">
          {exploreLibrary}
          <ArrowRight aria-hidden />
        </Link>
      </Button>

      <Button variant="brandOutlineCta" size="pill" asChild>
        <Link href="/how-it-works">{howItWorks}</Link>
      </Button>
    </div>
  )
}

export async function MainPage() {
  const t = await getTranslations("hero")

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden"
    >
      <HeroBackground />

      <div className="relative mx-auto flex min-h-[min(85vh,720px)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
        <HeroTitle highlight={t("titleHighlight")} rest={t("titleRest")} />
        <HeroDescription description={t("description")} />
        <HeroActions
          exploreLibrary={t("exploreLibrary")}
          howItWorks={t("howItWorks")}
        />
      </div>
    </section>
  )
}
