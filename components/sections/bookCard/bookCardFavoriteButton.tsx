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
  const [isPending, setIsPending] = useState(false)

  async function handleToggle() {
    if (!isLoggedIn || !uid) {
      toast.error(t("loginToFavorite"))
      return
    }

    const nextFavorited = !isFavorited
    const novelIdValue = Number(novelId)

    setIsPending(true)
    try {
      // 创建 Supabase 客户端
      const supabase = createClient()
      // 如果收藏状态为已收藏，添加收藏
      // 如果收藏状态为未收藏，添加收藏
      const { error } = nextFavorited
        ? await supabase
            .from("favorites")
            .insert({ uid, novel_id: novelIdValue })
        : await supabase
            .from("favorites")
            .delete()
            .eq("uid", uid)
            .eq("novel_id", novelIdValue)

      // 如果添加或删除失败，显示错误 toast
      if (error) {
        console.error("Toggle favorite failed:", error)
        toast.error(t("favoriteError"))
        return
      }

      // 设置收藏状态
      setIsFavorited(nextFavorited)
      // 调用 onFavoriteChange 回调函数
      onFavoriteChange?.(nextFavorited)
    } finally {
      // 设置正在提交状态为 false
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
