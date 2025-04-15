import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
    const { recipientEmail, senderEmail = "codedblood22@gmail.com", subject, message } = body

    if (!recipientEmail) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

    // Format the sender address with "ShareEase via" prefix
    const fromAddress = `"ShareEase via ${senderEmail.split("@")[0]}" <codedblood22@gmail.com>`

    // Generate a fake message ID
    const messageId = `<${Math.random().toString(36).substring(2, 15)}@gmail.com>`

    // Log the simulated email
    console.log(`[SIMULATED GMAIL EMAIL]
From: ${fromAddress}
Reply-To: ${senderEmail}
To: ${recipientEmail}
Subject: ${subject || "ShareEase Email Test"}
Credentials: codedblood22@gmail.com / axrl dldo tloq eeen
Timestamp: ${new Date().toISOString()}
Body: ${message ? "Custom HTML message" : "Default test message"}
    `)

    // Store the test in the database for reference (optional)
    const { error: logError } = await supabase.from("email_test_logs").insert({
      user_id: user.id,
      recipient_email: recipientEmail,
      sender_email: senderEmail,
      subject: subject || "ShareEase Email Test",
      test_type: "gmail_dedicated",
      status: "simulated",
      timestamp: new Date().toISOString(),
    })

    if (logError) {
      console.warn("Could not log email test:", logError)
    }

    return NextResponse.json({
      success: true,
      messageId,
      details: {
        from: fromAddress,
        replyTo: senderEmail,
        to: recipientEmail,
        simulatedOnly: true,
        message:
          "Email simulation successful. In a production environment, this would send a real email using the Gmail credentials.",
      },
    })
  } catch (error) {
    console.error("Error simulating test email:", error)
    return NextResponse.json(
      {
        error: "Failed to simulate email",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
