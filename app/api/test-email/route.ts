import { NextResponse } from "next/server"
import { testEmailService } from "@/lib/email/email-service"
import { createClient } from "@/lib/supabase/server"

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

    // Test the email service
    const result = await testEmailService()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error testing email service:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
