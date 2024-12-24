import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, Edit, Trash, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  const renderEventTable = (events: any[], showActions = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>RSVPs</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {events?.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="font-medium">{event.title}</TableCell>
            <TableCell>
              {new Date(event.start_time).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {event.is_online ? "Virtual" : "Physical"}
            </TableCell>
            <TableCell>
              {event.registrations?.[0]?.count || 0}
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  event.is_published
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {event.is_published ? "Published" : "Draft"}
              </span>
            </TableCell>
            {showActions && (
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Events</h1>
          <Button onClick={() => navigate("/events/create")}>
            Create New Event
          </Button>
        </div>

        <Tabs defaultValue="created" className="space-y-6">
          <TabsList>
            <TabsTrigger value="created">Events I Created</TabsTrigger>
            <TabsTrigger value="attending">Events I'm Attending</TabsTrigger>
          </TabsList>

          <TabsContent value="created">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total Events</h3>
                <p className="text-3xl font-bold">{createdEvents?.length || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total RSVPs</h3>
                <p className="text-3xl font-bold">
                  {createdEvents?.reduce(
                    (acc, event) => acc + (event.registrations?.[0]?.count || 0),
                    0
                  ) || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Published Events</h3>
                <p className="text-3xl font-bold">
                  {createdEvents?.filter((event) => event.is_published).length || 0}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {renderEventTable(createdEvents || [])}
            </div>
          </TabsContent>

          <TabsContent value="attending">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {renderEventTable(attendedEvents || [], false)}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}