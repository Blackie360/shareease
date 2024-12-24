import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EventAttendeesListProps {
  eventId: string;
}

export function EventAttendeesList({ eventId }: EventAttendeesListProps) {
  const { data: attendees, isLoading } = useQuery({
    queryKey: ["event-attendees", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_event_attendees', { event_id: eventId });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading attendees...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Event Attendees</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees?.map((attendee) => (
            <TableRow key={attendee.registration_id}>
              <TableCell>{attendee.full_name}</TableCell>
              <TableCell>{attendee.email}</TableCell>
              <TableCell>{attendee.phone_number || '-'}</TableCell>
              <TableCell>{attendee.number_of_guests}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  attendee.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {attendee.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}