"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { NewParticipant, SharePlatform, SplitType } from "@/types"
import {
  findOrCreateParticipant,
  addParticipantToBill,
  updateBillParticipant,
  markBillAsComplete,
  confirmBillParticipant,
  checkAllParticipantsConfirmed,
} from "./supabase/database"
import { revalidatePath } from "next/cache"

// Define the deployed URL
const DEPLOYED_URL = "https://bills2025.vercel.app"

// Auth actions (already implemented)
export async function signIn(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    // Return success instead of redirecting directly
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Update the signInWithOAuth function to use the deployed URL
export async function signInWithOAuth(provider: "google" | "github") {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Use the hardcoded deployed URL for the redirect
    const redirectTo = `${DEPLOYED_URL}/auth/callback`

    console.log(`OAuth redirect URL: ${redirectTo}`)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectTo,
        // Add scopes for better profile access
        scopes: provider === "google" ? "email profile" : "user:email",
      },
    })

    if (error) {
      console.error(`${provider} OAuth error:`, error)
      return { error: error.message }
    }

    if (!data.url) {
      return { error: "Failed to get authentication URL" }
    }

    return { url: data.url }
  } catch (error) {
    console.error(`${provider} login error:`, error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Use the hardcoded deployed URL for the redirect
    const redirectTo = `${DEPLOYED_URL}/auth/callback`

    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        // Email confirmation is disabled on Supabase dashboard
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Since email confirmation is disabled, we can return success directly
    return { success: true }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/")
}

// Bill actions
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
        // Remove these fields to prevent the error
        // is_completed: false,
        // completion_date: null,
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
          const { data: userData } = await supabase.auth.admin.getUserByEmail(newParticipant.email)
          if (userData?.user) {
            newParticipant.user_id = userData.user.id
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

export async function updateBillParticipantStatus(id: string, isPaid: boolean) {
  try {
    await updateBillParticipant(id, { is_paid: isPaid })
    return { success: true }
  } catch (error) {
    console.error("Error updating bill participant status:", error)
    return { error: "Failed to update payment status" }
  }
}

export async function confirmParticipation(id: string) {
  try {
    await confirmBillParticipant(id)
    return { success: true }
  } catch (error) {
    console.error("Error confirming participation:", error)
    return { error: "Failed to confirm participation" }
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
      const { data: bill } = await supabase.from("bills").select("user_id").eq("id", id).single()

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

export async function exportBillToCSV(billId: string) {
  try {
    // This would typically generate a CSV file for download
    // For now, we'll just return success
    return { success: true }
  } catch (error) {
    console.error("Error exporting bill:", error)
    return { error: "Failed to export bill" }
  }
}

// Update the shareBill function to use the deployed URL
export async function shareBill(billId: string, platform: SharePlatform) {
  try {
    const shareUrl = `${DEPLOYED_URL}/bills/${billId}`

    // Generate the appropriate share URL based on the platform
    let shareLink = ""

    switch (platform) {
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(`Check out this bill: ${shareUrl}`)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this bill: ${shareUrl}`)}`
        break
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent("Bill Shared via ShareEase")}&body=${encodeURIComponent(`Check out this bill: ${shareUrl}`)}`
        break
      case "sms":
        shareLink = `sms:?body=${encodeURIComponent(`Check out this bill: ${shareUrl}`)}`
        break
      case "instagram":
        // Instagram doesn't support direct sharing via URL, so we'll just return the URL to copy
        shareLink = shareUrl
        break
      case "telegram":
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out this bill on ShareEase")}`
        break
      case "copy":
        // For copy, we'll just return the URL and handle the copying on the client
        shareLink = shareUrl
        break
    }

    return { success: true, shareUrl: shareLink }
  } catch (error) {
    console.error("Error sharing bill:", error)
    return { error: "Failed to share bill" }
  }
}

export async function deleteBill(id: string) {
  try {
    const supabase = createServerActionClient({ cookies })
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
