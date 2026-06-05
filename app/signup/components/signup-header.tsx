import Image from "next/image"

import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { TranslateFn } from "@/app/signup/types"

// 渲染注册页头，包含 Logo、标题与描述
export function SignupHeader({ t }: { t: TranslateFn }) {
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
        {t("signUp.title")}
      </CardTitle>
      <CardDescription>{t("signUp.description")}</CardDescription>
    </CardHeader>
  )
}
