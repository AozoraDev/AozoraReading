import Image from "next/image"

import type { TranslateFn } from "@/app/login/types"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LoginHeader({ t }: { t: TranslateFn }) {
  return (
    <CardHeader className="text-center">
      <Image
        src="/img/logo.png"
        alt="Aozora Reading"
        width={40}
        height={40}
        className="mx-auto block size-10 sm:size-12"
        priority
      />
      <CardTitle className="text-xl text-brand-blue">
        {t("login.title")}
      </CardTitle>
      <CardDescription>{t("login.description")}</CardDescription>
    </CardHeader>
  )
}
