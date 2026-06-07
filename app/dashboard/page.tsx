import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { DashboardPageShell } from "@/app/dashboard/components/overview/dashboard-page-shell"
import { getPageMetadata } from "@/lib/metadata"
import { parsePageParam } from "@/lib/supabase/books/constants"
import { getBooksPage, getNovelsCount } from "@/lib/supabase/books/getBooksinfos"

type DashboardPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("dashboard")
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { q = "", page: pageParam } = await searchParams
  const query = q.trim()
  const page = parsePageParam(pageParam)

  const [{ books, totalCount }, totalNovelCount, t] = await Promise.all([
    getBooksPage({ page, query }),
    getNovelsCount(),
    getTranslations("dashboard.overview"),
  ])

  return (
    <DashboardPageShell
      title={t("title")}
      description={t("description")}
      bookCountLabel={t("bookCount", { count: totalNovelCount })}
      books={books}
      totalCount={totalCount}
      currentPage={page}
      defaultQuery={query}
      searchPlaceholder={t("searchPlaceholder")}
      searchButton={t("searchButton")}
      searchQuery={query}
    />
  )
}
