import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sommyChat, type ChatMessage } from "./sommy";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Sommy Chat (streaming) ──
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { messages } = req.body as { messages: ChatMessage[] };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array required" });
      }

      // Set up SSE for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      await sommyChat(messages, (chunk: string) => {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      });

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("Sommy chat error:", error?.message || error);
      // If headers already sent, just end
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Something went wrong. Let me try again." })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Chat failed" });
      }
    }
  });

  return httpServer;
}
