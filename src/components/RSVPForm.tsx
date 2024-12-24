import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const emailContent = `
        <h1>Thank you for registering for ${eventTitle}!</h1>
        <p>Your registration has been confirmed.</p>
        ${isOnline ? `<p>Meeting Link: ${meetingUrl}</p>` : ""}
        <p>We'll send you more details closer to the event.</p>
      `;

      await fetch("/api/send-event-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          to: [userEmail],
          subject: `Registration Confirmed: ${eventTitle}`,
          html: emailContent,
        }),
      });
    } catch (error) {
      console.error("Error sending confirmation email:", error);
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

      // Send confirmation email
      await sendConfirmationEmail(user.email!);

      toast({
        title: "Success!",
        description: "Your RSVP has been confirmed.",
      });

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
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Preferences (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any dietary requirements or preferences?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessibilityRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility Requirements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any accessibility requirements we should know about?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Guests</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information you'd like to share?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Confirm RSVP"}
        </Button>
      </form>
    </Form>
  );
}