"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type SplitType = "equal" | "custom" | "percentage"
type SharePlatform = "whatsapp" | "twitter" | "facebook" | "email" | "sms" | "copy"

interface NewParticipant {
  name: string
  email: string | null
  phone: string | null
  user_id: string | null
}

async function findOrCreateParticipant(newParticipant: NewParticipant): Promise<any> {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  // First, try to find an existing participant by email
  if (newParticipant.email) {
    const { data: existingParticipant } = await supabase
      .from("participants")
      .select("*")
      .eq("email", newParticipant.email)
      .single()

    if (existingParticipant) {
      return existingParticipant
    }
  }

  // If no email or no existing participant found by email, try by name and phone
  const { data: existingParticipantByNamePhone } = await supabase
    .from("participants")
    .select("*")
    .eq("name", newParticipant.name)
    .eq("phone", newParticipant.phone)
    .single()

  if (existingParticipantByNamePhone) {
    return existingParticipantByNamePhone
  }

  // If no existing participant is found, create a new one
  const { data, error } = await supabase
    .from("participants")
    .insert([
      {
        name: newParticipant.name,
        email: newParticipant.email,
        phone: newParticipant.phone,
        user_id: newParticipant.user_id,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating participant:", error)
    throw new Error("Failed to create participant")
  }

  if (!data) {
    throw new Error("Failed to create participant, no data returned")
  }

  return data
}

async function addParticipantToBill(billParticipantData: any): Promise<any> {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { data, error } = await supabase.from("bill_participants").insert([billParticipantData]).select().single()

  if (error) {
    console.error("Error adding participant to bill:", error)
    throw new Error("Failed to add participant to bill")
  }

  if (!data) {
    throw new Error("Failed to add participant to bill, no data returned")
  }

  return data
}

async function checkAllParticipantsConfirmed(billId: string): Promise<boolean> {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { data, error } = await supabase.from("bill_participants").select("is_confirmed").eq("bill_id", billId)

  if (error) {
    console.error("Error fetching bill participants:", error)
    return false
  }

  if (!data) {
    return true // Consider an empty list as all confirmed
  }

  // Check if all participants have confirmed
  return data.every((participant) => participant.is_confirmed)
}

async function markBillAsComplete(billId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { error } = await supabase
    .from("bills")
    .update({ is_completed: true, completion_date: new Date().toISOString() })
    .eq("id", billId)

  if (error) {
    console.error("Error marking bill as complete:", error)
    throw new Error("Failed to mark bill as complete")
  }
}

async function updateBillParticipant(id: string, fields: { is_paid: boolean }) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { error } = await supabase.from("bill_participants").update(fields).eq("id", id)

  if (error) {
    console.error("Error updating bill participant:", error)
    throw new Error("Failed to update bill participant")
  }
}

export async function createBillWithParticipants(prevState: any, formData: FormData) {
  try {
    // Get the current user
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to create a bill" }
    }

    // Extract bill data
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const totalAmount = Number.parseFloat(formData.get("totalAmount") as string)
    const date = formData.get("date") as string
    const category = formData.get("category") as string
    const paymentMethod = formData.get("paymentMethod") as string
    const tipAmount = Number.parseFloat((formData.get("tipAmount") as string) || "0")
    const currency = (formData.get("currency") as string) || "USD"
    const splitType = formData.get("splitType") as SplitType

    // Validate required fields
    if (!title || isNaN(totalAmount) || !date) {
      return { error: "Title, amount, and date are required" }
    }

    // Create bill directly with Supabase - removing is_completed and completion_date
    const { data: bill, error: billError } = await supabase
      .from("bills")
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        total_amount: totalAmount,
        date,
        category: category || null,
        payment_method: paymentMethod || null,
        tip_amount: tipAmount || 0,
        receipt_image_url: null,
        currency,
      })
      .select()
      .single()

    if (billError) {
      console.error("Error creating bill:", billError)
      return { error: "Failed to create bill. Database error." }
    }

    if (!bill) {
      return { error: "Failed to create bill. No data returned." }
    }

    // Extract participant data
    const participantNames = formData.getAll("participantName") as string[]
    const participantEmails = formData.getAll("participantEmail") as string[]
    const participantPhones = formData.getAll("participantPhone") as string[]
    const participantAmounts = formData.getAll("participantAmount") as string[]

    // Process participants
    for (let i = 0; i < participantNames.length; i++) {
      if (!participantNames[i]) continue

      // Create or find participant
      const newParticipant: NewParticipant = {
        name: participantNames[i],
        email: participantEmails[i] || null,
        phone: participantPhones[i] || null,
        user_id: null,
      }

      // Check if this participant is a registered user
      if (newParticipant.email) {
        try {
          const { data: userData } = await supabase.auth.admin.listUsers({
            filter: {
              email: newParticipant.email,
            },
          })

          if (userData && userData.users.length > 0) {
            newParticipant.user_id = userData.users[0].id
          }
        } catch (error) {
          console.log("Error checking user email, continuing:", error)
          // Continue even if this fails
        }
      }

      const participant = await findOrCreateParticipant(newParticipant)

      // Calculate amount based on split type
      let amount = 0
      if (splitType === "equal") {
        amount = totalAmount / participantNames.filter((name) => name).length
      } else if (splitType === "custom" && participantAmounts[i]) {
        amount = Number.parseFloat(participantAmounts[i])
      } else if (splitType === "percentage" && participantAmounts[i]) {
        amount = (Number.parseFloat(participantAmounts[i]) / 100) * totalAmount
      }

      // Add participant to bill - without is_confirmed field
      await addParticipantToBill({
        bill_id: bill.id,
        participant_id: participant.id,
        amount,
        is_paid: false,
      })
    }

    revalidatePath("/")
    return { success: true, billId: bill.id }
  } catch (error) {
    console.error("Error creating bill with participants:", error)
    return { error: "Failed to create bill. Please try again." }
  }
}

