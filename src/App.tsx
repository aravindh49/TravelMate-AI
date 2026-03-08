/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { TicketDashboard } from "./components/TicketDashboard";
import { ImpactDashboard } from "./components/ImpactDashboard";
import { Settings } from "./components/Settings";
import { MessageSquare, Ticket, Leaf, Settings as SettingsIcon } from "lucide-react";
import { cn, haptics } from "./lib/utils";

export type View = "chat" | "tickets" | "impact" | "settings";

export interface TicketData {
  id: string;
  type: "tourism" | "movie";
  title: string;
  location?: string;
  date: string;
  ticketCount: number;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>("chat");
  const [language, setLanguage] = useState("English");
  const [tickets, setTickets] = useState<TicketData[]>([]);

  const addTicket = (ticket: Omit<TicketData, "id" | "createdAt" | "status">) => {
    const newTicket: TicketData = {
      ...ticket,
      id: `TKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    setTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const navItems = [
    { id: "chat", label: "Assistant", icon: MessageSquare },
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "impact", label: "Impact", icon: Leaf },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#f5f5f0] font-serif text-[#1a1a1a]">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-hidden relative pb-16 md:pb-0">
        {currentView === "chat" && (
          <ChatInterface language={language} addTicket={addTicket} />
        )}
        {currentView === "tickets" && <TicketDashboard tickets={tickets} />}
        {currentView === "impact" && <ImpactDashboard tickets={tickets} />}
        {currentView === "settings" && (
          <Settings language={language} setLanguage={setLanguage} />
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e0] flex justify-around p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
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
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                isActive ? "text-[#5A5A40]" : "text-[#8E9299]"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-[#5A5A40]/20")} />
              <span className="text-[10px] font-sans uppercase tracking-wider font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
