import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateCommandResponse, analyzeCommand } from "./openai";
import { insertCommandSchema, insertBotSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, ensureAuthenticated } from "./auth";
import rateLimit from 'express-rate-limit';

// Add rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 AI requests per hour
  message: 'AI request limit reached, please try again later'
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Set up authentication
  setupAuth(app);

  // Apply rate limiting to all API routes
  app.use('/api/', apiLimiter);

  // Additional rate limiting for AI endpoints
  app.use('/api/ai/', aiLimiter);

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

  // Protected Bot Settings Routes
  app.get('/api/settings', ensureAuthenticated, async (req: Request, res: Response) => {
    const settings = await storage.getBotSettingsByUserId((req.user as Express.User).id);
    res.json(settings);
  });

  app.post('/api/settings', ensureAuthenticated, async (req: Request, res: Response) => {
    const settings = insertBotSettingsSchema.parse({
      ...req.body,
      userId: (req.user as Express.User).id
    });
    const updated = await storage.updateBotSettings(settings);
    res.json(updated);
  });

  app.delete('/api/settings/:id', ensureAuthenticated, async (req: Request, res: Response) => {
    const id = z.number().parse(Number(req.params.id));
    await storage.deleteBotSettings(id);
    res.status(204).end();
  });

  // Protected Command Routes
  app.get('/api/commands/:botId', ensureAuthenticated, async (req: Request, res: Response) => {
    const botId = z.number().parse(Number(req.params.botId));
    const commands = await storage.getCommands(botId);
    res.json(commands);
  });

  app.post('/api/commands', ensureAuthenticated, async (req: Request, res: Response) => {
    const command = insertCommandSchema.parse(req.body);
    const created = await storage.createCommand(command);
    res.json(created);
  });

  app.patch('/api/commands/:id', ensureAuthenticated, async (req: Request, res: Response) => {
    const id = z.number().parse(Number(req.params.id));
    const command = insertCommandSchema.partial().parse(req.body);
    const updated = await storage.updateCommand(id, command);
    res.json(updated);
  });

  app.delete('/api/commands/:id', ensureAuthenticated, async (req: Request, res: Response) => {
    const id = z.number().parse(Number(req.params.id));
    await storage.deleteCommand(id);
    res.status(204).end();
  });

  // Protected Analytics Routes
  app.get('/api/analytics/:botId', ensureAuthenticated, async (req: Request, res: Response) => {
    const botId = z.number().parse(Number(req.params.botId));
    const analytics = await storage.getAnalytics(botId);
    res.json(analytics);
  });

  // Protected AI Routes
  app.post('/api/ai/generate', ensureAuthenticated, async (req: Request, res: Response) => {
    const { prompt } = z.object({ prompt: z.string() }).parse(req.body);
    const result = await generateCommandResponse(prompt);
    res.json(result);
  });

  app.post('/api/ai/analyze', ensureAuthenticated, async (req: Request, res: Response) => {
    const { command } = z.object({ command: z.string() }).parse(req.body);
    const result = await analyzeCommand(command);
    res.json(result);
  });

  return httpServer;
}