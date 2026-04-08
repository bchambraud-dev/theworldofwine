import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sommyChat, type ChatMessage } from "./sommy";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Sommy Chat (JSON, matches production api/chat.js) ──
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { messages, image } = req.body as { messages: ChatMessage[]; image?: any };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array required" });
      }

      const text = await sommyChat(messages, image);
      return res.json({ text });
    } catch (error: any) {
      console.error("Sommy chat error:", error?.message || error);
      return res.status(500).json({ error: "Something went wrong. Try again." });
    }
  });

  return httpServer;
}
