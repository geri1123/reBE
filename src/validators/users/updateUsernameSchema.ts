import { z } from "zod";

export const changeUsernameSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long." }) 
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
});

export type ChangeUsernameBody = z.infer<typeof changeUsernameSchema>;
