import { Calendar, Home, Users, Settings, Menu as MenuIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "My Events",
    path: "/events",
    icon: Calendar,
  },
  {
    title: "Communities",
    path: "/communities",
    icon: Users,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar className="border-r border-gray-200">
      <div className="flex items-center justify-between p-4">
        <h2 className={`font-semibold transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
          Dashboard
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}