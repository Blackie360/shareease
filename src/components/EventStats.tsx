import { Calendar, Users, CheckCircle } from "lucide-react";

interface EventStatsProps {
  totalEvents: number;
  totalRSVPs: number;
  publishedEvents: number;
}

export function EventStats({ totalEvents, totalRSVPs, publishedEvents }: EventStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Events</p>
            <h3 className="text-2xl font-bold mt-1">{totalEvents}</h3>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total RSVPs</p>
            <h3 className="text-2xl font-bold mt-1">{totalRSVPs}</h3>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Published Events</p>
            <h3 className="text-2xl font-bold mt-1">{publishedEvents}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}