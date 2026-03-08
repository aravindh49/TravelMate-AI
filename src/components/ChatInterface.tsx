import { useState, useRef, useEffect } from "react";
import { Send, Mic, Loader2, MapPin, Calendar, Users, Film, Landmark } from "lucide-react";
import { createChatSession } from "../lib/gemini";
import { TicketData } from "../App";
import { cn, haptics } from "../lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  language: string;
  addTicket: (ticket: Omit<TicketData, "id" | "createdAt" | "status">) => TicketData;
}

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  isBooking?: boolean;
  ticketInfo?: TicketData;
}

export function ChatInterface({ language, addTicket }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createChatSession(language);
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: `Hello there! 👋 I'm TravelMate AI, your personal guide and ticket booking assistant.\n\nWhether you're looking to explore historical monuments, visit a museum, or catch the latest movie, I'm here to help you plan and book your next experience. \n\nWhat kind of adventure are you looking for today? (Language: ${language})`,
      },
    ]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    haptics.light();
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let response = await chatRef.current.sendMessage({ message: input });
      
      let modelText = "";
      let isBooking = false;
      let ticketInfo: TicketData | undefined;

      // Handle function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const call of response.functionCalls) {
          if (call.name === "checkAvailability") {
            const { type, title, location, date } = call.args as any;
            const result = { available: true, message: `Yes, tickets are available for ${title} ${location ? 'at ' + location : ''} on ${date}.` };
            response = await chatRef.current.sendMessage({
               message: `System: Function ${call.name} returned ${JSON.stringify(result)}. Please relay this to the user.`
            });
            modelText = response.text || "Tickets are available!";
          } else if (call.name === "bookTicket") {
            const { type, title, location, date, ticketCount } = call.args as any;
            const newTicket = addTicket({ type, title, location, date, ticketCount });
            ticketInfo = newTicket;
            isBooking = true;
            const result = { success: true, ticketId: newTicket.id, message: "Booking confirmed." };
            response = await chatRef.current.sendMessage({
               message: `System: Function ${call.name} returned ${JSON.stringify(result)}. Please confirm the booking to the user.`
            });
            modelText = response.text || `Booking confirmed! Your ticket ID is ${newTicket.id}.`;
          } else if (call.name === "getRecommendations") {
             const { type, location } = call.args as any;
             const result = type === 'movie' 
               ? { recommendations: ["Dune: Part Two", "Oppenheimer", "Spider-Man: Across the Spider-Verse"] }
               : { recommendations: ["Local Museum", "Historical Fort", "Botanical Garden"] };
             response = await chatRef.current.sendMessage({
               message: `System: Function ${call.name} returned ${JSON.stringify(result)}. Please suggest these to the user.`
            });
            modelText = response.text || "Here are some recommendations.";
          }
        }
      } else {
        // Only access text if there are no function calls to avoid SDK warnings
        try {
          modelText = response.text || "";
        } catch (e) {
          console.warn("Could not extract text from response", e);
        }
      }

      if (isBooking) {
        haptics.success();
      } else {
        haptics.medium();
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-model",
          role: "model",
          text: modelText,
          isBooking,
          ticketInfo,
        },
      ]);
    } catch (error: any) {
      console.error("Chat error:", error);
      haptics.error();
      
      let errorMessage = "I'm sorry, I encountered an error. Please try again.";
      
      // Handle rate limit (429) errors specifically
      if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.includes("RESOURCE_EXHAUSTED")) {
        errorMessage = "⚠️ I'm currently experiencing high traffic and have reached my rate limit. Please wait a moment and try again.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    // Simulated voice recording
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput("Book 2 tickets for Mysore Palace tomorrow");
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-4xl mx-auto md:shadow-xl md:border-x border-[#e5e5e0]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-3xl px-6 py-4 shadow-sm",
                msg.role === "user"
                  ? "bg-[#5A5A40] text-white rounded-br-sm"
                  : "bg-[#f5f5f0] text-[#1a1a1a] rounded-bl-sm"
              )}
            >
              <div className={cn(
                "font-sans text-[15px] leading-relaxed prose prose-sm max-w-none",
                msg.role === "user" ? "prose-invert" : "prose-stone"
              )}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              
              {msg.isBooking && msg.ticketInfo && (
                <div className="mt-4 bg-white rounded-2xl p-4 border border-[#e5e5e0] text-[#1a1a1a]">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#e5e5e0]">
                    <span className="font-bold text-sm uppercase tracking-wider text-[#5A5A40]">Digital Ticket</span>
                    <span className="font-mono text-xs bg-[#f5f5f0] px-2 py-1 rounded-md">{msg.ticketInfo.id}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {msg.ticketInfo.type === 'movie' ? <Film className="w-4 h-4 text-[#8E9299]" /> : <Landmark className="w-4 h-4 text-[#8E9299]" />}
                      <span className="font-medium">{msg.ticketInfo.title}</span>
                    </div>
                    {msg.ticketInfo.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-[#8E9299]" />
                        <span>{msg.ticketInfo.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-[#8E9299]" />
                      <span>{msg.ticketInfo.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#8E9299]" />
                      <span>{msg.ticketInfo.ticketCount} {msg.ticketInfo.ticketCount === 1 ? 'Ticket' : 'Tickets'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#f5f5f0] rounded-3xl rounded-bl-sm px-6 py-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#5A5A40]" />
              <span className="text-sm font-sans text-[#8E9299]">TravelMate AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-[#e5e5e0]">
        <div className="relative flex items-center">
          <button
            onClick={toggleRecording}
            className={cn(
              "absolute left-3 p-2 rounded-full transition-colors",
              isRecording ? "bg-red-100 text-red-500 animate-pulse" : "text-[#8E9299] hover:bg-[#f5f5f0]"
            )}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message or use voice..."
            className="w-full bg-[#f5f5f0] border-none rounded-full py-4 pl-14 pr-14 focus:outline-none focus:ring-2 focus:ring-[#5A5A40] font-sans text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 p-2 bg-[#5A5A40] text-white rounded-full hover:bg-[#4a4a30] disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-[10px] uppercase tracking-widest text-[#8E9299] font-sans">
            Powered by Gemini AI • 100% Digital Ticketing
          </span>
        </div>
      </div>
    </div>
  );
}
