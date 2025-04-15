"use server"

import { createClient } from "@/lib/supabase/server"
import type { Bill } from "@/types"

export async function searchBillsRealTime(query: string): Promise<Bill[]> {
  if (!query || query.trim() === "") {
    return []
  }

  const supabase = createClient()

  // Search across multiple fields with a minimum query length of 2 characters
  if (query.trim().length < 2) {
    return []
  }

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .order("date", { ascending: false })
    .limit(10) // Limit results for better performance

  if (error) {
    console.error("Error searching bills:", error)
    return []
  }

  return data as Bill[]
}
