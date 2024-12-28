import { useNavigate } from "react-router-dom";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventAttendeesList } from "./EventAttendeesList";

interface Event {
  id: string;
  title: string;
  start_time: string;
  is_online: boolean;
  is_published: boolean;
  registrations: { count: number }[];
}

interface EventsTableProps {
  events: Event[];
  showActions?: boolean;
  onDelete?: (eventId: string) => void;
}

export function EventsTable({ events, showActions = true, onDelete }: EventsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {events?.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Event Name</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[80px]">RSVPs</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  {showActions && <TableHead className="min-w-[100px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
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
                      className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
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
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(event.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </div>
          {showActions && <EventAttendeesList eventId={event.id} />}
        </div>
      ))}
    </div>
  );
}