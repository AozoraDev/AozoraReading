import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { AddNovelPageShell } from "@/app/dashboard/add-novel/components/add-novel-page-shell"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.addNovel")

  return {
    title: t("title"),
  }
}

export default async function AddNovelPage() {
  const t = await getTranslations("dashboard.addNovel")

  return <AddNovelPageShell title={t("title")} description={t("description")} />
}
