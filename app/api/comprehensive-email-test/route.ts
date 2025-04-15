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
    const {
      recipientEmail,
      senderEmail = "codedblood22@gmail.com",
      subject = "ShareEase Comprehensive Email Test",
      message,
      testType = "standard", // standard or gmail
    } = body

    if (!recipientEmail) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

    // In Next.js environment, we can't use actual SMTP connections
    // So we'll simulate the email sending process

    // Generate a fake message ID
    const messageId = `<${Math.random().toString(36).substring(2, 15)}@shareease.app>`

    // Format the sender address based on test type
    let fromAddress
    if (testType === "gmail") {
      fromAddress = `"ShareEase via ${senderEmail.split("@")[0]}" <codedblood22@gmail.com>`
    } else {
      fromAddress = `"ShareEase" <${process.env.EMAIL_FROM || "noreply@shareease.app"}>`
    }

    // Log the simulated email
    console.log(`[SIMULATED EMAIL]
From: ${fromAddress}
Reply-To: ${senderEmail}
To: ${recipientEmail}
Subject: ${subject}
Test Type: ${testType}
Timestamp: ${new Date().toISOString()}
Body: ${message ? "Custom HTML message" : "Default test message"}
    `)

    // Store the test in the database for reference (optional)
    const { data: logData, error: logError } = await supabase
      .from("email_test_logs")
      .insert({
        user_id: user.id,
        recipient_email: recipientEmail,
        sender_email: senderEmail,
        subject,
        test_type: testType,
        status: "simulated",
        timestamp: new Date().toISOString(),
      })
      .select()

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
        testType,
        timestamp: new Date().toISOString(),
        simulatedOnly: true,
        message: "Email simulation successful. In a production environment, this would send a real email.",
      },
    })
  } catch (error) {
    console.error("Error simulating email:", error)
    return NextResponse.json(
      {
        error: "Failed to simulate email",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
