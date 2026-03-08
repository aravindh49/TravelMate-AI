import { MessageSquare, Ticket, Leaf, Settings as SettingsIcon } from "lucide-react";
import { View } from "../App";
import { cn, haptics } from "../lib/utils";

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navItems = [
    { id: "chat", label: "Assistant", icon: MessageSquare },
    { id: "tickets", label: "My Tickets", icon: Ticket },
    { id: "impact", label: "Eco Impact", icon: Leaf },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-[#e5e5e0] flex-col h-full shadow-sm z-10 hidden md:flex">
      <div className="p-6 border-b border-[#e5e5e0]">
        <h1 className="text-2xl font-bold tracking-tight text-[#5A5A40] flex items-center gap-2">
          <Leaf className="w-6 h-6" />
          TravelMate AI
        </h1>
        <p className="text-xs text-[#8E9299] mt-1 uppercase tracking-wider font-sans">
          Digital Tourism
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                haptics.light();
                setCurrentView(item.id);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-left",
                isActive
                  ? "bg-[#5A5A40] text-white shadow-md"
                  : "text-[#4a4a4a] hover:bg-[#f5f5f0] hover:text-[#1a1a1a]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-[#5A5A40]")} />
              <span className="font-medium font-sans text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e5e5e0]">
        <div className="bg-[#f5f5f0] p-4 rounded-2xl">
          <p className="text-xs font-sans text-[#4a4a4a] mb-2">Paper Saved Today</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-bold text-[#5A5A40]">124</span>
            <span className="text-xs font-sans text-[#8E9299] mb-1">sheets</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
