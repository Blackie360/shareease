import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendBillInvitationNotificationsWithDebug } from "@/lib/supabase/notifications"

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { recipientEmail } = body

    if (!recipientEmail) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

    // Get the recipient user
    const { data: recipientUser } = await supabase.auth.admin.getUserByEmail(recipientEmail)

    if (!recipientUser?.user) {
      return NextResponse.json({ error: "Recipient user not found" }, { status: 404 })
    }

    // Get the sender's name
    const { data: senderData } = await supabase
      .from("participants")
      .select("name, email")
      .eq("user_id", user.id)
      .single()

    const senderName = senderData?.name || "Test User"
    const senderEmail = senderData?.email || user.email

    // Get the recipient's name
    const { data: recipientData } = await supabase
      .from("participants")
      .select("name")
      .eq("user_id", recipientUser.user.id)
      .single()

    const recipientName = recipientData?.name || "Recipient"

    // Test sending a notification
    const result = await sendBillInvitationNotificationsWithDebug(
      recipientUser.user.id,
      recipientEmail,
      recipientName,
      "test-bill-id",
      "test-participant-id",
      "Test Bill Invitation",
      100,
      "USD",
      new Date().toISOString(),
      senderName,
      senderEmail,
    )

    return NextResponse.json({
      success: true,
      result,
      sender: {
        id: user.id,
        email: user.email,
        name: senderName,
      },
      recipient: {
        id: recipientUser.user.id,
        email: recipientEmail,
        name: recipientName,
      },
    })
  } catch (error) {
    console.error("Error testing invitation:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}
