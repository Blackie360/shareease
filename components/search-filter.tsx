"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { searchBillsRealTime } from "@/lib/actions/search-actions"
import type { Bill } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [results, setResults] = useState<Bill[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Debounce search query to avoid too many requests
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setResults([])
        return
      }

      setIsSearching(true)
      try {
        const searchResults = await searchBillsRealTime(debouncedSearchQuery)
        setResults(searchResults)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearchQuery])

  // Show results when input is focused
  const handleFocus = () => {
    setShowResults(true)
  }

  // Navigate to bill details when a result is clicked
  const handleResultClick = (billId: string) => {
    router.push(`/bills/${billId}`)
    setShowResults(false)
  }

  return (
    <div className="relative space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search bills by title, description, or category..."
          className="pl-8 pr-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
        />
        {isSearching && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Real-time search results */}
      {showResults && searchQuery.trim().length >= 2 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
          {results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto p-2">
              {results.map((bill) => (
                <Card
                  key={bill.id}
                  className="mb-2 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleResultClick(bill.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{bill.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {bill.description || "No description"}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{bill.category}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(bill.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {isSearching ? "Searching..." : "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
