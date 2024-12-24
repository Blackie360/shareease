import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
  imageUrl: string;
  id: string;
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
  onRSVP,
}: EventCardProps) {
  // Use a default image if imageUrl is not provided
  const defaultImage = "/placeholder.svg";
  const displayImage = imageUrl || defaultImage;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={displayImage} 
          alt={title} 
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback to default image if the provided URL fails to load
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
        <Button asChild variant="outline" className="flex-1">
          <a href={`/events/${id}`}>View Details</a>
        </Button>
        {onRSVP && (
          <Button onClick={onRSVP} className="flex-1">
            RSVP
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}