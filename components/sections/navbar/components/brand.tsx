import Image from "next/image"
import Link from "next/link"

import { navbarStyles } from "@/components/sections/navbar/styles/styles"

export function NavbarBrand() {
  return (
    <Link href="/" className={navbarStyles.brandLink}>
      <Image
        src="/img/logo.png"
        alt="Aozora Reading"
        width={32}
        height={32}
        className={navbarStyles.brandLogo}
        priority
      />
      <span className={navbarStyles.brandTitle}>Aozora Reading</span>
    </Link>
  )
}
