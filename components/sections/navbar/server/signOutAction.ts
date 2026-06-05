"use server"

import { apiSignOut } from "@/lib/supabase/auth/signOut"

export async function signOutAction(): Promise<void> {
  await apiSignOut()
}
