import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { EventsList } from "@/components/EventsList";
import { CategoryFilter } from "@/components/CategoryFilter";

const CATEGORIES = [
  "Conference",
  "Workshop",
  "Meetup",
  "Hackathon",
  "Webinar",
  "Training",
];

interface Event {
  id: string;
  title: string;
  start_time: string;
  location: string;
  registrations: any[];
  category: string;
  banner_url: string;
  tickets: { id: string }[];
  comments: { id: string }[];
  description?: string;
  is_online?: boolean;
  meeting_url?: string;
}

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
          registrations (id),
          comments (id)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      
      <main id="events-section" className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Discover Events</h2>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <EventsList 
          events={events}
          isLoading={isLoading}
          onRSVP={handleRSVP}
        />
      </main>
    </div>
  );
};

export default Index;