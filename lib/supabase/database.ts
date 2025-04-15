"use server"

import { createClient } from "@/lib/supabase/server"
import type {
  Bill,
  BillParticipant,
  BillWithParticipants,
  NewBill,
  NewBillParticipant,
  NewParticipant,
  Participant,
} from "@/types"
import { revalidatePath } from "next/cache"

// Bills
export async function getBills() {
  const supabase = createClient()

  const { data, error } = await supabase.from("bills").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching bills:", error)
    throw new Error("Failed to fetch bills")
  }

  return data as Bill[]
}

export async function getBillsForUser(userId: string) {
  const supabase = createClient()

  // Get bills created by the user
  const { data: createdBills, error: createdError } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (createdError) {
    console.error("Error fetching created bills:", createdError)
    throw new Error("Failed to fetch created bills")
  }

  // Get bills where the user is a participant
  const { data: participantData, error: participantError } = await supabase
    .from("participants")
    .select("id")
    .eq("user_id", userId)
    .single()

  if (participantError && participantError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" which is fine - user might not be a participant in any bills
    console.error("Error fetching participant:", participantError)
    throw new Error("Failed to fetch participant data")
  }

  let participatedBills: Bill[] = []

  if (participantData) {
    const { data: billParticipants, error: billParticipantsError } = await supabase
      .from("bill_participants")
      .select("bill_id")
      .eq("participant_id", participantData.id)

    if (billParticipantsError) {
      console.error("Error fetching bill participants:", billParticipantsError)
      throw new Error("Failed to fetch bill participants")
    }

    if (billParticipants.length > 0) {
      const billIds = billParticipants.map((bp) => bp.bill_id)
      const { data: bills, error: billsError } = await supabase
        .from("bills")
        .select("*")
        .in("id", billIds)
        .order("date", { ascending: false })

      if (billsError) {
        console.error("Error fetching participated bills:", billsError)
        throw new Error("Failed to fetch participated bills")
      }

      participatedBills = bills as Bill[]
    }
  }

  // Combine and deduplicate bills
  const allBills = [...createdBills, ...participatedBills]
  const uniqueBills = Array.from(new Map(allBills.map((bill) => [bill.id, bill])).values())

  return uniqueBills as Bill[]
}

export async function getBillById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bills")
    .select(`
      *,
      participants:bill_participants(
        *,
        participant:participants(*)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching bill:", error)
    throw new Error("Failed to fetch bill")
  }

  return data as BillWithParticipants
}

export async function createBill(bill: NewBill) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bills")
    .insert({
      ...bill,
      is_completed: false,
      completion_date: null,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating bill:", error)
    throw new Error("Failed to create bill")
  }

  revalidatePath("/")
  return data as Bill
}

export async function updateBill(id: string, bill: Partial<Bill>) {
  const supabase = createClient()

  const { data, error } = await supabase.from("bills").update(bill).eq("id", id).select().single()

  if (error) {
    console.error("Error updating bill:", error)
    throw new Error("Failed to update bill")
  }

  revalidatePath(`/bills/${id}`)
  revalidatePath("/")
  return data as Bill
}

export async function markBillAsComplete(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bills")
    .update({
      is_completed: true,
      completion_date: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error marking bill as complete:", error)
    throw new Error("Failed to mark bill as complete")
  }

  revalidatePath(`/bills/${id}`)
  revalidatePath("/")
  return data as Bill
}

export async function deleteBill(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("bills").delete().eq("id", id)

  if (error) {
    console.error("Error deleting bill:", error)
    throw new Error("Failed to delete bill")
  }

  revalidatePath("/")
}

// Participants
export async function getParticipants() {
  const supabase = createClient()

  const { data, error } = await supabase.from("participants").select("*").order("name")

  if (error) {
    console.error("Error fetching participants:", error)
    throw new Error("Failed to fetch participants")
  }

  return data as Participant[]
}

export async function createParticipant(participant: NewParticipant) {
  const supabase = createClient()

  const { data, error } = await supabase.from("participants").insert(participant).select().single()

  if (error) {
    console.error("Error creating participant:", error)
    throw new Error("Failed to create participant")
  }

  return data as Participant
}

export async function findOrCreateParticipant(participant: NewParticipant) {
  const supabase = createClient()

  // Try to find existing participant by email or phone
  let query = supabase.from("participants").select("*")

  if (participant.email) {
    query = query.eq("email", participant.email)
  } else if (participant.phone) {
    query = query.eq("phone", participant.phone)
  } else {
    // If no email or phone, just create a new participant
    return createParticipant(participant)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error finding participant:", error)
    throw new Error("Failed to find participant")
  }

  if (data && data.length > 0) {
    return data[0] as Participant
  }

  // If no existing participant found, create a new one
  return createParticipant(participant)
}

// Bill Participants
export async function addParticipantToBill(billParticipant: NewBillParticipant) {
  const supabase = createClient()

  // Remove the is_confirmed field from the insert
  const { data, error } = await supabase.from("bill_participants").insert(billParticipant).select().single()

  if (error) {
    console.error("Error adding participant to bill:", error)
    throw new Error("Failed to add participant to bill")
  }

  revalidatePath(`/bills/${billParticipant.bill_id}`)
  return data as BillParticipant
}

export async function updateBillParticipant(id: string, billParticipant: Partial<BillParticipant>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bill_participants")
    .update(billParticipant)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating bill participant:", error)
    throw new Error("Failed to update bill participant")
  }

  revalidatePath(`/bills/${data.bill_id}`)
  return data as BillParticipant
}

export async function confirmBillParticipant(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bill_participants")
    .update({ is_confirmed: true })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error confirming bill participant:", error)
    throw new Error("Failed to confirm bill participant")
  }

  revalidatePath(`/bills/${data.bill_id}`)
  return data as BillParticipant
}

export async function removeBillParticipant(id: string) {
  const supabase = createClient()

  // First get the bill_id for revalidation
  const { data: billParticipant } = await supabase.from("bill_participants").select("bill_id").eq("id", id).single()

  const { error } = await supabase.from("bill_participants").delete().eq("id", id)

  if (error) {
    console.error("Error removing bill participant:", error)
    throw new Error("Failed to remove bill participant")
  }

  if (billParticipant) {
    revalidatePath(`/bills/${billParticipant.bill_id}`)
  }
}

// Search and filter
export async function searchBills(query: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error searching bills:", error)
    throw new Error("Failed to search bills")
  }

  return data as Bill[]
}

export async function filterBillsByCategory(category: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("category", category)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error filtering bills:", error)
    throw new Error("Failed to filter bills")
  }

  return data as Bill[]
}

export async function filterBillsByDateRange(startDate: string, endDate: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error filtering bills by date:", error)
    throw new Error("Failed to filter bills by date")
  }

  return data as Bill[]
}

export async function checkAllParticipantsConfirmed(billId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("bill_participants").select("is_confirmed").eq("bill_id", billId)

  if (error) {
    console.error("Error checking participants confirmation:", error)
    throw new Error("Failed to check participants confirmation")
  }

  return data.every((participant) => participant.is_confirmed)
}

export async function getUnconfirmedParticipants(billId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bill_participants")
    .select(`
      *,
      participant:participants(*)
    `)
    .eq("bill_id", billId)
    .eq("is_confirmed", false)

  if (error) {
    console.error("Error fetching un-confirmed participants:", error)
    throw new Error("Failed to fetch un-confirmed participants")
  }

  return data as (BillParticipant & { participant: Participant })[]
}
