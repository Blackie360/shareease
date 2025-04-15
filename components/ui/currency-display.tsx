import { CURRENCIES } from "@/types"

interface CurrencyDisplayProps {
  amount: number
  currency: string
  className?: string
}

export function CurrencyDisplay({ amount, currency, className = "" }: CurrencyDisplayProps) {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0]

  // Special formatting for KES
  if (currency === "KES") {
    return <span className={className}>{`${currencyInfo.symbol} ${amount.toFixed(2)}`}</span>
  }

  // Default formatting for other currencies
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyInfo.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return <span className={className}>{formattedAmount}</span>
}
