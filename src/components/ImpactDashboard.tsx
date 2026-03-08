import { Leaf, TreePine, Droplets, Wind } from "lucide-react";
import { TicketData } from "../App";
import { cn } from "../lib/utils";

interface ImpactDashboardProps {
  tickets: TicketData[];
}

export function ImpactDashboard({ tickets }: ImpactDashboardProps) {
  // Mock calculations based on tickets
  const totalTickets = tickets.reduce((acc, t) => acc + t.ticketCount, 0);
  const paperSaved = totalTickets * 2; // Assuming 2 sheets per ticket
  const carbonSaved = totalTickets * 0.5; // kg CO2
  const waterSaved = totalTickets * 5; // liters

  const stats = [
    {
      id: "paper",
      label: "Paper Saved",
      value: paperSaved,
      unit: "sheets",
      icon: Leaf,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      id: "carbon",
      label: "CO₂ Reduced",
      value: carbonSaved.toFixed(1),
      unit: "kg",
      icon: Wind,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "water",
      label: "Water Conserved",
      value: waterSaved,
      unit: "liters",
      icon: Droplets,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      id: "trees",
      label: "Trees Planted",
      value: Math.floor(totalTickets / 10),
      unit: "trees",
      icon: TreePine,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-8 bg-[#f5f5f0]">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#5A5A40] mb-2">Sustainability Impact</h1>
          <p className="text-[#8E9299] font-sans">Track your contribution to a greener planet</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#e5e5e0] flex flex-col items-center text-center">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", stat.bg)}>
                  <Icon className={cn("w-8 h-8", stat.color)} />
                </div>
                <h3 className="text-4xl font-light text-[#1a1a1a] mb-1">{stat.value}</h3>
                <p className="text-sm font-sans text-[#8E9299] uppercase tracking-wider">{stat.unit}</p>
                <div className="mt-4 pt-4 border-t border-[#e5e5e0] w-full">
                  <p className="text-sm font-medium text-[#5A5A40]">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e5e5e0]">
          <h2 className="text-2xl font-bold text-[#5A5A40] mb-6">Your Eco Journey</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#e5e5e0]"></div>
            <div className="space-y-8 relative">
              <div className="flex gap-6">
                <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shrink-0 z-10">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1a1a1a]">Digital First</h4>
                  <p className="text-[#8E9299] font-sans">You chose 100% digital ticketing, eliminating physical waste.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shrink-0 z-10">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1a1a1a]">Smart Routing</h4>
                  <p className="text-[#8E9299] font-sans">TravelMate AI suggests nearby attractions to minimize travel emissions.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-8 h-8 rounded-full bg-[#e5e5e0] text-[#8E9299] flex items-center justify-center shrink-0 z-10">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#8E9299]">Carbon Neutral</h4>
                  <p className="text-[#8E9299] font-sans">Unlock this milestone by booking 10 more tickets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
