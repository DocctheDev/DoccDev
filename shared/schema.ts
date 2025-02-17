import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  prefix: text("prefix").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
});

export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  response: text("response").notNull()
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  commandName: text("command_name").notNull(),
  usageCount: integer("usage_count").notNull().default(0),
  avgResponseTime: integer("avg_response_time").notNull().default(0)
});

export const insertBotSettingsSchema = createInsertSchema(botSettings).omit({ id: true });
export const insertCommandSchema = createInsertSchema(commands).omit({ id: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });

export type BotSettings = typeof botSettings.$inferSelect;
export type Command = typeof commands.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;
export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
