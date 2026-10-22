import {
  desc,
  eq,
  HOMESTAY_CATEGORIES,
  homestays,
  user,
} from "@myrehat-task-b/db";
import { ORPCError } from "@orpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";

export const homestayCategorySchema = z.enum(HOMESTAY_CATEGORIES);

export const createHomestayInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  price: z.coerce.number().positive("Price must be a positive number"),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location is too long"),
  category: homestayCategorySchema,
  contactWa: z
    .string()
    .trim()
    .min(5, "WhatsApp contact must be at least 5 characters")
    .max(30, "WhatsApp contact is too long"),
});

export type CreateHomestayInput = z.infer<typeof createHomestayInputSchema>;

export const homestaysRouter = {
  list: publicProcedure.handler(async ({ context }) => {
    const results = await context.db
      .select({
        id: homestays.id,
        userId: homestays.userId,
        title: homestays.title,
        price: homestays.price,
        location: homestays.location,
        category: homestays.category,
        contactWa: homestays.contactWa,
        createdAt: homestays.createdAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(homestays)
      .leftJoin(user, eq(homestays.userId, user.id))
      .orderBy(desc(homestays.createdAt));

    return results;
  }),

  create: protectedProcedure
    .input(createHomestayInputSchema)
    .handler(async ({ input, context }) => {
      const inserted = await context.db
        .insert(homestays)
        .values({
          userId: context.session.user.id,
          title: input.title,
          price: String(input.price),
          location: input.location,
          category: input.category,
          contactWa: input.contactWa,
        })
        .returning();

      const newListing = inserted[0];
      if (!newListing) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to insert listing into database",
        });
      }
      return newListing;
    }),
};

