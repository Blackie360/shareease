import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("Auth callback received with code:", code ? "present" : "missing")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      // Exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError)
        return NextResponse.redirect(
          new URL(
            `/auth/login?error=${encodeURIComponent("Authentication failed: " + exchangeError.message)}`,
            request.url,
          ),
        )
      }

      // Get the user to check if the authentication was successful
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser()

      if (getUserError) {
        console.error("Error getting user after auth:", getUserError)
        return NextResponse.redirect(
          new URL(
            `/auth/login?error=${encodeURIComponent("Authentication failed: " + getUserError.message)}`,
            request.url,
          ),
        )
      }

      if (user) {
        // Successful authentication, redirect to dashboard
        console.log("Authentication successful, redirecting to dashboard")
        return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
      } else {
        // Authentication failed, redirect to login with error
        console.error("No user found after authentication")
        return NextResponse.redirect(new URL("/auth/login?error=Authentication%20failed", requestUrl.origin))
      }
    } catch (error) {
      console.error("Error in auth callback:", error)
      // Authentication error, redirect to login with error
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent("Authentication failed: Unknown error")}`, requestUrl.origin),
      )
    }
  }

  // No code provided, redirect to login
  console.error("No code provided in auth callback")
  return NextResponse.redirect(new URL("/auth/login?error=No%20authentication%20code%20provided", requestUrl.origin))
}

// Make this route dynamic to avoid caching issues
export const dynamic = "force-dynamic"
