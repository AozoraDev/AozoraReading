import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { AddChapterPageShell } from "@/app/dashboard/add-chapter/components/add-chapter-page-shell"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.addChapter")

  return {
    title: t("title"),
  }
}

export default async function AddChapterPage() {
  const t = await getTranslations("dashboard.addChapter")

  return <AddChapterPageShell title={t("title")} description={t("description")} />
}
