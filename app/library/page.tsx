import { Search } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { BookCard } from "@/components/sections/bookCard"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { getBooksinfos } from "@/lib/supabase/books/getBooksinfos"

export default async function LibraryPage() {
  const [books, tNav, tBookCard, tLibrary] = await Promise.all([
    getBooksinfos(),
    getTranslations("nav"),
    getTranslations("bookCard"),
    getTranslations("library"),
  ])

  return (
    <div className="py-8 sm:py-12">
      <h1 className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
        {tNav("library")}
      </h1>

      <InputGroup className="mb-8 max-w-md">
        <InputGroupInput
          type="search"
          placeholder={tLibrary("searchPlaceholder")}
          aria-label={tLibrary("searchPlaceholder")}
        />
        <InputGroupAddon align="inline-start">
          <Search className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book, index) => (
          <li key={`${book.title}-${index}`}>
            <BookCard
              {...book}
              startReadingLabel={tBookCard("startReading")}
              favoriteLabel={tBookCard("favorite")}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
