import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { BillList } from "@/components/bill-list"
import { SearchFilter } from "@/components/search-filter"
import { getBills, searchBills, filterBillsByCategory, filterBillsByDateRange } from "@/lib/supabase/database"
import { Navbar } from "@/components/navbar"

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
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

  // Handle search and filters
  let bills
  const query = searchParams.q as string
  const category = searchParams.category as string
  const startDate = searchParams.startDate as string
  const endDate = searchParams.endDate as string

  if (query) {
    bills = await searchBills(query)
  } else if (category && category !== "all") {
    bills = await filterBillsByCategory(category)
  } else if (startDate && endDate) {
    bills = await filterBillsByDateRange(startDate, endDate)
  } else {
    bills = await getBills()
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Bills</h1>
            <p className="text-muted-foreground">Manage and track your shared expenses</p>
          </div>
          <Link href="/create-bill">
            <Button className="bg-brand-500 hover:bg-brand-600">
              <Plus className="mr-2 h-4 w-4" />
              New Bill
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <SearchFilter />
        </div>

        <BillList
          bills={bills}
          emptyMessage={
            query || (category && category !== "all") || (startDate && endDate)
              ? "No bills match your search criteria"
              : "You haven't created any bills yet. Click 'New Bill' to get started."
          }
        />
      </div>
    </>
  )
}
