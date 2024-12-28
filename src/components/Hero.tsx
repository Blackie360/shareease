import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
        <img
          src="/lovable-uploads/ecb4cb59-db23-4ecb-ba8b-2e302faf1dfe.png"
          alt="Event Management Background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      
      <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Event Management,{" "}
            <span className="text-[#B08D57] block mt-2">Scalable</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover and join amazing events happening around you. Connect with people who share your interests and create unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/events/create")} 
              size="lg"
              className="bg-[#B08D57] hover:bg-[#96784A] text-white"
            >
              Create Event
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black"
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