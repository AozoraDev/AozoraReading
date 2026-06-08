"use client"

import { useState } from "react"

import { bookGridStyles } from "@/components/sections/bookGrid/styles/styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type JumpNumberFormProps = {
  id: string
  current: number
  max: number
  label: string
  placeholder: string
  submitLabel: string
  onJump: (value: number) => void
}

export function JumpNumberForm({
  id,
  current,
  max,
  label,
  placeholder,
  submitLabel,
  onJump,
}: JumpNumberFormProps) {
  const [jumpInput, setJumpInput] = useState(String(current))

  function handleJumpSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const value = Number.parseInt(jumpInput, 10)
    if (Number.isNaN(value)) {
      return
    }

    onJump(value)
  }

  return (
    <form
      onSubmit={handleJumpSubmit}
      className={bookGridStyles.paginationJumpForm}
    >
      <label
        htmlFor={id}
        className="text-xs font-medium whitespace-nowrap text-brand-blue/80"
      >
        {label}
      </label>
      <Input
        id={id}
        type="number"
        min={1}
        max={max}
        value={jumpInput}
        onChange={(event) => setJumpInput(event.target.value)}
        placeholder={placeholder}
        className={bookGridStyles.paginationJumpInput}
      />
      <Button type="submit" variant="brand" size="sm" className="h-7 px-3">
        {submitLabel}
      </Button>
    </form>
  )
}
