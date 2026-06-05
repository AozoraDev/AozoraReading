import { createClient } from "@/lib/supabase/server"

export type BookInfo = {
  title: string
  author: string
  cover_url: string
}

export async function getBooksinfos(): Promise<BookInfo[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("novels")
    .select("title, author, cover_url")

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(({ title, author, cover_url }) => ({
    title,
    author,
    cover_url,
  }))
}
