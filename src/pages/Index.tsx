import { useState } from "react";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { SearchBar } from "@/components/SearchBar";

// Mock data for initial development
const MOCK_EVENTS = [
  {
    id: "1",
    title: "React Conference 2024",
    date: "June 15, 2024",
    location: "San Francisco, CA",
    attendees: 500,
    category: "Conference",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "AI & Machine Learning Workshop",
    date: "July 1, 2024",
    location: "New York, NY",
    attendees: 200,
    category: "Workshop",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "DevOps Meetup",
    date: "July 10, 2024",
    location: "Austin, TX",
    attendees: 150,
    category: "Meetup",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = MOCK_EVENTS.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;