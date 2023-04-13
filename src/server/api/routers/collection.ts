import { TRPCError } from '@trpc/server';
import { formSchema } from 'src/pages/create';
import z from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@server/api/trpc';

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(formSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.collection.create({
        data: { name: input.collectionTitle, userId: ctx.session?.user.id },
      });

      const collection = await ctx.prisma.collection.findFirst({
        where: {
          name: { equals: input.collectionTitle },
          AND: { userId: { equals: ctx.session?.user.id } },
        },
      });

      const clips = input.clips.map((clip) => ({
        collectionId: collection?.id,
        title: clip.title,
        url: clip.url,
      }));

      await ctx.prisma.clip.createMany({ data: clips });

      return {
        collectionId: collection?.id,
        username: ctx.session.user.name,
      };
    }),

  getAllByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const collections = await ctx.prisma.collection.findMany({
        where: { userId: { equals: input.userId } },
        include: {
          User: { select: { name: true } },
        },
      });

      if (!collections || collections.length === 0)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No collections found for user',
        });

      console.log(collections);

      return collections;
    }),
});
