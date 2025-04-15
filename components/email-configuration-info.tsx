"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon } from "lucide-react"

export function EmailConfigurationInfo() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Email Configuration Information</CardTitle>
        <CardDescription>Important details about how emails are sent in ShareEase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>About Email Sender Addresses</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              ShareEase now shows the bill creator's email address in notifications, but due to email authentication
              standards (SPF, DKIM, DMARC), we use the following format:
            </p>
            <p className="font-mono text-sm bg-muted p-2 rounded mb-2">
              "ShareEase via username" &lt;{process.env.EMAIL_FROM || "noreply@shareease.app"}&gt;
            </p>
            <p className="mb-2">
              The creator's email is set as the "Reply-To" address, so recipients can reply directly to the creator.
            </p>
            <p>
              This approach ensures better email deliverability while still maintaining the personal connection between
              bill creators and participants.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
