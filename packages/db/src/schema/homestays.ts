import { defineRelationsPart } from "drizzle-orm";
import { index, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const HOMESTAY_CATEGORIES = [
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

export type HomestayCategory = (typeof HOMESTAY_CATEGORIES)[number];

export const homestays = pgTable(
  "homestays",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    price: numeric("price", { precision: 14, scale: 2 }).notNull(),
    location: text("location").notNull(),
    category: text("category").$type<HomestayCategory>().notNull(),
    contactWa: text("contact_wa").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("homestays_userId_idx").on(table.userId)],
);

export const homestayRelations = defineRelationsPart({ homestays, user }, (r) => ({
  homestays: {
    user: r.one.user({
      from: r.homestays.userId,
      to: r.user.id,
    }),
  },
  user: {
    homestays: r.many.homestays({
      from: r.user.id,
      to: r.homestays.userId,
    }),
  },
}));

export type Homestay = typeof homestays.$inferSelect;
export type NewHomestay = typeof homestays.$inferInsert;

