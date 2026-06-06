export const bookGridStyles = {
  root: "space-y-8",
  list: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  paginationNav: [
    "rounded-2xl border-2 border-brand-orange/20 p-4 sm:p-5",
    "bg-linear-to-br from-brand-orange/30 via-brand-orange/15 to-white/90",
    "shadow-[0_8px_32px_rgba(216,87,1,0.08)] backdrop-blur-sm",
  ].join(" "),
  paginationArrowButton: [
    "rounded-full border border-brand-blue/15 bg-white/70 text-brand-blue",
    "hover:border-brand-blue/30 hover:bg-brand-blue-light/60 hover:text-brand-blue",
    "disabled:border-transparent disabled:bg-transparent disabled:opacity-40",
  ].join(" "),
  paginationPageLink: {
    base: "size-9 rounded-full font-medium transition-colors",
    active:
      "border-brand-blue bg-brand-blue text-white hover:bg-brand-blue/90 hover:text-white",
    inactive:
      "text-brand-blue hover:bg-brand-blue-light/70 hover:text-brand-blue",
  },
  paginationJumpForm: [
    "flex items-center gap-2 rounded-full border border-brand-blue/15",
    "bg-white/70 px-3 py-1.5 shadow-sm",
  ].join(" "),
  paginationJumpInput:
    "h-7 w-14 border-brand-blue/15 bg-white text-center text-brand-blue focus-visible:border-brand-blue focus-visible:ring-brand-blue/20",
} as const
