import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code)

      // Get the user to check if the authentication was successful
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Successful authentication, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url))
      } else {
        // Authentication failed, redirect to login with error
        return NextResponse.redirect(new URL("/auth/login?error=Authentication%20failed", request.url))
      }
    } catch (error) {
      console.error("Error in auth callback:", error)
      // Authentication error, redirect to login with error
      return NextResponse.redirect(new URL("/auth/login?error=Authentication%20failed", request.url))
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL("/auth/login", request.url))
}
