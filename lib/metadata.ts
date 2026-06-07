import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function getRootMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata")

  return {
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
  }
}

type PageMetadataKey =
  | "library"
  | "favorites"
  | "dashboard"
  | "howItWorks"
  | "login"
  | "signup"
  | "forget"

export async function getPageMetadata(page: PageMetadataKey): Promise<Metadata> {
  const t = await getTranslations("metadata")

  return {
    title: t(`pages.${page}`),
  }
}
