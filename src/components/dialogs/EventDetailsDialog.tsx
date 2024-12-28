import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  date: string;
  location: string;
  attendees: number;
  description?: string;
  imageUrl: string;
}

export function EventDetailsDialog({
  isOpen,
  onClose,
  title,
  date,
  location,
  attendees,
  description,
  imageUrl,
}: EventDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-[#9b87f5]" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-[#9b87f5]" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 text-[#9b87f5]" />
              <span>{attendees} attendees</span>
            </div>
            {description && (
              <p className="text-sm text-gray-600 mt-4">{description}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}