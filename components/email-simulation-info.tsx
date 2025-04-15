"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon } from "lucide-react"

export function EmailSimulationInfo() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Email Testing Information</CardTitle>
        <CardDescription>Important details about email testing in this environment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Simulation Mode Active</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              In this preview environment, emails are simulated rather than actually sent. This allows you to test the
              email configuration interface without sending real emails.
            </p>
            <p className="mb-2">
              The simulation validates all inputs and formats the email exactly as it would be sent in production, but
              doesn't make actual SMTP connections.
            </p>
            <p>
              When deployed to a production environment with proper email configuration, this feature will send real
              emails using the specified credentials.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
