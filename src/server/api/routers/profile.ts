import { TRPCError } from '@trpc/server';
import z from 'zod';

import { createTRPCRouter, publicProcedure } from '@server/api/trpc';
import { prisma } from '@server/db';

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findFirst({
        select: { name: true, image: true },
        where: { name: { equals: input.username } },
      });

      if (!user)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      console.log(user);

      return user;
    }),
});
