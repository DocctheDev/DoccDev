import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateCommandResponse, analyzeCommand } from "./openai";
import { insertCommandSchema, insertBotSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Bot Status Updates
  wss.on('connection', (ws) => {
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'status',
          data: { online: true, latency: Math.random() * 100 }
        }));
      }
    }, 5000);

    ws.on('close', () => clearInterval(interval));
  });

  // Bot Settings
  app.get('/api/settings', async (req, res) => {
    const settings = await storage.getBotSettings();
    res.json(settings || { id: 1, token: "", prefix: "!", name: "Bot", status: "offline" });
  });

  app.post('/api/settings', async (req, res) => {
    const settings = insertBotSettingsSchema.parse(req.body);
    const updated = await storage.updateBotSettings(settings);
    res.json(updated);
  });

  // Commands
  app.get('/api/commands', async (req, res) => {
    const commands = await storage.getCommands();
    res.json(commands);
  });

  app.post('/api/commands', async (req, res) => {
    const command = insertCommandSchema.parse(req.body);
    const created = await storage.createCommand(command);
    res.json(created);
  });

  app.patch('/api/commands/:id', async (req, res) => {
    const id = z.number().parse(Number(req.params.id));
    const command = insertCommandSchema.partial().parse(req.body);
    const updated = await storage.updateCommand(id, command);
    res.json(updated);
  });

  app.delete('/api/commands/:id', async (req, res) => {
    const id = z.number().parse(Number(req.params.id));
    await storage.deleteCommand(id);
    res.status(204).end();
  });

  // Analytics
  app.get('/api/analytics', async (req, res) => {
    const analytics = await storage.getAnalytics();
    res.json(analytics);
  });

  // AI Assistant
  app.post('/api/ai/generate', async (req, res) => {
    const { prompt } = z.object({ prompt: z.string() }).parse(req.body);
    const result = await generateCommandResponse(prompt);
    res.json(result);
  });

  app.post('/api/ai/analyze', async (req, res) => {
    const { command } = z.object({ command: z.string() }).parse(req.body);
    const result = await analyzeCommand(command);
    res.json(result);
  });

  return httpServer;
}
