import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CreateBillForm } from "@/components/create-bill-form"
import { Navbar } from "@/components/navbar"
import { PaymentMethodLogos } from "@/components/payment-method-logos"
import { AddParticipantButton } from "@/components/add-participant-button"

export default async function CreateBillPage() {
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 relative">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create New Bill</h1>
          <p className="text-muted-foreground">Enter the details of your shared expense</p>
        </div>

        {/* Payment Method Logos */}
        <PaymentMethodLogos />

        <div className="mx-auto max-w-3xl">
          <CreateBillForm />
        </div>

        {/* Floating Action Button to add participants */}
        <AddParticipantButton />
      </div>
    </>
  )
}
