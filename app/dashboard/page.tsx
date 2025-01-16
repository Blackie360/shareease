import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Music, BarChart, MessageCircle, Zap } from "lucide-react";
import { auth } from "@/auth";
import { headers } from "next/headers";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-50 to-pink-50 py-10 px-6">
      <div className="container mx-auto">
        {/* Dashboard Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Welcome to Your Dashboard
        </h1>

        {/* User Welcome Section */}
        <div className="mb-10 text-center">
          <h2 className="text-xl font-medium text-gray-700">
            Hello, <span className="text-blue-600 font-bold">{session?.user?.name || "Guest"}</span>!
          </h2>
          <p className="text-gray-500">Here's your latest activity overview.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-8 md:grid-cols-6">
          {/* Large Card */}
          <Card className="md:col-span-4 bg-white shadow-xl hover:shadow-2xl transform transition-transform hover:scale-105 rounded-xl">
            <CardHeader>
              <CardTitle className="text-indigo-600 text-2xl font-semibold">
                User Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-lg">Active users this month: <b>5,324</b></p>
              <p className="text-gray-600 text-lg">New Signups: <b>1,234</b></p>
              <BarChart className="w-full h-32 text-indigo-400 mt-4" />
            </CardContent>
          </Card>

          {/* Medium Card */}
          <Card className="md:col-span-2 bg-white shadow-xl hover:shadow-2xl transform transition-transform hover:scale-105 rounded-xl">
            <CardHeader>
              <CardTitle className="text-pink-600 text-2xl font-semibold">
                Top Songs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2 text-lg">
                <li>🎵 <b>Song A</b> - 12,045 plays</li>
                <li>🎵 <b>Song B</b> - 9,876 plays</li>
                <li>🎵 <b>Song C</b> - 8,543 plays</li>
              </ul>
            </CardContent>
          </Card>

          {/* Small Cards */}
          {[
            { icon: Users, title: "Total Users", value: "12,345", color: "text-blue-500 bg-blue-100" },
            { icon: Music, title: "Total Songs", value: "23,456", color: "text-green-500 bg-green-100" },
            { icon: MessageCircle, title: "Messages", value: "1,234", color: "text-yellow-500 bg-yellow-100" },
            { icon: Zap, title: "Real-time Streams", value: "876", color: "text-purple-500 bg-purple-100" },
          ].map((stat, index) => (
            <Card
              key={index}
              className={`md:col-span-3 sm:col-span-6 shadow-xl hover:shadow-2xl transform transition-transform hover:scale-105 rounded-xl p-4 flex items-center ${stat.color}`}
            >
              <stat.icon className="h-14 w-14 mr-4" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">{stat.title}</h3>
                <p className="text-gray-600 text-lg">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
