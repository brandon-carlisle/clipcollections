import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@server/api/trpc';

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: { name: { equals: input.username } },
      });
    }),
});
