import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BillNotFound() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Bill Not Found</h1>
        <p className="mb-8 text-muted-foreground">The bill you're looking for doesn't exist or has been deleted.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bills
          </Button>
        </Link>
      </div>
    </div>
  )
}
