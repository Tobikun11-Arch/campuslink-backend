import {z} from 'zod';

export const registerDto = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  campus: z.string().min(1),
  role: z.enum(['NORMAL', 'OFFICER', 'PRESIDENT']).optional(),
  roleProofFileId: z.string().optional(),
  roleProofUrl: z.string().url().optional()
});

export const verifyDto = z.object({
  email: z.string().email(),
  code: z.string().min(4)
});

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type RegisterDto = z.infer<typeof registerDto>;
export type VerifyDto = z.infer<typeof verifyDto>;
export type LoginDto = z.infer<typeof loginDto>;