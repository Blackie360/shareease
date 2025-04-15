import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { InvitationTest } from "@/components/invitation-test"

export default async function InvitationTestPage() {
  const supabase = createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Invitation Test</h1>
          <p className="text-muted-foreground">Test the invitation notification system</p>
        </div>

        <div className="mx-auto max-w-2xl">
          <InvitationTest />
        </div>
      </div>
    </>
  )
}
