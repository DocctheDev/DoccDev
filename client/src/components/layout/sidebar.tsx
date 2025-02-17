import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Terminal,
  Bot,
  BarChart2,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Commands", href: "/commands", icon: Terminal },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-full w-60 flex-col bg-sidebar border-r border-border">
      <div className="flex h-14 items-center border-b border-border px-4">
        <h1 className="text-xl font-bold text-sidebar-foreground">Bot Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive
                      ? "text-sidebar-accent-foreground"
                      : "text-sidebar-foreground"
                  )}
                />
                {item.name}
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
