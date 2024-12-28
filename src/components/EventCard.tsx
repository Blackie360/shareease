import { useState } from "react";
import { Calendar, MapPin, Users, MessageSquare } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RSVPDialog } from "./dialogs/RSVPDialog";
import { EventDetailsDialog } from "./dialogs/EventDetailsDialog";
import { CommentDialog } from "./dialogs/CommentDialog";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
  imageUrl: string;
  id: string;
  description?: string;
  isOnline?: boolean;
  meetingUrl?: string;
  ticketId?: string;
  onRSVP?: () => void;
  commentCount?: number;
}

export function EventCard({
  title,
  date,
  location,
  attendees,
  category,
  imageUrl,
  id,
  description,
  isOnline = false,
  meetingUrl,
  ticketId,
  onRSVP,
  commentCount = 0,
}: EventCardProps) {
  const [isRSVPDialogOpen, setIsRSVPDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const defaultImage = "/placeholder.svg";
  const displayImage = imageUrl || defaultImage;

  const handleRSVPClick = () => {
    if (ticketId) {
      setIsRSVPDialogOpen(true);
    } else {
      onRSVP?.();
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={displayImage} 
            alt={title} 
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
          <Badge className="absolute top-4 right-4 bg-[#9b87f5]">{category}</Badge>
        </div>
        <CardHeader>
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-[#9b87f5]" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-[#9b87f5]" />
            <span>{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2 text-[#9b87f5]" />
              <span>{attendees} attendees</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MessageSquare className="w-4 h-4 mr-2 text-[#9b87f5]" />
              <span>{commentCount} comments</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setIsDetailsDialogOpen(true)}
          >
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsCommentDialogOpen(true)}
            className="px-2"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          {(onRSVP || ticketId) && (
            <Button 
              onClick={handleRSVPClick}
              className="flex-1 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] hover:opacity-90"
            >
              RSVP
            </Button>
          )}
        </CardFooter>
      </Card>

      <RSVPDialog
        isOpen={isRSVPDialogOpen}
        onClose={() => setIsRSVPDialogOpen(false)}
        eventId={id}
        ticketId={ticketId || ""}
        eventTitle={title}
        isOnline={isOnline}
        meetingUrl={meetingUrl}
      />

      <EventDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        title={title}
        date={date}
        location={location}
        attendees={attendees}
        description={description}
        imageUrl={displayImage}
      />

      <CommentDialog
        isOpen={isCommentDialogOpen}
        onClose={() => setIsCommentDialogOpen(false)}
        eventId={id}
      />
    </>
  );
}