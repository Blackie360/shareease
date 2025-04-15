"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RealEmailTesting() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [recipientEmail, setRecipientEmail] = useState("")
  const [subject, setSubject] = useState("ShareEase Email Test")
  const [messageType, setMessageType] = useState("default")
  const [customMessage, setCustomMessage] = useState("")

  const defaultMessage = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h1 style="color: #2b725e; border-bottom: 1px solid #eee; padding-bottom: 10px;">ShareEase Email Test</h1>
  <p>Hello,</p>
  <p>This is a test email from ShareEase to verify that the email service is working correctly.</p>
  <p>If you received this email, it means your email configuration is working!</p>
  <p style="color: #666; font-size: 14px;">Time sent: ${new Date().toLocaleString()}</p>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
    <p>This is an automated test email from ShareEase. Please do not reply to this email.</p>
  </div>
</div>
  `

  const billInvitationMessage = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h1 style="color: #2b725e; border-bottom: 1px solid #eee; padding-bottom: 10px;">Bill Invitation</h1>
  <p>Hello,</p>
  <p>You have been invited to split a bill titled "Dinner at Restaurant" on ShareEase.</p>
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
    <h2 style="color: #2b725e; font-size: 18px; margin-top: 0;">Bill Details</h2>
    <p style="margin: 10px 0; font-size: 14px;"><strong>Title:</strong> Dinner at Restaurant</p>
    <p style="margin: 10px 0; font-size: 14px;"><strong>Amount:</strong> $120.00</p>
    <p style="margin: 10px 0; font-size: 14px;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p style="margin: 10px 0; font-size: 14px;"><strong>Added by:</strong> John Doe</p>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="#" style="background-color: #2b725e; color: #fff; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">View Bill</a>
  </div>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
    <p>This is a test email from ShareEase. Please do not reply to this email.</p>
  </div>
</div>
  `

  const paymentReminderMessage = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h1 style="color: #2b725e; border-bottom: 1px solid #eee; padding-bottom: 10px;">Payment Reminder</h1>
  <p>Hello,</p>
  <p>This is a friendly reminder that your payment of $40.00 for "Dinner at Restaurant" is due on ${new Date().toLocaleDateString()}.</p>
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
    <h2 style="color: #2b725e; font-size: 18px; margin-top: 0;">Payment Details</h2>
    <p style="margin: 10px 0; font-size: 14px;"><strong>Bill:</strong> Dinner at Restaurant</p>
    <p style="margin: 10px 0; font-size: 14px;"><strong>Amount Due:</strong> $40.00</p>
    <p style="margin: 10px 0; font-size: 14px;"><strong>Due Date:</strong> ${new Date().toLocaleDateString()}</p>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="#" style="background-color: #2b725e; color: #fff; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">View Bill</a>
  </div>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
    <p>This is a test email from ShareEase. Please do not reply to this email.</p>
  </div>
</div>
  `

  const billCompletionMessage = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h1 style="color: #2b725e; border-bottom: 1px solid #eee; padding-bottom: 10px;">Bill Completed</h1>
  <p>Hello,</p>
  <p>The bill "Dinner at Restaurant" has been marked as complete on ShareEase.</p>
  <div style="background-color: #f0f8f4; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #2b725e;">
    <p>All participants have confirmed their payments, and the bill is now settled. Thank you for using ShareEase to manage your shared expenses!</p>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="#" style="background-color: #2b725e; color: #fff; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">View Bill</a>
  </div>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
    <p>This is a test email from ShareEase. Please do not reply to this email.</p>
  </div>
</div>
  `

  const getMessageContent = () => {
    switch (messageType) {
      case "default":
        return defaultMessage
      case "bill-invitation":
        return billInvitationMessage
      case "payment-reminder":
        return paymentReminderMessage
      case "bill-completion":
        return billCompletionMessage
      case "custom":
        return customMessage
      default:
        return defaultMessage
    }
  }

  const handleTestEmail = async () => {
    if (!recipientEmail) {
      setError("Please enter a recipient email address")
      return
    }

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/send-real-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail,
          subject,
          message: getMessageContent(),
        }),
      })
      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message:
            data.mode === "simulation"
              ? "Email simulation successful! (Preview environment)"
              : "Email sent successfully!",
          details: data,
        })
      } else {
        setError(data.error || "Failed to send email")
        if (data.details) {
          console.error("Error details:", data.details)
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Testing</CardTitle>
        <CardDescription>Test email notifications using dedicated Gmail credentials</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className={result.success ? "border-green-500 mb-4" : "border-red-500 mb-4"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertDescription>
              {result.success ? (
                <div>
                  <p className="font-medium text-green-500">{result.message}</p>
                  {result.details && (
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-semibold">From:</span> {result.details.details?.from}
                      </p>
                      <p>
                        <span className="font-semibold">To:</span> {result.details.details?.to}
                      </p>
                      <p>
                        <span className="font-semibold">Subject:</span> {result.details.details?.subject}
                      </p>
                      {result.details.messageId && (
                        <p>
                          <span className="font-semibold">Message ID:</span> {result.details.messageId}
                        </p>
                      )}
                      {result.details.details?.simulationMessage && (
                        <Alert className="mt-2">
                          <Info className="h-4 w-4" />
                          <AlertDescription>{result.details.details.simulationMessage}</AlertDescription>
                        </Alert>
                      )}
                      {!result.details.details?.simulationMessage && (
                        <p className="text-muted-foreground mt-2">
                          Check your email inbox to verify receipt. If you don't see the email, check your spam folder.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="font-medium text-red-500">Test failed: {result.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Preview Environment Limitation</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              In preview environments, emails are simulated rather than actually sent due to Node.js networking
              limitations.
            </p>
            <p>In your production deployment, real emails will be sent using the configured email service.</p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email (To)</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Email Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email Template</Label>
            <Tabs value={messageType} onValueChange={setMessageType} className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="bill-invitation">Invitation</TabsTrigger>
                <TabsTrigger value="payment-reminder">Reminder</TabsTrigger>
                <TabsTrigger value="bill-completion">Completion</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              <TabsContent value="custom" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="customMessage">Custom HTML Message</Label>
                  <Textarea
                    id="customMessage"
                    placeholder="<h1>Email Content</h1><p>Your message here...</p>"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={6}
                  />
                </div>
              </TabsContent>
              <TabsContent value="default" className="mt-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>Using the default test email template with basic formatting.</AlertDescription>
                </Alert>
              </TabsContent>
              <TabsContent value="bill-invitation" className="mt-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Using the bill invitation email template with sample bill details.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              <TabsContent value="payment-reminder" className="mt-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Using the payment reminder email template with sample payment details.
                  </AlertDescription>
                </Alert>
              </TabsContent>
              <TabsContent value="bill-completion" className="mt-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Using the bill completion email template with sample completion message.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Gmail Credentials</AlertTitle>
          <AlertDescription>
            <p>This test uses the following Gmail credentials:</p>
            <p className="font-mono text-xs mt-1">Email: codedblood22@gmail.com</p>
            <p className="font-mono text-xs">Password: axrl dldo tloq eeen</p>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button onClick={handleTestEmail} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "Sending Email..." : "Simulating Email..."}
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Test Email
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
