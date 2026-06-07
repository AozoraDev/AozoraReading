export const dashboardNovelsTableStyles = {
  root: "space-y-6",
  card: [
    "overflow-hidden rounded-xl border border-brand-blue-light/70 bg-card",
    "shadow-[0_8px_32px_rgba(0,89,187,0.06)] ring-1 ring-foreground/5",
  ].join(" "),
  headerRow: [
    "border-brand-blue-light/50 bg-linear-to-r from-brand-blue-light/50",
    "via-brand-green-light/30 to-transparent hover:bg-transparent",
  ].join(" "),
  headBase:
    "h-11 px-4 text-xs font-semibold tracking-wide text-brand-blue uppercase",
  headCover: "w-[76px] pl-4",
  headAuthor: "hidden md:table-cell",
  headActions: "w-28 text-right",
  bodyRow:
    "group border-brand-blue-light/30 transition-colors hover:bg-brand-blue-light/20",
  cellCover: "py-3 pl-4",
  cellDefault: "px-4 py-3",
  cellActions: "px-4 py-3 text-right",
  coverFrame: [
    "relative size-12 overflow-hidden rounded-md ring-1 ring-brand-blue-light/80",
    "transition-shadow group-hover:ring-brand-blue/30",
  ].join(" "),
  title: "font-medium text-brand-blue",
  author: "text-muted-foreground",
  deleteButton: "gap-1.5",
  emptyRow: "hover:bg-transparent",
  emptyCell: "py-16 text-center",
  emptyContent: "mx-auto flex max-w-xs flex-col items-center gap-3",
  emptyIconWrap:
    "flex size-12 items-center justify-center rounded-full bg-brand-blue-light/60",
  emptyIcon: "size-6 text-brand-blue/60",
  emptyMessage: "text-sm font-medium text-foreground",
} as const
