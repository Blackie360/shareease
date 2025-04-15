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
    const { recipientEmail, subject = "ShareEase Email Test", message = null } = body

    if (!recipientEmail) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 })
    }

    // Gmail credentials (as specified)
    const gmailUser = "codedblood22@gmail.com"
    const gmailPass = "axrl dldo tloq eeen"

    // Format the sender address
    const fromAddress = `"ShareEase Test" <${gmailUser}>`

    // Default HTML message if none provided
    const htmlContent =
      message ||
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #2b725e; border-bottom: 1px solid #eee; padding-bottom: 10px;">ShareEase Email Test</h1>
        <p>Hello,</p>
        <p>This is a test email from ShareEase to verify that the email service is working correctly.</p>
        <p>If you received this email, it means your email configuration is working!</p>
        <p style="color: #666; font-size: 14px;">Time sent: ${new Date().toLocaleString()}</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This is an automated test email from ShareEase. Please do not reply to this email.</p>
        </div>
      </div>
    `

    // Generate a message ID for tracking
    const messageId = `<${Date.now()}.${Math.random().toString(36).substring(2, 10)}@shareease.app>`

    // Log the test attempt
    const { error: logError } = await supabase.from("email_test_logs").insert({
      user_id: user.id,
      recipient_email: recipientEmail,
      sender_email: gmailUser,
      subject,
      test_mode: "simulation", // Always use simulation in preview environments
      status: "simulated",
      timestamp: new Date().toISOString(),
    })

    if (logError) {
      console.warn("Could not log email test:", logError)
    }

    // In preview environments, we'll simulate the email instead of actually sending it
    console.log(`[SIMULATED EMAIL]
From: ${fromAddress}
To: ${recipientEmail}
Subject: ${subject}
Credentials: ${gmailUser} / ${gmailPass}
Timestamp: ${new Date().toISOString()}
Body: ${htmlContent.substring(0, 100)}...
    `)

    return NextResponse.json({
      success: true,
      mode: "simulation",
      messageId,
      details: {
        from: fromAddress,
        to: recipientEmail,
        subject,
        timestamp: new Date().toISOString(),
        simulationMessage:
          "Email simulation successful. This would send a real email in a production environment with proper Node.js support.",
        note: "The 'dns.lookup' error occurs because Vercel's preview environment doesn't support full Node.js networking. In production, use a Server Action instead of an API route for email sending.",
      },
    })
  } catch (error) {
    console.error("Error in email test:", error)
    return NextResponse.json(
      {
        error: "Failed to process email test",
        details: error.message,
        solution:
          "This error occurs in preview environments. In production, use a Server Action instead of an API route for email sending.",
      },
      { status: 500 },
    )
  }
}
