import { z } from 'zod';

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Must be a valid email address' })
  .max(254, { message: 'Email address must not exceed 254 characters' });

const passwordField = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(128, { message: 'Password must not exceed 128 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' });

export const signupSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(128, { message: 'Password must not exceed 128 characters' }),
});

export type LoginInput = z.infer<typeof loginSchema>;