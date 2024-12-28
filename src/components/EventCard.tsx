import { useState } from "react";
import { Calendar, MapPin, Users, MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RSVPDialog } from "./RSVPDialog";

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
}: EventCardProps) {
  const [isRSVPDialogOpen, setIsRSVPDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const defaultImage = "/placeholder.svg";
  const displayImage = imageUrl || defaultImage;

  const handleCommentSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to comment",
        });
        return;
      }

      const { error } = await supabase
        .from("comments")
        .insert({
          event_id: id,
          user_id: user.id,
          content: comment,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      setComment("");
      setIsCommentDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

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
          <Badge className="absolute top-4 right-4 bg-primary">{category}</Badge>
        </div>
        <CardHeader>
          <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span>{attendees} attendees</span>
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
            <Button onClick={handleRSVPClick} className="flex-1">
              RSVP
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img 
              src={displayImage} 
              alt={title} 
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{date}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>{attendees} attendees</span>
              </div>
              {description && (
                <p className="text-sm text-gray-600 mt-4">{description}</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleCommentSubmit} className="w-full">
              Submit Comment
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {ticketId && (
        <RSVPDialog
          isOpen={isRSVPDialogOpen}
          onClose={() => setIsRSVPDialogOpen(false)}
          eventId={id}
          ticketId={ticketId}
          eventTitle={title}
          isOnline={isOnline}
          meetingUrl={meetingUrl}
        />
      )}
    </>
  );
}