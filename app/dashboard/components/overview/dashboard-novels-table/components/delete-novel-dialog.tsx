"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteNovelAction } from "@/app/dashboard/server/deleteNovelAction"
import { dashboardNovelsTableStyles as styles } from "@/app/dashboard/components/overview/dashboard-novels-table/styles/styles"
import type { NovelsTableCopy } from "@/app/dashboard/components/overview/dashboard-novels-table/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { BookInfo } from "@/lib/supabase/books/getBooksinfos"

type DeleteNovelDialogProps = {
  book: BookInfo
  copy: Pick<
    NovelsTableCopy,
    "delete" | "deleteConfirmTitle" | "deleteConfirmDescription" | "cancel" | "confirm"
  >
}

export function DeleteNovelDialog({ book, copy }: DeleteNovelDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteNovelAction(book.novel_id, book.cover_url)

      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        router.refresh()
        return
      }

      toast.error(result.message)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className={styles.deleteButton}
        >
          <Trash2 aria-hidden className="size-3.5" />
          {copy.delete}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.deleteConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {copy.deleteConfirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{copy.cancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              handleConfirm()
            }}
          >
            {copy.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
