import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function FooterBrand({ githubLabel }: { githubLabel: string }) {
  return (
    <div className="flex items-center gap-1">
      <Link
        href="/"
        className="flex items-center gap-1.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Image
          src="/img/logo.png"
          alt="Aozora Reading"
          width={24}
          height={24}
          className="size-6"
        />
        <span className="text-sm font-bold tracking-tight text-brand-blue">
          Aozora Reading
        </span>
      </Link>
      <Button
        variant="outline"
        size="icon-xs"
        className="rounded-sm hover:border-brand-green hover:bg-brand-green hover:text-foreground"
        asChild
      >
        <Link
          href="https://github.com/AozoraDev/AozoraReading"
          aria-label={githubLabel}
        >
          <Image
            src="/img/github.svg"
            alt=""
            width={12}
            height={12}
            aria-hidden
            className="size-3"
          />
        </Link>
      </Button>
    </div>
  )
}

export async function Footer() {
  const t = await getTranslations("footer")

  return (
    <footer className="w-full bg-muted/50">
      <Separator />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-0.5 px-4 py-2 sm:px-6 sm:py-2">
        <FooterBrand githubLabel={t("github")} />
        <p className="text-center text-xs text-muted-foreground">
          {t("copyright")}
        </p>
      </div>
    </footer>
  )
}
