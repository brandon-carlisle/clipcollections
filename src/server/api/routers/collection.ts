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

      return collections;
    }),

  getById: publicProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(({ ctx, input }) =>
      ctx.prisma.collection.findUnique({
        where: { id: input.collectionId },
        include: { clips: true, User: { select: { name: true, id: true } } },
      }),
    ),

  remove: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userForCollection = await ctx.prisma.collection.findUnique({
        where: { id: input.collectionId },
        select: { userId: true },
      });

      const isAuthor = ctx.session.user.id === userForCollection?.userId;

      if (isAuthor) {
        // Delete every clip from that collection
        await ctx.prisma.clip.deleteMany({
          where: { collectionId: input.collectionId },
        });

        // Delete the collection
        return await ctx.prisma.collection.delete({
          where: { id: input.collectionId },
        });
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not author of collection',
        });
      }
    }),
});