export async function completeBill(id: string) {
  try {
    // Check if all participants have confirmed
    const allConfirmed = await checkAllParticipantsConfirmed(id)

    if (!allConfirmed) {
      // Get the current user to check if they're the bill creator
      const cookieStore = cookies()
      const supabase = createServerActionClient({ cookies: () => cookieStore })
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return { error: "You must be logged in to complete a bill" }
      }

      // Check if the current user is the bill creator
      const { data: bill } = await supabase.from("bills").select("user_id, title").eq("id", id).single()

      if (bill.user_id !== user.id) {
        return { error: "All participants must confirm before the bill can be completed" }
      }
    }

    await markBillAsComplete(id)
    return { success: true }
  } catch (error) {
    console.error("Error completing bill:", error)
    return { error: "Failed to complete bill" }
  }
}

export async function updateBillParticipantStatus(id: string, isPaid: boolean) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to update payment status" }
    }

    // Update the bill participant status
    await updateBillParticipant(id, { is_paid: isPaid })

    return { success: true }
  } catch (error) {
    console.error("Error updating bill participant status:", error)
    return { error: "Failed to update payment status" }
  }
}

export async function deleteBill(id: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })

    const { error } = await supabase.from("bills").delete().eq("id", id)

    if (error) {
      console.error("Error deleting bill:", error)
      return { error: "Failed to delete bill" }
    }

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting bill:", error)
    return { error: "Failed to delete bill" }
  }
}

export async function exportBillToCSV(billId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })

    // Fetch bill details with participants
    const { data: bill, error: billError } = await supabase
      .from("bills")
      .select(
        `
        *,
        participants:bill_participants(
          *,
          participant:participants(*)
        )
      `,
      )
      .eq("id", billId)
      .single()

    if (billError) {
      console.error("Error fetching bill:", billError)
      return { error: "Failed to fetch bill details" }
    }

    if (!bill) {
      return { error: "Bill not found" }
    }

    // Format data for CSV
    const csvRows = []
    const header = ["Participant Name", "Amount", "Is Paid", "Email", "Phone"]
    csvRows.push(header.join(","))

    bill.participants.forEach((participant) => {
      const values = [
        participant.participant.name,
        participant.amount,
        participant.is_paid,
        participant.participant.email,
        participant.participant.phone_number,
      ]
      csvRows.push(values.join(","))
    })

    const csvData = csvRows.join("\n")

    // Return CSV data
    return { success: true, data: csvData }
  } catch (error) {
    console.error("Error exporting bill to CSV:", error)
    return { error: "Failed to export bill to CSV" }
  }
}

export async function confirmParticipation(id: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })

    const { data, error } = await supabase
      .from("bill_participants")
      .update({ is_confirmed: true })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error confirming participation:", error)
      return { error: "Failed to confirm participation" }
    }

    revalidatePath(`/bills/${data.bill_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error confirming participation:", error)
    return { error: "Failed to confirm participation" }
  }
}

export async function respondToInvitation(id: string, status: "accepted" | "declined") {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })

    const { data, error } = await supabase
      .from("bill_participants")
      .update({ invitation_status: status, is_confirmed: status === "accepted" })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error responding to invitation:", error)
      return { error: "Failed to respond to invitation" }
    }

    revalidatePath(`/bills/${data.bill_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error responding to invitation:", error)
    return { error: "Failed to respond to invitation" }
  }
}

export async function signIn(_prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log(error)
    return { error: "Invalid credentials." }
  }

  revalidatePath("/")
  return { success: true }
}

export async function signUp(_prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.log(error)
    return { error: error.message }
  }

  // Create a participant record for the new user
  const { error: participantError } = await supabase.from("participants").insert({
    user_id: data.user?.id,
    name: data.user?.email, // Default name to the user's email
    email: data.user?.email,
  })

  if (participantError) {
    console.error("Error creating participant:", participantError)
    return { error: "Account created, but failed to create participant profile." }
  }

  revalidatePath("/")
  return { success: true }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function shareBill(billId: string, platform: SharePlatform) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient({ cookies: () => cookieStore })

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to share a bill" }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const shareUrl = `${baseUrl}/bills/${billId}`

    let encodedText = ""

    switch (platform) {
      case "whatsapp":
        encodedText = encodeURIComponent(`Check out this bill: ${shareUrl}`)
        return { shareUrl: `https://wa.me/?text=${encodedText}` }
      case "twitter":
        encodedText = encodeURIComponent(`Check out this bill: ${shareUrl}`)
        return { shareUrl: `https://twitter.com/intent/tweet?text=${encodedText}` }
      case "facebook":
        encodedText = encodeURIComponent(`Check out this bill: ${shareUrl}`)
        return { shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` }
      case "email":
        return {
          shareUrl: `mailto:?subject=Bill%20Share&body=Check%20out%20this%20bill:%20${shareUrl}`,
        }
      case "sms":
        encodedText = encodeURIComponent(`Check out this bill: ${shareUrl}`)
        return { shareUrl: `sms:?body=${encodedText}` }
      case "copy":
        return { shareUrl }
      default:
        return { error: "Invalid platform" }
    }
  } catch (error) {
    console.error("Error sharing bill:", error)
    return { error: "Failed to share bill" }
  }
}

export async function signInWithOAuth(provider: "google" | "github") {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error("Error signing in with OAuth:", error)
    return { error: error.message }
  }

  return { url: data.url }
}
