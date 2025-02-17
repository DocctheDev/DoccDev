import { 
  BotSettings, InsertBotSettings,
  Command, InsertCommand,
  Analytics, InsertAnalytics,
  User, InsertUser,
  botSettings, commands, analytics, users
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Bot Settings
  getBotSettings(): Promise<BotSettings[]>;
  getBotSettingsByUserId(userId: number): Promise<BotSettings[]>;
  updateBotSettings(settings: InsertBotSettings): Promise<BotSettings>;
  deleteBotSettings(id: number): Promise<void>;

  // Commands
  getCommands(botSettingsId: number): Promise<Command[]>;
  getCommand(id: number): Promise<Command | undefined>;
  createCommand(command: InsertCommand): Promise<Command>;
  updateCommand(id: number, command: Partial<InsertCommand>): Promise<Command>;
  deleteCommand(id: number): Promise<void>;

  // Analytics
  getAnalytics(botSettingsId: number): Promise<Analytics[]>;
  updateAnalytics(commandName: string, responseTime: number, botSettingsId: number): Promise<Analytics>;
}

export class DatabaseStorage implements IStorage {
  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  // Bot Settings
  async getBotSettings(): Promise<BotSettings[]> {
    return await db.select().from(botSettings);
  }

  async getBotSettingsByUserId(userId: number): Promise<BotSettings[]> {
    return await db.select().from(botSettings).where(eq(botSettings.userId, userId));
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    const [updated] = await db
      .insert(botSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: botSettings.id,
        set: settings,
      })
      .returning();
    return updated;
  }

  async deleteBotSettings(id: number): Promise<void> {
    await db.delete(botSettings).where(eq(botSettings.id, id));
  }

  // Commands
  async getCommands(botSettingsId: number): Promise<Command[]> {
    return await db.select().from(commands).where(eq(commands.botSettingsId, botSettingsId));
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

  // Analytics
  async getAnalytics(botSettingsId: number): Promise<Analytics[]> {
    return await db.select().from(analytics).where(eq(analytics.botSettingsId, botSettingsId));
  }

  async updateAnalytics(commandName: string, responseTime: number, botSettingsId: number): Promise<Analytics> {
    const [existing] = await db
      .select()
      .from(analytics)
      .where(eq(analytics.commandName, commandName))
      .where(eq(analytics.botSettingsId, botSettingsId));

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
        botSettingsId,
        usageCount: 1,
        avgResponseTime: responseTime,
      })
      .returning();

    return created;
  }
}

export const storage = new DatabaseStorage();