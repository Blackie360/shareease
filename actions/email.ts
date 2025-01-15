"use server";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  // Check for required environment variables
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM environment variable is not set");
  }

  const message = {
    from: process.env.EMAIL_FROM,
    to: to.toLowerCase().trim(),
    subject: subject.trim(),
    text: text.trim(),
  };

  try {
    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error(`Resend API returned status code ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      messageId: data.id, // Resend's response includes an ID for the email
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
