import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getBillById } from "@/lib/supabase/database"
import { BillDetail } from "@/components/bill-detail"
import { Navbar } from "@/components/navbar"

export default async function BillPage({
  params,
}: {
  params: { id: string }
}) {
  // If Supabase is not configured, show setup message
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 text-white">Supabase Configuration Required</h1>
          <p className="text-gray-400 mb-6">
            Please set the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables to connect
            to your Supabase project.
          </p>
        </div>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Validate that the ID is a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(params.id)) {
    notFound()
  }

  try {
    const bill = await getBillById(params.id)

    // Check if the current user is the creator of the bill
    const isCreator = bill.user_id === user.id

    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <BillDetail bill={bill} isCreator={isCreator} currentUserId={user.id} />
        </div>
      </>
    )
  } catch (error) {
    console.error("Error fetching bill:", error)
    notFound()
  }
}
