import { readFile } from "fs/promises"
import path from "path"
import type { Metadata } from "next"
import { getLocale } from "next-intl/server"
import ReactMarkdown from "react-markdown"

import { Card, CardContent } from "@/components/ui/card"
import type { Locale } from "@/i18n/config"
import { getPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("howItWorks")
}

export default async function HowItWorksPage() {
  const locale = (await getLocale()) as Locale
  const content = await readFile(
    path.join(process.cwd(), "public", "markdown", `how-it-works.${locale}.md`),
    "utf-8",
  )

  return (
    <div className="py-8 sm:py-12">
      <Card className="bg-muted/50 shadow-none">
        <CardContent className="markdown-content py-6 sm:py-8">
          <ReactMarkdown>{content}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  )
}
