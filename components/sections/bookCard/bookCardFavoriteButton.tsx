"use client"

import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuthUser } from "@/lib/supabase/auth/hook/use-auth-user"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type BookCardFavoriteButtonProps = {
  novelId: string
  initialIsFavorited: boolean
  favoriteLabel: string
  onFavoriteChange?: (isFavorited: boolean) => void
}

export function BookCardFavoriteButton({
  novelId,
  initialIsFavorited,
  favoriteLabel,
  onFavoriteChange,
}: BookCardFavoriteButtonProps) {
  const t = useTranslations("bookCard")
  const { uid, isLoggedIn } = useAuthUser()
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [prevInitialIsFavorited, setPrevInitialIsFavorited] =
    useState(initialIsFavorited)
  const [isPending, setIsPending] = useState(false)

  if (initialIsFavorited !== prevInitialIsFavorited) {
    setPrevInitialIsFavorited(initialIsFavorited)
    setIsFavorited(initialIsFavorited)
  }

  async function handleToggle() {
    if (!isLoggedIn || !uid) {
      toast.error(t("loginToFavorite"))
      return
    }

    const nextFavorited = !isFavorited
    const novelIdValue = Number(novelId)

    setIsPending(true)
    try {
      const supabase = createClient()
      const { error } = nextFavorited
        ? await supabase
            .from("favorites")
            .insert({ uid, novel_id: novelIdValue })
        : await supabase
            .from("favorites")
            .delete()
            .eq("uid", uid)
            .eq("novel_id", novelIdValue)

      if (error) {
        console.error("Toggle favorite failed:", error)
        toast.error(t("favoriteError"))
        return
      }

      setIsFavorited(nextFavorited)
      onFavoriteChange?.(nextFavorited)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="brandOutlineCta"
      size="icon-lg"
      aria-label={favoriteLabel}
      aria-pressed={isFavorited}
      disabled={isPending}
      onClick={handleToggle}
      className={cn(
        "shrink-0 border-brand-blue-light bg-white/30 [&_svg]:size-5",
        isFavorited && "border-red-400 bg-red-50/80 hover:border-red-500 hover:bg-red-100"
      )}
    >
      <Heart
        className={cn(
          isFavorited ? "fill-red-500 text-red-500" : "fill-none"
        )}
        strokeWidth={2}
      />
    </Button>
  )
}
