import { 
  BotSettings, InsertBotSettings,
  Command, InsertCommand,
  Analytics, InsertAnalytics,
  botSettings, commands, analytics
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  async getBotSettings(): Promise<BotSettings | undefined> {
    const [settings] = await db.select().from(botSettings).where(eq(botSettings.id, 1));
    return settings;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    const [updated] = await db
      .insert(botSettings)
      .values({ ...settings, id: 1 })
      .onConflictDoUpdate({
        target: botSettings.id,
        set: settings,
      })
      .returning();
    return updated;
  }

  async getCommands(): Promise<Command[]> {
    return await db.select().from(commands);
  }

  async getCommand(id: number): Promise<Command | undefined> {
    const [command] = await db.select().from(commands).where(eq(commands.id, id));
    return command;
  }

  async createCommand(command: InsertCommand): Promise<Command> {
    const [created] = await db.insert(commands).values(command).returning();
    return created;
  }

  async updateCommand(id: number, command: Partial<InsertCommand>): Promise<Command> {
    const [updated] = await db
      .update(commands)
      .set(command)
      .where(eq(commands.id, id))
      .returning();
    if (!updated) throw new Error('Command not found');
    return updated;
  }

  async deleteCommand(id: number): Promise<void> {
    await db.delete(commands).where(eq(commands.id, id));
  }

  async getAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics);
  }

  async updateAnalytics(commandName: string, responseTime: number): Promise<Analytics> {
    const [existing] = await db
      .select()
      .from(analytics)
      .where(eq(analytics.commandName, commandName));

    if (existing) {
      const usageCount = existing.usageCount + 1;
      const avgResponseTime = Math.round(
        (existing.avgResponseTime * existing.usageCount + responseTime) / usageCount
      );

      const [updated] = await db
        .update(analytics)
        .set({
          usageCount,
          avgResponseTime,
        })
        .where(eq(analytics.id, existing.id))
        .returning();

      return updated;
    }

    const [created] = await db
      .insert(analytics)
      .values({
        commandName,
        usageCount: 1,
        avgResponseTime: responseTime,
      })
      .returning();

    return created;
  }
}

export const storage = new DatabaseStorage();