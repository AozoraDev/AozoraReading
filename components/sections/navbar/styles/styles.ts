import { cva } from "class-variance-authority"

const navLinkActive =
  "bg-brand-blue text-white hover:bg-brand-blue/90 hover:text-white focus:bg-brand-blue/90 data-active:bg-brand-blue data-active:text-white data-active:hover:bg-brand-blue/90 data-active:focus:bg-brand-blue/90"

export const desktopNavLinkVariants = cva(
  "h-9 whitespace-nowrap px-3 font-medium",
  {
    variants: {
      active: {
        true: navLinkActive,
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

export const mobileNavLinkVariants = cva(
  "flex h-10 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium",
  {
    variants: {
      active: {
        true: navLinkActive,
        false: "text-foreground hover:bg-muted",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

export const navbarStyles = {
  header:
    "sticky top-0 z-50 border-b border-border/80 bg-brand-blue-light shadow-sm",
  container:
    "mx-auto flex h-14 min-w-0 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6",
  desktopNavWrapper: "hidden min-w-0 flex-1 lg:block",
  actions: "ml-auto flex shrink-0 items-center gap-2 sm:gap-4",
  brandLink:
    "flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
  brandLogo: "size-8",
  brandTitle:
    "hidden text-lg font-semibold tracking-tight text-brand-blue sm:inline",
  navMenu: "max-w-none flex-1 justify-start",
  navMenuList: "justify-start gap-1",
  loginButton:
    "shrink-0 border border-brand-blue bg-brand-blue px-3 font-medium text-white hover:border-brand-blue hover:bg-white hover:text-brand-blue focus-visible:border-brand-blue",
  userMenuTrigger:
    "h-9 max-w-44 shrink-0 gap-1 border border-brand-green bg-brand-green px-3 font-medium text-foreground hover:border-brand-green hover:bg-white hover:text-brand-green focus:bg-brand-green focus:text-foreground data-open:bg-brand-green data-open:text-foreground data-popup-open:bg-brand-green data-popup-open:text-foreground",
  userMenuContent: "absolute right-0 left-auto z-50 min-w-36 p-1",
  logoutButton:
    "w-full justify-start hover:bg-brand-green hover:text-foreground active:translate-y-0",
  mobileToggle:
    "shrink-0 border-brand-blue text-brand-blue lg:hidden",
  mobileMenu:
    "border-t border-border/80 bg-brand-blue-light px-4 py-3 lg:hidden",
  mobileMenuList: "flex flex-col gap-1",
} as const
