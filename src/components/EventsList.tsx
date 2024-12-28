import { EventCard } from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: string;
  title: string;
  start_time: string;
  location: string;
  registrations: any[];
  category: string;
  banner_url: string;
  tickets: { id: string }[];
}

interface EventsListProps {
  events: Event[] | undefined;
  isLoading: boolean;
  onRSVP: (eventId: string) => void;
}

export function EventsList({ events, isLoading, onRSVP }: EventsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events?.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={new Date(event.start_time).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          location={event.location || "Online Event"}
          attendees={event.registrations?.length || 0}
          category={event.category || "Event"}
          imageUrl={event.banner_url}
          onRSVP={() => onRSVP(event.id)}
        />
      ))}
    </div>
  );
}