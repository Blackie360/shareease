import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function Header() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-primary">
          TechEvents
        </a>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/events" className="text-gray-600 hover:text-primary">
            Browse Events
          </a>
          <a href="/communities" className="text-gray-600 hover:text-primary">
            Communities
          </a>
          <Button onClick={handleLogout} variant="outline">
            Sign Out
          </Button>
          <Button asChild>
            <a href="/create-event">Create Event</a>
          </Button>
        </nav>
        <Button className="md:hidden" variant="outline" size="icon">
          <span className="sr-only">Open menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </div>
    </header>
  );
}