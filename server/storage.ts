import { 
  BotSettings, InsertBotSettings,
  Command, InsertCommand,
  Analytics, InsertAnalytics
} from "@shared/schema";

export interface IStorage {
  // Bot Settings
  getBotSettings(): Promise<BotSettings | undefined>;
  updateBotSettings(settings: InsertBotSettings): Promise<BotSettings>;

  // Commands
  getCommands(): Promise<Command[]>;
  getCommand(id: number): Promise<Command | undefined>;
  createCommand(command: InsertCommand): Promise<Command>;
  updateCommand(id: number, command: Partial<InsertCommand>): Promise<Command>;
  deleteCommand(id: number): Promise<void>;

  // Analytics
  getAnalytics(): Promise<Analytics[]>;
  updateAnalytics(commandName: string, responseTime: number): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private botSettings?: BotSettings;
  private commands: Map<number, Command>;
  private analytics: Map<number, Analytics>;
  private currentCommandId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.commands = new Map();
    this.analytics = new Map();
    this.currentCommandId = 1;
    this.currentAnalyticsId = 1;
  }

  async getBotSettings(): Promise<BotSettings | undefined> {
    return this.botSettings;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    const updatedSettings = { id: 1, ...settings };
    this.botSettings = updatedSettings;
    return updatedSettings;
  }

  async getCommands(): Promise<Command[]> {
    return Array.from(this.commands.values());
  }

  async getCommand(id: number): Promise<Command | undefined> {
    return this.commands.get(id);
  }

  async createCommand(command: InsertCommand): Promise<Command> {
    const id = this.currentCommandId++;
    const newCommand: Command = {
      id,
      name: command.name,
      description: command.description,
      enabled: command.enabled ?? true,
      response: command.response
    };
    this.commands.set(id, newCommand);
    return newCommand;
  }

  async updateCommand(id: number, command: Partial<InsertCommand>): Promise<Command> {
    const existing = await this.getCommand(id);
    if (!existing) throw new Error('Command not found');

    const updated = { ...existing, ...command };
    this.commands.set(id, updated);
    return updated;
  }

  async deleteCommand(id: number): Promise<void> {
    this.commands.delete(id);
  }

  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }

  async updateAnalytics(commandName: string, responseTime: number): Promise<Analytics> {
    const existing = Array.from(this.analytics.values())
      .find(a => a.commandName === commandName);

    if (existing) {
      const usageCount = existing.usageCount + 1;
      const avgResponseTime = Math.round(
        (existing.avgResponseTime * existing.usageCount + responseTime) / usageCount
      );

      const updated = {
        ...existing,
        usageCount,
        avgResponseTime
      };

      this.analytics.set(existing.id, updated);
      return updated;
    }

    const id = this.currentAnalyticsId++;
    const newAnalytic = {
      id,
      commandName,
      usageCount: 1,
      avgResponseTime: responseTime
    };

    this.analytics.set(id, newAnalytic);
    return newAnalytic;
  }
}

export const storage = new MemStorage();