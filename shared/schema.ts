import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull(),
  prefix: text("prefix").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
});

export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  botSettingsId: integer("bot_settings_id").references(() => botSettings.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  response: text("response").notNull()
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  botSettingsId: integer("bot_settings_id").references(() => botSettings.id).notNull(),
  commandName: text("command_name").notNull(),
  usageCount: integer("usage_count").notNull().default(0),
  avgResponseTime: integer("avg_response_time").notNull().default(0)
});

// User schemas
const baseUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).omit({ 
  id: true,
  createdAt: true 
});

export const insertUserSchema = baseUserSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Bot settings schemas
export const insertBotSettingsSchema = createInsertSchema(botSettings).omit({ id: true });
export const insertCommandSchema = createInsertSchema(commands).omit({ id: true });
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type BotSettings = typeof botSettings.$inferSelect;
export type Command = typeof commands.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;
export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;