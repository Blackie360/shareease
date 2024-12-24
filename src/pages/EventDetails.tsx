import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

export default function EventDetails() {
  const { id } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
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
          <div className="prose max-w-none">
            <p>{event.description}</p>
          </div>
          <div className="mt-8 space-y-4">
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
              {event.is_online && event.meeting_url && (
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
        </div>
      </main>
    </div>
  );
}