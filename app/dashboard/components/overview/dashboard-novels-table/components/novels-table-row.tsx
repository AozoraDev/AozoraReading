import Image from "next/image"

import { DeleteNovelDialog } from "@/app/dashboard/components/overview/dashboard-novels-table/components/delete-novel-dialog"
import { dashboardNovelsTableStyles as styles } from "@/app/dashboard/components/overview/dashboard-novels-table/styles/styles"
import type { NovelsTableCopy } from "@/app/dashboard/components/overview/dashboard-novels-table/types"
import { TableCell, TableRow } from "@/components/ui/table"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"
import { getCoverUrl } from "@/lib/supabase/books/getcover"
import { cn } from "@/lib/utils"

const TEXT_TRUNCATE_LENGTH = 6

function truncateText(text: string, maxLength = TEXT_TRUNCATE_LENGTH): string {
  const chars = [...text]
  if (chars.length <= maxLength) return text
  return `${chars.slice(0, maxLength).join("")}...`
}

function TruncatedText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <span className={className} title={text}>
      {truncateText(text)}
    </span>
  )
}

type NovelsTableRowProps = {
  book: BookInfo
  copy: NovelsTableCopy
}

export function NovelsTableRow({ book, copy }: NovelsTableRowProps) {
  return (
    <TableRow className={styles.bodyRow}>
      <TableCell className={styles.cellCover}>
        <div className={styles.coverFrame}>
          <Image
            src={getCoverUrl(book.cover_url)}
            alt=""
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      </TableCell>
      <TableCell className={styles.cellDefault}>
        <TruncatedText text={book.title} className={styles.title} />
      </TableCell>
      <TableCell className={cn(styles.cellDefault, styles.headAuthor)}>
        <TruncatedText text={book.author} className={styles.author} />
      </TableCell>
      <TableCell className={styles.cellActions}>
        <DeleteNovelDialog
          book={book}
          copy={{
            delete: copy.delete,
            deleteConfirmTitle: copy.deleteConfirmTitle,
            deleteConfirmDescription: copy.deleteConfirmDescription,
            cancel: copy.cancel,
            confirm: copy.confirm,
          }}
        />
      </TableCell>
    </TableRow>
  )
}
