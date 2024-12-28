import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Conference",
  "Workshop",
  "Meetup",
  "Hackathon",
  "Webinar",
  "Training",
];

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select(`
          *,
          communities (name, logo_url),
          tickets (id, price, quantity),
          registrations (id)
        `)
        .eq("is_published", true)
        .order("start_time", { ascending: true });

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: async ({ eventId, ticketId }: { eventId: string; ticketId: string }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to RSVP");
      }

      // Check if user has already registered
      const { data: existingRegistration, error: registrationCheckError } = await supabase
        .from("registrations")
        .select()
        .eq("event_id", eventId)
        .eq("user_id", session.session.user.id)
        .maybeSingle();

      if (registrationCheckError) throw registrationCheckError;

      if (existingRegistration) {
        throw new Error("You have already registered for this event");
      }

      // Check ticket availability
      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .select("quantity, registrations(count)")
        .eq("id", ticketId)
        .single();

      if (ticketError) throw ticketError;
      if (!ticket) {
        throw new Error("Ticket not found");
      }

      const registrationCount = ticket.registrations?.[0]?.count ?? 0;
      if (ticket.quantity && registrationCount >= ticket.quantity) {
        throw new Error("This event is fully booked");
      }

      const { data, error } = await supabase
        .from("registrations")
        .insert({
          event_id: eventId,
          ticket_id: ticketId,
          user_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully RSVP'd to this event.",
      });
    },
    onError: (error: Error) => {
      if (error.message === "You must be logged in to RSVP") {
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleCreateEvent = () => {
    navigate("/events/create");
  };

  const handleRSVP = async (eventId: string) => {
    const event = events?.find(e => e.id === eventId);
    if (!event?.tickets?.[0]?.id) {
      toast({
        title: "Error",
        description: "No tickets available for this event",
        variant: "destructive",
      });
      return;
    }
    rsvpMutation.mutate({ eventId, ticketId: event.tickets[0].id });
  };

  const renderSkeleton = () => (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Events</h1>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
            >
              {category}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          renderSkeleton()
        ) : (
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
                onRSVP={() => handleRSVP(event.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;