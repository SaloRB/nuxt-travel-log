import type { z } from "zod";

import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import { locationLog } from "./location-log";

export const locationLogImage = sqliteTable("locationLogImage", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  locationLogId: int().notNull().references(() => locationLog.id),
  userId: int().notNull().references(() => user.id),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int()
    .notNull()
    .$default(() => Date.now())
    .$onUpdate(() => Date.now()),
});

export const locationLogImageRelations = relations(
  locationLogImage,
  ({ one }) => ({
    locationLog: one(locationLog, {
      fields: [locationLogImage.locationLogId],
      references: [locationLog.id],
    }),
  }),
);

export const InsertLocationLogImage = createInsertSchema(
  locationLogImage,
  {
    key: field => field.regex(/^\d+\/\d+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/,
    ),
  },
).omit({
  id: true,
  locationLogId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLocationLogImage = z.infer<typeof InsertLocationLogImage>;
export type SelectLocationLogImage = typeof locationLogImage.$inferSelect;
