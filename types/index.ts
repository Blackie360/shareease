// Define types for our data models
export type Bill = {
  id: string
  user_id: string
  title: string
  description: string | null
  total_amount: number
  date: string
  category: string | null
  payment_method: string | null
  tip_amount: number
  receipt_image_url: string | null
  currency: string
  created_at: string
  updated_at: string
  is_completed?: boolean
  completion_date?: string | null
}

export type BillParticipant = {
  id: string
  bill_id: string
  participant_id: string
  amount: number
  is_paid: boolean
  is_confirmed?: boolean
  invitation_status?: InvitationStatus
  created_at: string
  updated_at: string
  // Include participant details when joined
  participant?: Participant
}

// Update the NewBillParticipant type to make is_confirmed optional
export type NewBillParticipant = Omit<
  BillParticipant,
  "id" | "created_at" | "updated_at" | "is_confirmed" | "invitation_status" | "participant"
>

export type Participant = {
  id: string
  name: string
  email: string
  phone_number: string | null
  created_at: string
  updated_at: string
  user_id?: string | null
}

export type BillWithParticipants = Bill & {
  participants: BillParticipant[]
}

export type NewBill = Omit<Bill, "id" | "created_at" | "updated_at" | "is_completed" | "completion_date">

export type NewParticipant = Omit<Participant, "id" | "created_at" | "updated_at">

export type SplitType = "equal" | "custom" | "percentage"

export type SharePlatform = "whatsapp" | "twitter" | "facebook" | "email" | "sms" | "copy"

export type InvitationStatus = "pending" | "accepted" | "declined"

export const CATEGORIES = [
  "Food",
  "Travel",
  "Accommodation",
  "Entertainment",
  "Groceries",
  "Utilities",
  "Rent",
  "Other",
]

export const PAYMENT_METHODS = ["M-Pesa", "Airtel Money", "Card", "Cash", "Bank Transfer"]

export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "KES", symbol: "KSh" },
]
