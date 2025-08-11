import { z } from "zod";

export const respondToRequestSchema = z.object({
  requestId: z.number().int().positive(),
  status: z.enum(["approved", "rejected"]),
  reviewNotes: z.string().optional(),
  commissionRate: z
    .number()
    .min(0, "Commission rate must be at least 0%")
    .max(100, "Commission rate must not exceed 100%")
    .optional(),
});

export type RespondRequestBody = z.infer<typeof respondToRequestSchema>;