import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Event Management,{" "}
            <span className="text-primary block mt-2">Scalable</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and join amazing events happening around you. Connect with people who share your interests and create unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/events/create")} 
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              Create Event
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                const eventsSection = document.getElementById("events-section");
                eventsSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Browse Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}