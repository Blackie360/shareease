"use server"

import { renderAsync } from "@react-email/render"
import { BillInvitationEmail } from "./templates/bill-invitation-email"
import { PaymentReminderEmail } from "./templates/payment-reminder-email"
import { BillCompletionEmail } from "./templates/bill-completion-email"
import { getUserNotificationPreferences } from "../supabase/notifications"

// Email sending interface
interface SendEmailOptions {
  to: string
  from?: string
  subject: string
  html: string
  replyTo?: string
}

// Send a generic email - this is a server action that will work in production
export async function sendEmail({ to, from, subject, html, replyTo }: SendEmailOptions): Promise<boolean> {
  try {
    // Check if we're in a production environment
    const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production"

    if (!isProduction) {
      // In non-production environments, just log the email
      console.log(`[SIMULATED EMAIL]
To: ${to}
From: ${from || process.env.EMAIL_FROM || "noreply@shareease.app"}
Subject: ${subject}
ReplyTo: ${replyTo || from}
Body: ${html.substring(0, 100)}...
      `)
      return true
    }

    // In production, we would use nodemailer to send real emails
    // This code will only run in production environments where Node.js is fully available
    const nodemailer = await import("nodemailer")

    // Use the provided from address or fall back to the default EMAIL_FROM
    const defaultFrom = `"ShareEase" <${process.env.EMAIL_FROM || "noreply@shareease.app"}>`

    // If a custom from address is provided, use it with the ShareEase name
    const fromAddress = from
      ? `"ShareEase via ${from.split("@")[0]}" <${process.env.EMAIL_FROM || "noreply@shareease.app"}>`
      : defaultFrom

    console.log(`Sending email to ${to} from ${fromAddress} with subject: ${subject}`)

    // Create a transporter with Gmail credentials
    const transporter = nodemailer.default.createTransport({
      service: "gmail", // Use service instead of host/port to avoid DNS lookup
      auth: {
        user: "codedblood22@gmail.com",
        pass: "axrl dldo tloq eeen",
      },
    })

    const mailOptions = {
      from: fromAddress,
      to,
      subject,
      html,
      headers: {
        "X-Priority": "1", // High priority
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    }

    // If a custom from address is provided, set it as the Reply-To header
    if (from) {
      mailOptions.replyTo = replyTo || from
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Send a bill invitation email
export async function sendBillInvitationEmail({
  to,
  from,
  userName,
  billTitle,
  billAmount,
  currency,
  inviterName,
  billId,
  billDate,
  skipPreferenceCheck = false,
}: {
  to: string
  from?: string
  userName: string
  billTitle: string
  billAmount: number
  currency: string
  inviterName: string
  billId: string
  billDate: string
  skipPreferenceCheck?: boolean
}): Promise<boolean> {
  try {
    console.log(`Preparing to send bill invitation email to ${to} from ${from || "default sender"}`)

    // Check if the user has email notifications enabled (skip if testing)
    if (!skipPreferenceCheck) {
      try {
        const userPreferences = await getUserNotificationPreferences(to)

        if (userPreferences && !userPreferences.email_notifications) {
          console.log(`User ${to} has disabled email notifications`)
          return false
        }

        if (userPreferences && !userPreferences.bill_invitations) {
          console.log(`User ${to} has disabled bill invitation notifications`)
          return false
        }
      } catch (error) {
        console.error("Error checking user preferences:", error)
        // Continue with sending the email for testing purposes
      }
    }

    const html = await renderAsync(
      BillInvitationEmail({
        userName,
        billTitle,
        billAmount,
        currency,
        inviterName,
        billId,
        billDate,
        appUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://shareease.app",
      }),
    )

    return sendEmail({
      to,
      from,
      replyTo: from,
      subject: `${inviterName} invited you to split "${billTitle}"`,
      html,
    })
  } catch (error) {
    console.error("Error sending bill invitation email:", error)
    return false
  }
}

// Send a payment reminder email
export async function sendPaymentReminderEmail({
  to,
  from,
  userName,
  billTitle,
  amount,
  currency,
  dueDate,
  billId,
  skipPreferenceCheck = false,
}: {
  to: string
  from?: string
  userName: string
  billTitle: string
  amount: number
  currency: string
  dueDate: string
  billId: string
  skipPreferenceCheck?: boolean
}): Promise<boolean> {
  try {
    // Check if the user has email notifications enabled (skip if testing)
    if (!skipPreferenceCheck) {
      try {
        const userPreferences = await getUserNotificationPreferences(to)

        if (userPreferences && !userPreferences.email_notifications) {
          console.log(`User ${to} has disabled email notifications`)
          return false
        }

        if (userPreferences && !userPreferences.bill_reminders) {
          console.log(`User ${to} has disabled payment reminder notifications`)
          return false
        }
      } catch (error) {
        console.error("Error checking user preferences:", error)
        // Continue with sending the email for testing purposes
      }
    }

    const html = await renderAsync(
      PaymentReminderEmail({
        userName,
        billTitle,
        amount,
        currency,
        dueDate,
        billId,
        appUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://shareease.app",
      }),
    )

    return sendEmail({
      to,
      from,
      replyTo: from,
      subject: `Payment Reminder: "${billTitle}"`,
      html,
    })
  } catch (error) {
    console.error("Error sending payment reminder email:", error)
    return false
  }
}

// Send a bill completion email
export async function sendBillCompletionEmail({
  to,
  from,
  userName,
  billTitle,
  billId,
  skipPreferenceCheck = false,
}: {
  to: string
  from?: string
  userName: string
  billTitle: string
  billId: string
  skipPreferenceCheck?: boolean
}): Promise<boolean> {
  try {
    // Check if the user has email notifications enabled (skip if testing)
    if (!skipPreferenceCheck) {
      try {
        const userPreferences = await getUserNotificationPreferences(to)

        if (userPreferences && !userPreferences.email_notifications) {
          console.log(`User ${to} has disabled email notifications`)
          return false
        }

        if (userPreferences && !userPreferences.bill_completions) {
          console.log(`User ${to} has disabled bill completion notifications`)
          return false
        }
      } catch (error) {
        console.error("Error checking user preferences:", error)
        // Continue with sending the email for testing purposes
      }
    }

    const html = await renderAsync(
      BillCompletionEmail({
        userName,
        billTitle,
        billId,
        appUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://shareease.app",
      }),
    )

    return sendEmail({
      to,
      from,
      replyTo: from,
      subject: `Bill Completed: "${billTitle}"`,
      html,
    })
  } catch (error) {
    console.error("Error sending bill completion email:", error)
    return false
  }
}

// Test email functionality - simplified for preview environments
export async function testEmailService(): Promise<{ success: boolean; info?: any; error?: any }> {
  try {
    // In preview environments, just simulate the email
    console.log("[SIMULATED TEST EMAIL]")
    console.log("To: test@example.com")
    console.log("From: ShareEase Test <test@shareease.app>")
    console.log("Subject: Test Email")
    console.log("Body: This is a test email from ShareEase")

    return {
      success: true,
      info: {
        messageId: `simulated-${Date.now()}@shareease.app`,
        simulatedOnly: true,
      },
    }
  } catch (error) {
    console.error("Error testing email service:", error)
    return { success: false, error }
  }
}
