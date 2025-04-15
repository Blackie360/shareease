"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InvitationTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")

  const handleTestInvitation = async () => {
    if (!recipientEmail) {
      setError("Please enter a recipient email address")
      return
    }

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/test-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail,
        }),
      })
      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Failed to send test invitation")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Invitation System</CardTitle>
        <CardDescription>
          Send a test invitation to verify that both in-app and email notifications are working correctly
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className={result.success ? "border-green-500 mb-4" : "border-red-500 mb-4"}>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium text-green-500">Test invitation sent!</p>
                <p>
                  From: {result.sender?.name} ({result.sender?.email})
                </p>
                <p>
                  To: {result.recipient?.name} ({result.recipient?.email})
                </p>

                {result.result?.inAppResult && (
                  <p>In-app notification: {result.result.inAppResult ? "✓ Sent" : "✗ Failed"}</p>
                )}

                {result.result?.emailResult !== undefined && (
                  <p>Email notification: {result.result.emailResult ? "✓ Sent" : "✗ Failed"}</p>
                )}

                <p className="text-sm text-muted-foreground mt-2">
                  Check your server logs for more detailed information.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="Enter recipient's email address"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleTestInvitation} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Test Invitation"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
