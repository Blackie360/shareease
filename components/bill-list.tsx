import type { Bill } from "@/types"
import { BillCard } from "@/components/bill-card"

interface BillListProps {
  bills: Bill[]
  emptyMessage?: string
}

export function BillList({ bills, emptyMessage = "No bills found" }: BillListProps) {
  if (bills.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
    </div>
  )
}
