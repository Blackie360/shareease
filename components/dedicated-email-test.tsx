"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Info, CheckCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function DedicatedEmailTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [senderEmail, setSenderEmail] = useState("codedblood22@gmail.com")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [subject, setSubject] = useState("ShareEase Email Test")
  const [message, setMessage] = useState(`
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">ShareEase Email Test</h1>
  <p>Hello,</p>
  <p>This is a test email from ShareEase to verify that the email service is working correctly.</p>
  <p>If you received this email, it means your email configuration is working!</p>
  <p style="color: #666; font-size: 14px;">Time sent: ${new Date().toLocaleString()}</p>
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
    <p>This is an automated test email from ShareEase. Please do not reply to this email.</p>
  </div>
</div>
  `)

  const handleTestEmail = async () => {
    if (!recipientEmail) {
      setError("Please enter a recipient email address")
      return
    }

    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/test-email-with-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderEmail,
          recipientEmail,
          subject,
          message,
        }),
      })
      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.details?.simulatedOnly ? "Email simulation successful!" : "Email sent successfully!",
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
        <CardTitle>Dedicated Email Test</CardTitle>
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
                        <span className="font-semibold">Reply-To:</span> {result.details.details?.replyTo}
                      </p>
                      <p>
                        <span className="font-semibold">To:</span> {result.details.details?.to}
                      </p>
                      {result.details.messageId && (
                        <p>
                          <span className="font-semibold">Message ID:</span> {result.details.messageId}
                        </p>
                      )}
                      {result.details.details?.simulatedOnly && (
                        <Alert className="mt-2">
                          <Info className="h-4 w-4" />
                          <AlertDescription>{result.details.details.message}</AlertDescription>
                        </Alert>
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

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="senderEmail">Sender Email (From)</Label>
            <Input
              id="senderEmail"
              type="email"
              placeholder="sender@example.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This will be used as the Reply-To address. The actual sender will be codedblood22@gmail.com.
            </p>
          </div>

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
            <Label htmlFor="message">Message (HTML)</Label>
            <Textarea
              id="message"
              placeholder="<h1>Email Content</h1><p>Your message here...</p>"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <p>This test uses the dedicated Gmail credentials:</p>
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
              Sending...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Test Email
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
