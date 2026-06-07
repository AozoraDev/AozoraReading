import { BookOpen } from "lucide-react"

import { NovelsTableRow } from "@/app/dashboard/components/overview/dashboard-novels-table/components/novels-table-row"
import { dashboardNovelsTableStyles as styles } from "@/app/dashboard/components/overview/dashboard-novels-table/styles/styles"
import type { NovelsTableCopy } from "@/app/dashboard/components/overview/dashboard-novels-table/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"
import { cn } from "@/lib/utils"

const COLUMN_COUNT = 5

type NovelsTableProps = {
  books: BookInfo[]
  copy: NovelsTableCopy
}

function NovelsTableHeader({ copy }: { copy: NovelsTableCopy }) {
  return (
    <TableHeader>
      <TableRow className={styles.headerRow}>
        <TableHead className={styles.headCover}>
          <span className="sr-only">{copy.cover}</span>
        </TableHead>
        <TableHead className={cn(styles.headBase, styles.headNovelId)}>
          {copy.novelId}
        </TableHead>
        <TableHead className={styles.headBase}>{copy.title}</TableHead>
        <TableHead className={cn(styles.headBase, styles.headAuthor)}>
          {copy.author}
        </TableHead>
        <TableHead className={cn(styles.headBase, styles.headActions)}>
          {copy.actions}
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}

function NovelsTableEmptyState({ message }: { message: string }) {
  return (
    <TableRow className={styles.emptyRow}>
      <TableCell colSpan={COLUMN_COUNT} className={styles.emptyCell}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIconWrap}>
            <BookOpen aria-hidden className={styles.emptyIcon} />
          </div>
          <p className={styles.emptyMessage}>{message}</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function NovelsTable({ books, copy }: NovelsTableProps) {
  const isEmpty = books.length === 0

  return (
    <div className={styles.card}>
      <Table>
        <NovelsTableHeader copy={copy} />
        <TableBody>
          {isEmpty ? (
            <NovelsTableEmptyState message={copy.empty} />
          ) : (
            books.map((book) => (
              <NovelsTableRow key={book.novel_id} book={book} copy={copy} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
