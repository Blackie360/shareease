import { Calendar, Home, Settings, Menu as MenuIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

const menuItems = [
  {
    title: "Overview",
    path: "/dashboard#overview",
    icon: Home,
  },
  {
    title: "Created Events",
    path: "/dashboard#created-events",
    icon: Calendar,
  },
  {
    title: "Attending Events",
    path: "/dashboard#attending-events",
    icon: Calendar,
  },
  {
    title: "Settings",
    path: "/account",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = (path: string) => {
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (location.pathname !== route) {
        navigate(path);
      } else {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

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
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                      isCollapsed ? 'justify-center' : ''
                    } ${location.pathname + location.hash === item.path ? 'bg-gray-100' : ''}`}
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