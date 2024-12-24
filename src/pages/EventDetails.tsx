import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { RSVPForm } from "@/components/RSVPForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EventDetails() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const { data: registration, isLoading: registrationLoading } = useQuery({
    queryKey: ["registration", id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("event_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  if (eventLoading || ticketLoading || registrationLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p>Event not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {event.banner_url && (
            <img
              src={event.banner_url}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <div className="prose max-w-none mb-8">
            <p>{event.description}</p>
          </div>
          <div className="mb-8 space-y-4">
            <div>
              <h3 className="font-semibold">Date & Time</h3>
              <p>
                {new Date(event.start_time).toLocaleString()} -{" "}
                {new Date(event.end_time).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{event.is_online ? "Virtual Event" : event.location}</p>
              {event.is_online && event.meeting_url && registration && (
                <p>Meeting Link: {event.meeting_url}</p>
              )}
            </div>
            {event.max_attendees && (
              <div>
                <h3 className="font-semibold">Capacity</h3>
                <p>{event.max_attendees} attendees</p>
              </div>
            )}
          </div>

          {!registration && ticket ? (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">RSVP for this event</h2>
              <RSVPForm
                eventId={event.id}
                ticketId={ticket.id}
                eventTitle={event.title}
                isOnline={event.is_online}
                meetingUrl={event.meeting_url}
              />
            </div>
          ) : registration ? (
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                You're registered for this event!
              </h2>
              {event.is_online && event.meeting_url && (
                <p className="text-green-700">
                  Join using the meeting link above when the event starts.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <p className="text-yellow-800">
                No tickets are available for this event.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}