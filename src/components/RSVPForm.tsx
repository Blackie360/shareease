import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { RSVPFormFields } from "./RSVPFormFields";

interface RSVPFormProps {
  eventId: string;
  ticketId: string;
  eventTitle: string;
  isOnline: boolean;
  meetingUrl?: string;
}

interface RSVPFormData {
  phoneNumber: string;
  dietaryPreferences: string;
  accessibilityRequirements: string;
  numberOfGuests: number;
  additionalNotes: string;
}

export function RSVPForm({ eventId, ticketId, eventTitle, isOnline, meetingUrl }: RSVPFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RSVPFormData>({
    defaultValues: {
      phoneNumber: "",
      dietaryPreferences: "",
      accessibilityRequirements: "",
      numberOfGuests: 1,
      additionalNotes: "",
    },
  });

  const sendConfirmationEmail = async (userEmail: string) => {
    console.log("Attempting to send confirmation email to:", userEmail);
    try {
      const emailContent = `
        <h1>Thank you for registering for ${eventTitle}!</h1>
        <p>Your registration has been confirmed.</p>
        ${isOnline ? `<p>Meeting Link: ${meetingUrl}</p>` : ""}
        <p>We'll send you more details closer to the event.</p>
      `;

      const { error } = await supabase.functions.invoke('send-event-email', {
        body: {
          to: [userEmail],
          subject: `Registration Confirmed: ${eventTitle}`,
          html: emailContent,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }
      
      console.log("Confirmation email sent successfully");
      return true;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw error;
    }
  };

  const onSubmit = async (data: RSVPFormData) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to RSVP",
        });
        return;
      }

      // First create the registration
      const { error: registrationError } = await supabase
        .from("registrations")
        .insert({
          event_id: eventId,
          ticket_id: ticketId,
          user_id: user.id,
          phone_number: data.phoneNumber,
          dietary_preferences: data.dietaryPreferences,
          accessibility_requirements: data.accessibilityRequirements,
          number_of_guests: data.numberOfGuests,
          additional_notes: data.additionalNotes,
        });

      if (registrationError) throw registrationError;

      // Then try to send the confirmation email
      let emailSent = false;
      try {
        emailSent = await sendConfirmationEmail(user.email!);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      // Show appropriate success message based on email status
      if (emailSent) {
        toast({
          title: "Success!",
          description: "Your RSVP has been confirmed and a confirmation email has been sent.",
        });
      } else {
        toast({
          title: "RSVP Successful",
          description: "Your RSVP was confirmed but we couldn't send the confirmation email. Please check your event details in the dashboard.",
        });
      }

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RSVPFormFields form={form} />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Confirm RSVP"}
        </Button>
      </form>
    </Form>
  );
}