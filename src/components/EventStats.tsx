import { Calendar, Users } from "lucide-react";

interface EventStatsProps {
  totalEvents: number;
  totalRSVPs: number;
  publishedEvents: number;
}

export function EventStats({ totalEvents, totalRSVPs, publishedEvents }: EventStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Total Events</h3>
        </div>
        <p className="text-3xl font-bold mt-2">{totalEvents}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Total RSVPs</h3>
        </div>
        <p className="text-3xl font-bold mt-2">{totalRSVPs}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Published Events</h3>
        </div>
        <p className="text-3xl font-bold mt-2">{publishedEvents}</p>
      </div>
    </div>
  );
}