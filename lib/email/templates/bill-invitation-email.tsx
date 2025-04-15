import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components"

interface BillInvitationEmailProps {
  userName: string
  billTitle: string
  billAmount: number
  currency: string
  inviterName: string
  billId: string
  billDate: string
  appUrl: string
}

export function BillInvitationEmail({
  userName,
  billTitle,
  billAmount,
  currency,
  inviterName,
  billId,
  billDate,
  appUrl,
}: BillInvitationEmailProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(billAmount)

  const formattedDate = new Date(billDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const previewText = `${inviterName} has invited you to split "${billTitle}"`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You've Been Invited to Split a Bill</Heading>

          <Section style={section}>
            <Text style={text}>Hello {userName},</Text>
            <Text style={text}>
              {inviterName} has invited you to split a bill titled "{billTitle}" on ShareEase.
            </Text>

            <Section style={billDetails}>
              <Heading as="h2" style={h2}>
                Bill Details
              </Heading>
              <Text style={detailItem}>
                <strong>Title:</strong> {billTitle}
              </Text>
              <Text style={detailItem}>
                <strong>Amount:</strong> {formattedAmount}
              </Text>
              <Text style={detailItem}>
                <strong>Date:</strong> {formattedDate}
              </Text>
              <Text style={detailItem}>
                <strong>Added by:</strong> {inviterName}
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button pX={20} pY={12} style={button} href={`${appUrl}/bills/${billId}`}>
                View Bill
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This email was sent from ShareEase, the bill-splitting app that makes sharing expenses easy. If you don't
            want to receive these emails, you can{" "}
            <Link href={`${appUrl}/settings/notifications`} style={link}>
              update your notification preferences
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "4px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
}

const h1 = {
  color: "#2b725e",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const h2 = {
  color: "#2b725e",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "15px 0",
  padding: "0",
}

const section = {
  padding: "0 20px",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
}

const billDetails = {
  backgroundColor: "#f9f9f9",
  padding: "15px",
  borderRadius: "4px",
  margin: "20px 0",
}

const detailItem = {
  margin: "10px 0",
  fontSize: "14px",
  color: "#555",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#2b725e",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "22px",
}

const link = {
  color: "#2b725e",
}
