import { z } from 'zod';

export const healthQuerySchema = z.object({
  echo: z
    .string()
    .max(100, { message: 'Echo parameter must not exceed 100 characters' })
    .optional(),
});

export type HealthQuery = z.infer<typeof healthQuerySchema>;

