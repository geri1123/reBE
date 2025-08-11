import { z } from 'zod';

export const loginValidation = z.object({
  identifier: z.string().nonempty('Email or username is required'),
  password: z.string().nonempty('Password is required'),
});