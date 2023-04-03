import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@server/api/trpc";

export const collectionRouter = createTRPCRouter({
  addCollection: publicProcedure
    .input(
      z.object({
        collectionName: z.string().min(1).max(16),
        clips: z
          .array(
            z.object({
              title: z.string(),
              url: z
                .string()
                .url()
                .startsWith(
                  "https://clips.twitch.tv/" || "https://www.twitch.tv/"
                ),
            })
          )
          .nonempty(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.collection.create({
        data: { name: input.collectionName, userId: ctx.session?.user.id },
      });

      const collection = await ctx.prisma.collection.findFirst({
        where: {
          name: { equals: input.collectionName },
          AND: { userId: { equals: ctx.session?.user.id } },
        },
      });

      input.clips.forEach(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (clip) =>
          await ctx.prisma.clip.create({
            data: {
              collectionId: collection?.id,
              title: clip.title,
              url: clip.url,
            },
          })
      );
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
