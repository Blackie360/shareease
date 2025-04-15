"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { BillWithParticipants } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyDisplay } from "@/components/ui/currency-display"
import { ArrowLeft, Calendar, Check, CreditCard, Download, Edit, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import {
  updateBillParticipantStatus,
  deleteBill,
  exportBillToCSV,
  completeBill,
  confirmParticipation,
} from "@/lib/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ShareBillDialog } from "@/components/share-bill-dialog"

interface BillDetailProps {
  bill: BillWithParticipants
  isCreator: boolean
  currentUserId: string | null
}

export function BillDetail({ bill, isCreator, currentUserId }: BillDetailProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const totalPaid = bill.participants.reduce((sum, p) => {
    return sum + (p.is_paid ? p.amount : 0)
  }, 0)

  const percentPaid = (totalPaid / bill.total_amount) * 100

  const totalConfirmed = bill.participants.filter((p) => p.is_confirmed).length
  const percentConfirmed = bill.participants.some((p) => "is_confirmed" in p)
    ? (totalConfirmed / bill.participants.length) * 100
    : 0

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteBill(bill.id)
      if (result.success) {
        router.push("/dashboard")
      } else if (result.error) {
        alert(`Error deleting bill: ${result.error}`)
        setIsDeleting(false)
      }
    } catch (error) {
      console.error("Error deleting bill:", error)
      alert("Failed to delete bill")
      setIsDeleting(false)
    }
  }

  const handleExport = async () => {
    try {
      const result = await exportBillToCSV(bill.id)
      if (result.success) {
        alert("Bill exported successfully")
      } else if (result.error) {
        alert(`Error exporting bill: ${result.error}`)
      }
    } catch (error) {
      console.error("Error exporting bill:", error)
      alert("Failed to export bill")
    }
  }

  const handlePaymentStatusChange = async (id: string, isPaid: boolean) => {
    try {
      const result = await updateBillParticipantStatus(id, isPaid)
      if (result.success) {
        router.refresh()
      } else if (result.error) {
        alert(`Error updating payment status: ${result.error}`)
      }
    } catch (error) {
      console.error("Error updating payment status:", error)
      alert("Failed to update payment status")
    }
  }

  const handleConfirmParticipation = async (id: string) => {
    try {
      const result = await confirmParticipation(id)
      if (result.success) {
        alert("Participation confirmed")
        router.refresh()
      } else if (result.error) {
        alert(`Error confirming participation: ${result.error}`)
      }
    } catch (error) {
      console.error("Error confirming participation:", error)
      alert("Failed to confirm participation")
    }
  }

  const handleCompleteBill = async () => {
    setIsCompleting(true)
    try {
      const result = await completeBill(bill.id)
      if (result.success) {
        alert("Bill marked as complete")
        router.refresh()
      } else if (result.error) {
        alert(result.error)
      }
    } catch (error) {
      console.error("Error completing bill:", error)
      alert("Failed to mark bill as complete")
    } finally {
      setIsCompleting(false)
    }
  }

  // Find the current user's participant record
  const currentUserParticipant = currentUserId
    ? bill.participants.find((p) => p.participant.user_id === currentUserId)
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bills
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <ShareBillDialog billId={bill.id} billTitle={bill.title} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isCreator && (
                <DropdownMenuItem
                  onClick={() => {
                    // Check if the edit page exists, otherwise show a message
                    try {
                      router.push(`/bills/${bill.id}/edit`)
                    } catch (error) {
                      console.error("Navigation error:", error)
                      alert("Edit functionality is not yet implemented")
                    }
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Bill
                </DropdownMenuItem>
              )}

              {!bill.is_completed && (
                <DropdownMenuItem onClick={handleCompleteBill} disabled={isCompleting}>
                  <Check className="mr-2 h-4 w-4" />
                  {isCompleting ? "Completing..." : "Mark as Complete"}
                </DropdownMenuItem>
              )}

              {isCreator && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Bill
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the bill and all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-bold">{bill.title}</CardTitle>
            {bill.is_completed && (
              <Badge variant="default" className="bg-green-500">
                Completed
              </Badge>
            )}
          </div>
          {bill.category && <Badge variant="outline">{bill.category}</Badge>}
        </CardHeader>
        <CardContent className="space-y-4">
          {bill.description && <p className="text-muted-foreground">{bill.description}</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{format(new Date(bill.date), "PPP")}</span>
            </div>

            {bill.payment_method && (
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span>{bill.payment_method}</span>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Total Amount</span>
              <CurrencyDisplay amount={bill.total_amount} currency={bill.currency} className="text-xl font-bold" />
            </div>

            {bill.tip_amount > 0 && (
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tip</span>
                <CurrencyDisplay
                  amount={bill.tip_amount}
                  currency={bill.currency}
                  className="text-sm text-muted-foreground"
                />
              </div>
            )}

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>Payment Progress</span>
                <span>{Math.round(percentPaid)}%</span>
              </div>
              <Progress value={percentPaid} className="h-2" />
            </div>

            {bill.participants.some((p) => "is_confirmed" in p) && (
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>Confirmation Progress</span>
                  <span>{Math.round(percentConfirmed)}%</span>
                </div>
                <Progress value={percentConfirmed} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>

        {!bill.is_completed &&
          currentUserParticipant &&
          typeof currentUserParticipant.is_confirmed !== "undefined" &&
          !currentUserParticipant.is_confirmed && (
            <CardFooter>
              <Button className="w-full" onClick={() => handleConfirmParticipation(currentUserParticipant.id)}>
                Confirm Participation
              </Button>
            </CardFooter>
          )}
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Participants</h2>

        {bill.participants.map((billParticipant) => (
          <Card key={billParticipant.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <span className="text-lg font-semibold">
                    {billParticipant.participant.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="font-medium">
                    {billParticipant.participant.name}
                    {billParticipant.participant.user_id === bill.user_id && (
                      <Badge variant="outline" className="ml-2">
                        Creator
                      </Badge>
                    )}
                  </p>
                  {billParticipant.participant.email && (
                    <p className="text-sm text-muted-foreground">{billParticipant.participant.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <CurrencyDisplay amount={billParticipant.amount} currency={bill.currency} className="font-semibold" />

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`paid-${billParticipant.id}`}
                      checked={billParticipant.is_paid}
                      onCheckedChange={(checked) => {
                        handlePaymentStatusChange(billParticipant.id, checked === true)
                      }}
                      disabled={!isCreator && billParticipant.participant.user_id !== currentUserId}
                    />
                    <Label htmlFor={`paid-${billParticipant.id}`} className="text-sm font-medium">
                      Paid
                    </Label>
                  </div>

                  {typeof billParticipant.is_confirmed !== "undefined" && (
                    <div className="flex items-center space-x-2">
                      {billParticipant.is_confirmed ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Confirmed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                          Pending
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {billParticipant.is_paid ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
