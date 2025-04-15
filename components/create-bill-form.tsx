"use client"

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { CATEGORIES, CURRENCIES, PAYMENT_METHODS, type SplitType } from "@/types"
import { createBillWithParticipants } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Bill...
        </>
      ) : (
        "Create Bill"
      )}
    </Button>
  )
}

export function CreateBillForm() {
  const router = useRouter()
  const [date, setDate] = useState<Date>(new Date())
  const [splitType, setSplitType] = useState<SplitType>("equal")
  const [participants, setParticipants] = useState([
    { name: "", email: "", phone: "", amount: "" },
    { name: "", email: "", phone: "", amount: "" },
  ])

  // Listen for the custom event to add a participant
  useEffect(() => {
    const handleAddParticipantEvent = () => {
      // Add a new empty participant without affecting existing ones
      setParticipants((currentParticipants) => [...currentParticipants, { name: "", email: "", phone: "", amount: "" }])
    }

    document.addEventListener("add-participant", handleAddParticipantEvent)

    return () => {
      document.removeEventListener("add-participant", handleAddParticipantEvent)
    }
  }, [])

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addParticipant = () => {
    setParticipants((currentParticipants) => [...currentParticipants, { name: "", email: "", phone: "", amount: "" }])
  }

  const removeParticipant = (index: number) => {
    if (participants.length <= 2) return // Keep at least 2 participants
    const newParticipants = [...participants]
    newParticipants.splice(index, 1)
    setParticipants(newParticipants)
  }

  const updateParticipant = (index: number, field: string, value: string) => {
    const newParticipants = [...participants]
    newParticipants[index] = { ...newParticipants[index], [field]: value }
    setParticipants(newParticipants)
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form data
      const title = formData.get("title") as string
      const totalAmount = formData.get("totalAmount") as string

      if (!title || !totalAmount) {
        setError("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      // Validate participants
      const validParticipants = participants.filter((p) => p.name.trim() !== "")
      if (validParticipants.length < 2) {
        setError("You need at least 2 participants with names")
        setIsSubmitting(false)
        return
      }

      const response = await createBillWithParticipants(null, formData)

      if (response.error) {
        setError(response.error)
        setIsSubmitting(false)
        return
      }

      if (response.success && response.billId) {
        router.push(`/bills/${response.billId}`)
      } else {
        setError("Something went wrong. Please try again.")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error creating bill:", error)
      setError("An unexpected error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Bill Details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Dinner at Restaurant" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
            <Input type="hidden" name="date" value={date ? date.toISOString() : new Date().toISOString()} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Add details about this bill" rows={3} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select name="paymentMethod">
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input id="totalAmount" name="totalAmount" type="number" step="0.01" min="0" placeholder="0.00" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipAmount">Tip Amount</Label>
            <Input id="tipAmount" name="tipAmount" type="number" step="0.01" min="0" placeholder="0.00" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select name="currency" defaultValue="KES">
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Split Details</h2>

        <div className="space-y-2">
          <Label>Split Type</Label>
          <RadioGroup
            defaultValue="equal"
            className="flex flex-col space-y-1"
            value={splitType}
            onValueChange={(value) => setSplitType(value as SplitType)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="equal" id="split-equal" />
              <Label htmlFor="split-equal">Equal Split</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="split-custom" />
              <Label htmlFor="split-custom">Custom Amounts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="split-percentage" />
              <Label htmlFor="split-percentage">Percentage Split</Label>
            </div>
          </RadioGroup>
          <Input type="hidden" name="splitType" value={splitType} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Participants ({participants.length})</h3>
            <Button type="button" variant="outline" size="sm" onClick={addParticipant}>
              <Plus className="mr-1 h-4 w-4" />
              Add Participant
            </Button>
          </div>

          {participants.map((participant, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`participant-name-${index}`}>Name</Label>
                    <Input
                      id={`participant-name-${index}`}
                      name="participantName"
                      value={participant.name}
                      onChange={(e) => updateParticipant(index, "name", e.target.value)}
                      placeholder="Participant name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`participant-email-${index}`}>Email</Label>
                    <Input
                      id={`participant-email-${index}`}
                      name="participantEmail"
                      type="email"
                      value={participant.email}
                      onChange={(e) => updateParticipant(index, "email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`participant-phone-${index}`}>Phone</Label>
                    <Input
                      id={`participant-phone-${index}`}
                      name="participantPhone"
                      value={participant.phone}
                      onChange={(e) => updateParticipant(index, "phone", e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>

                  {splitType !== "equal" && (
                    <div className="space-y-2">
                      <Label htmlFor={`participant-amount-${index}`}>
                        {splitType === "percentage" ? "Percentage (%)" : "Amount"}
                      </Label>
                      <Input
                        id={`participant-amount-${index}`}
                        name="participantAmount"
                        type="number"
                        step={splitType === "percentage" ? "1" : "0.01"}
                        min="0"
                        value={participant.amount}
                        onChange={(e) => updateParticipant(index, "amount", e.target.value)}
                        placeholder={splitType === "percentage" ? "50" : "0.00"}
                        required={splitType !== "equal"}
                      />
                    </div>
                  )}
                </div>

                {participants.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    onClick={() => removeParticipant(index)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Bill...
          </>
        ) : (
          "Create Bill"
        )}
      </Button>
    </form>
  )
}
