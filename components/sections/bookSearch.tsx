import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export type BookSearchProps = {
  searchPlaceholder: string
  searchButton: string
}

export function BookSearch({
  searchPlaceholder,
  searchButton,
}: BookSearchProps) {
  return (
    <div className="mb-8 flex max-w-md gap-2">
      <InputGroup className="min-w-0 flex-1">
        <InputGroupInput
          type="search"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
        <InputGroupAddon align="inline-start">
          <Search className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <Button type="button" variant="brand" className="shrink-0 rounded-lg">
        {searchButton}
      </Button>
    </div>
  )
}
