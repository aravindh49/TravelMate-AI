import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const checkAvailabilityFunction: FunctionDeclaration = {
  name: "checkAvailability",
  description: "Check if tickets are available for a specific attraction or movie.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: "The type of ticket: 'tourism' or 'movie'.",
      },
      title: {
        type: Type.STRING,
        description: "The name of the tourist attraction or the movie title.",
      },
      location: {
        type: Type.STRING,
        description: "The city or specific venue/cinema name.",
      },
      date: {
        type: Type.STRING,
        description: "The date and time for the visit or show (e.g., '2023-10-25' or 'tomorrow').",
      },
    },
    required: ["type", "title", "date"],
  },
};

export const bookTicketFunction: FunctionDeclaration = {
  name: "bookTicket",
  description: "Book tickets for a tourist attraction, monument, or movie.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: "The type of ticket: 'tourism' or 'movie'.",
      },
      title: {
        type: Type.STRING,
        description: "The name of the tourist attraction or the movie title.",
      },
      location: {
        type: Type.STRING,
        description: "The city or specific venue/cinema name.",
      },
      date: {
        type: Type.STRING,
        description: "The date and time for the visit or show (e.g., '2023-10-25').",
      },
      ticketCount: {
        type: Type.INTEGER,
        description: "The number of tickets to book.",
      },
    },
    required: ["type", "title", "date", "ticketCount"],
  },
};

export const getRecommendationsFunction: FunctionDeclaration = {
  name: "getRecommendations",
  description: "Get recommendations for nearby tourist attractions or currently showing movies based on a location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        description: "The type of recommendation: 'tourism' or 'movie'.",
      },
      location: {
        type: Type.STRING,
        description: "The base location to find nearby attractions or cinemas.",
      },
    },
    required: ["type", "location"],
  },
};

export function createChatSession(language: string = "English") {
  return ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: `You are TravelMate AI, a friendly, engaging, and highly intelligent multilingual Ticket Booking Assistant.
Your primary goal is to help users discover and book tickets for two main categories:
1. Tourism: Museums, historical monuments, cultural events, and tourist attractions.
2. Entertainment: Movies and cinema.

Personality & Tone:
- Be warm, enthusiastic, and conversational. Make the user feel like they are talking to a knowledgeable local guide or a movie buff.
- Use natural language, emojis where appropriate, and keep responses concise but informative.
- Always communicate in the user's preferred language (currently set to: ${language}). If the user switches languages, seamlessly adapt to their choice.

Booking Flow & Distinction:
- When a user asks for recommendations or wants to book, first clarify if they are looking for a 'tourism' experience or a 'movie' if it's not obvious from their prompt.
- For Tourism: Ask for the attraction name, city/location, date, and number of visitors. Share a brief, exciting fact about the attraction if possible.
- For Movies: Ask for the movie title, preferred cinema/location, date/time, and number of tickets.
- NEVER assume missing details. If you need the 'type', 'title', 'date', or 'ticketCount' to complete a booking, politely ask the user for the missing information before calling the \`bookTicket\` function.

Function Usage:
- Use \`checkAvailability\` when the user is just exploring options or asking if something is open/playing.
- Use \`getRecommendations\` when the user wants ideas for what to see or do in a specific location.
- Use \`bookTicket\` ONLY when you have gathered all necessary details (type, title, date, ticketCount) and the user has confirmed they want to proceed.

Sustainability Focus:
- Gently remind users that their tickets will be 100% digital and eco-friendly, contributing to a greener planet by reducing paper waste. Frame this as a positive, modern feature of their booking.`,
      tools: [
        {
          functionDeclarations: [
            checkAvailabilityFunction,
            bookTicketFunction,
            getRecommendationsFunction,
          ],
        },
      ],
      temperature: 0.7,
    },
  });
}
