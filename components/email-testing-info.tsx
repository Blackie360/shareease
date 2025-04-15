"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon, AlertTriangle } from "lucide-react"

export function EmailTestingInfo() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Email Testing Information</CardTitle>
        <CardDescription>Important details about email testing in ShareEase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>About Email Testing</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              This feature allows you to test the email notification system using dedicated Gmail credentials. You can
              choose between simulation mode (which works in all environments) and real email mode (which only works in
              production).
            </p>
            <p>
              The simulation validates all inputs and formats the email exactly as it would be sent in production, but
              doesn't make actual SMTP connections to avoid environment limitations.
            </p>
          </AlertDescription>
        </Alert>

        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Environment Limitations</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Due to browser and edge runtime limitations, direct SMTP connections (required for real email sending) may
              not work in development or preview environments.
            </p>
            <p>
              If you encounter a "dns.lookup is not implemented" error, use the simulation mode instead, which works in
              all environments.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
