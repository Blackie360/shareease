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
}

export function EventCard({ title, date, location, attendees, category, imageUrl, id }: EventCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
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
      <CardFooter>
        <Button asChild className="w-full">
          <a href={`/events/${id}`}>View Details</a>
        </Button>
      </CardFooter>
    </Card>
  );
}