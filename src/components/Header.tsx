import { Button } from "@/components/ui/button";

export function Header() {
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
          <Button asChild variant="outline">
            <a href="/login">Sign In</a>
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