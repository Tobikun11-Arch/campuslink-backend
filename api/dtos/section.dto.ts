import { z } from 'zod';

export const joinSectionDto = z.object({
  token: z.string().min(1)
});

export type JoinSectionDto = z.infer<typeof joinSectionDto>;
