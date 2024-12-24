import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Categories for tech events
const CATEGORIES = [
  "Conference",
  "Workshop",
  "Meetup",
  "Hackathon",
  "Webinar",
  "Training",
];

const Index = () => {
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
          tickets (price),
          registrations (id)
        `)
        .eq("is_published", true)
        .order("start_time", { ascending: true });

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

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
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Tech Events Near You
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join the community and connect with other tech enthusiasts
          </p>
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
                imageUrl={
                  event.banner_url ||
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;