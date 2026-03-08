import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { TicketData } from "../App";
import { MapPin, Calendar, Users, Download, Share2, Film, Landmark } from "lucide-react";
import { haptics } from "../lib/utils";

interface TicketDashboardProps {
  tickets: TicketData[];
}

export function TicketDashboard({ tickets }: TicketDashboardProps) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-24 h-24 bg-[#e5e5e0] rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-[#8E9299]" />
        </div>
        <h2 className="text-2xl font-bold text-[#5A5A40] mb-2">No tickets yet</h2>
        <p className="text-[#8E9299] font-sans max-w-md">
          Your digital tickets will appear here once you book them through the TravelMate AI assistant.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 bg-[#f5f5f0]">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#5A5A40] mb-2">My Digital Tickets</h1>
          <p className="text-[#8E9299] font-sans">Manage your eco-friendly bookings</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const TypeIcon = ticket.type === 'movie' ? Film : Landmark;
            return (
            <div key={ticket.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e5e5e0] flex flex-col">
              <div className="bg-[#5A5A40] text-white p-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-white/20 text-white text-xs font-sans px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                      <TypeIcon className="w-3 h-3" />
                      {ticket.type}
                    </span>
                    <span className="font-mono text-sm opacity-80">{ticket.id}</span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight mb-1">{ticket.title}</h3>
                  {ticket.location && <p className="text-sm opacity-90 flex items-center gap-1 mt-2"><MapPin className="w-3 h-3"/> {ticket.location}</p>}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-[#4a4a4a]">
                    <div className="w-8 h-8 rounded-full bg-[#f5f5f0] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-[#5A5A40]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8E9299] font-sans uppercase tracking-wider">Date</p>
                      <p className="font-medium">{ticket.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[#4a4a4a]">
                    <div className="w-8 h-8 rounded-full bg-[#f5f5f0] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#5A5A40]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8E9299] font-sans uppercase tracking-wider">Admit</p>
                      <p className="font-medium">{ticket.ticketCount} {ticket.ticketCount === 1 ? 'Person' : 'People'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-[#e5e5e0] pt-6 flex items-center justify-between">
                  <div className="bg-white p-2 rounded-xl border border-[#e5e5e0] shadow-sm">
                    <QRCodeSVG value={ticket.id} size={80} fgColor="#1a1a1a" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => haptics.light()} className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f0] hover:bg-[#e5e5e0] text-[#4a4a4a] rounded-full text-sm font-sans transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button onClick={() => haptics.light()} className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f0] hover:bg-[#e5e5e0] text-[#4a4a4a] rounded-full text-sm font-sans transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}
