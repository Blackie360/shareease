import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RSVPForm } from "./RSVPForm";

interface RSVPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  ticketId: string;
  eventTitle: string;
  isOnline: boolean;
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>RSVP for {eventTitle}</DialogTitle>
        </DialogHeader>
        <RSVPForm
          eventId={eventId}
          ticketId={ticketId}
          eventTitle={eventTitle}
          isOnline={isOnline}
          meetingUrl={meetingUrl}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}