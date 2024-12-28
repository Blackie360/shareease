import { X, Calendar, MapPin, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface RSVPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  ticketId: string;
  eventTitle: string;
  isOnline?: boolean;
  meetingUrl?: string;
}

export function RSVPDialog({
  isOpen,
  onClose,
  eventId,
  ticketId,
  eventTitle,
  isOnline,
  meetingUrl,
}: RSVPDialogProps) {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  const handleSubmit = async () => {
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
        });

      if (registrationError) throw registrationError;

      toast({
        title: "Success!",
        description: "Your RSVP has been confirmed.",
      });

      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-lg">
        <div className="relative p-6 space-y-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent">
              Upcoming Event
            </h2>
            <p className="text-gray-600">
              Join us for an unforgettable experience!
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-[#9b87f5]" />
              <span>Event Organizer</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5 text-[#9b87f5]" />
              <span>To be announced</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-[#9b87f5]" />
              <span>To be determined</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-[#9b87f5]" />
              <span>0 people are going</span>
            </div>
          </div>

          <div className="space-y-4">
            {!userEmail && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail || ""}
                    readOnly
                    className="w-full bg-gray-50"
                    placeholder="Enter your email"
                  />
                </div>
              </>
            )}
            {userEmail && (
              <div className="text-sm text-gray-600">
                Registering with email: {userEmail}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#9b87f5] to-[#D946EF] hover:opacity-90 text-white py-3 rounded-full"
          >
            {isSubmitting ? "Processing..." : "RSVP Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}