import Link from "next/link"
import type { Bill } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { CalendarIcon, CreditCard, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface BillCardProps {
  bill: Bill
}

export function BillCard({ bill }: BillCardProps) {
  return (
    <Link href={`/bills/${bill.id}`} className="block">
      <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:border-brand-500/50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="line-clamp-1 text-lg">{bill.title}</CardTitle>
            {bill.category && (
              <Badge variant="outline" className="ml-2 bg-secondary">
                {bill.category}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-4 w-4" />
            {formatDistanceToNow(new Date(bill.date), { addSuffix: true })}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {bill.description && <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{bill.description}</p>}
          {bill.payment_method && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CreditCard className="mr-1 h-4 w-4" />
              {bill.payment_method}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            Split
          </div>
          <CurrencyDisplay
            amount={bill.total_amount}
            currency={bill.currency}
            className="text-lg font-semibold text-brand-500"
          />
        </CardFooter>
      </Card>
    </Link>
  )
}
