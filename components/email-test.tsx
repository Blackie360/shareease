"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function EmailTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTestEmail = async () => {
    setIsLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/test-email")
      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Failed to test email service")
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
        <CardTitle>Test Email Functionality</CardTitle>
        <CardDescription>Send a test email to verify that the email service is working correctly</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className={result.success ? "border-green-500" : "border-red-500"}>
            <AlertDescription>
              {result.success ? (
                <div>
                  <p className="font-medium text-green-500">Email test successful!</p>
                  {result.info && (
                    <div className="mt-2">
                      <p>Message ID: {result.info.messageId}</p>
                      {result.info.previewUrl && (
                        <p className="mt-1">
                          <a
                            href={result.info.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Preview Email
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="font-medium text-red-500">Email test failed: {result.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleTestEmail} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Send Test Email"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
