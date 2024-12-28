import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventStats } from "@/components/EventStats";
import { EventsTable } from "@/components/EventsTable";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Plus, Loader2 } from "lucide-react";

export default function EventDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUserId();
  }, []);

  const { data: createdEvents, isLoading: createdEventsLoading } = useQuery({
    queryKey: ["user-created-events", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          registrations (count)
        `)
        .eq("created_by", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: attendedEvents, isLoading: attendedEventsLoading } = useQuery({
    queryKey: ["user-attended-events", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("registrations")
        .select(`
          event_id,
          events (
            *,
            registrations (count)
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return data.map(registration => registration.events);
    },
    enabled: !!userId,
  });

  const handleDelete = async (eventId: string) => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event",
      });
    } else {
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    }
  };

  if (createdEventsLoading || attendedEventsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  const totalRSVPs = createdEvents?.reduce(
    (acc, event) => acc + (event.registrations?.[0]?.count || 0),
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)]">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                <Button onClick={() => navigate("/events/create")} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Event
                </Button>
              </div>

              <Tabs defaultValue="created" className="space-y-8">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="created" className="flex-1 sm:flex-none">Events I Created</TabsTrigger>
                  <TabsTrigger value="attending" className="flex-1 sm:flex-none">Events I'm Attending</TabsTrigger>
                </TabsList>

                <TabsContent value="created" className="space-y-8">
                  <EventStats
                    totalEvents={createdEvents?.length || 0}
                    totalRSVPs={totalRSVPs}
                    publishedEvents={createdEvents?.filter((event) => event.is_published).length || 0}
                  />
                  <div className="bg-white rounded-lg shadow-sm">
                    <EventsTable 
                      events={createdEvents || []} 
                      onDelete={handleDelete}
                      showActions={true}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="attending">
                  <div className="bg-white rounded-lg shadow-sm">
                    <EventsTable 
                      events={attendedEvents || []} 
                      showActions={false}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}