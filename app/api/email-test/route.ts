import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// This function determines if we're in a production environment where real emails can be sent
function isProductionEnvironment() {
  // Check if we're in a real Node.js environment (not browser/edge runtime)
  return process.env.NODE_ENV === "production" && typeof process.env.NEXT_PUBLIC_VERCEL_ENV !== "undefined"
}

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
      subject = "ShareEase Email Test",
      message = null,
      testMode = "simulation", // Can be "simulation" or "real" (real only works in production)
    } = body

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
      test_mode: testMode,
      status: "pending",
      timestamp: new Date().toISOString(),
    })

    if (logError) {
      console.warn("Could not log email test:", logError)
    }

    // Check if we can send real emails
    const canSendRealEmails = isProductionEnvironment() && testMode === "real"

    if (canSendRealEmails) {
      // In production, we can use nodemailer to send real emails
      try {
        // Dynamically import nodemailer to avoid issues in non-Node environments
        const nodemailer = await import("nodemailer")

        // Create a transporter with Gmail credentials
        const transporter = nodemailer.default.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        })

        // Send the email
        const info = await transporter.sendMail({
          from: fromAddress,
          to: recipientEmail,
          subject,
          html: htmlContent,
        })

        // Update the log with success status
        await supabase
          .from("email_test_logs")
          .update({
            status: "sent",
            message_id: info.messageId,
          })
          .eq("user_id", user.id)
          .eq("timestamp", new Date().toISOString())

        return NextResponse.json({
          success: true,
          mode: "real",
          messageId: info.messageId,
          details: {
            from: fromAddress,
            to: recipientEmail,
            subject,
            timestamp: new Date().toISOString(),
          },
        })
      } catch (error) {
        console.error("Error sending real email:", error)

        // Update the log with error status
        await supabase
          .from("email_test_logs")
          .update({
            status: "error",
            error_message: error.message,
          })
          .eq("user_id", user.id)
          .eq("timestamp", new Date().toISOString())

        return NextResponse.json(
          {
            error: "Failed to send email",
            details: error.message,
          },
          { status: 500 },
        )
      }
    } else {
      // In development or when simulation is requested, simulate the email
      console.log(`[SIMULATED EMAIL]
From: ${fromAddress}
To: ${recipientEmail}
Subject: ${subject}
Credentials: ${gmailUser} / ${gmailPass}
Timestamp: ${new Date().toISOString()}
Body: ${htmlContent.substring(0, 100)}...
      `)

      // Update the log with simulated status
      await supabase
        .from("email_test_logs")
        .update({
          status: "simulated",
          message_id: messageId,
        })
        .eq("user_id", user.id)
        .eq("timestamp", new Date().toISOString())

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
            "Email simulation successful. In a production environment, this would send a real email using the Gmail credentials.",
        },
      })
    }
  } catch (error) {
    console.error("Error in email test:", error)
    return NextResponse.json(
      {
        error: "Failed to process email test",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
