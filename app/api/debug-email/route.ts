import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email/email-service"

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get email configuration
    const emailConfig = {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      user: process.env.EMAIL_SERVER_USER,
      from: process.env.EMAIL_FROM,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    }

    // Test sending a simple email
    const testResult = await sendEmail({
      to: user.email || "",
      subject: "ShareEase Email Test",
      html: `
        <h1>Email Test</h1>
        <p>This is a test email from ShareEase to verify that the email service is working correctly.</p>
        <p>If you received this email, it means your email configuration is working!</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      `,
    })

    return NextResponse.json({
      success: true,
      emailConfig: {
        host: emailConfig.host ? "✓ Configured" : "✗ Missing",
        port: emailConfig.port ? "✓ Configured" : "✗ Missing",
        user: emailConfig.user ? "✓ Configured" : "✗ Missing",
        from: emailConfig.from ? "✓ Configured" : "✗ Missing",
        siteUrl: emailConfig.siteUrl ? "✓ Configured" : "✗ Missing",
      },
      emailSent: testResult,
      userEmail: user.email,
    })
  } catch (error) {
    console.error("Error testing email:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
}
