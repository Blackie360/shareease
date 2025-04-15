import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user's participant record
    const { data: participant, error: participantError } = await supabase
      .from("participants")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (participantError) {
      return NextResponse.json({ error: "Participant not found", details: participantError }, { status: 404 })
    }

    // Get bill participants for this user
    const { data: billParticipants, error: billParticipantsError } = await supabase
      .from("bill_participants")
      .select(`
        *,
        bills(*)
      `)
      .eq("participant_id", participant.id)

    if (billParticipantsError) {
      return NextResponse.json(
        { error: "Error fetching bill participants", details: billParticipantsError },
        { status: 500 },
      )
    }

    // Get notifications for this user
    const { data: notifications, error: notificationsError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)

    if (notificationsError) {
      return NextResponse.json({ error: "Error fetching notifications", details: notificationsError }, { status: 500 })
    }

    // Get notification preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from("user_notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      participant,
      billParticipants,
      notifications,
      preferences: preferences || "No preferences set",
      notificationPreferencesError: preferencesError ? preferencesError.message : null,
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
