import { formSchema } from 'src/pages/create';

import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

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
    }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),
});
