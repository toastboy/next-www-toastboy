import { ClubSchema, ClubSupporterSchema } from 'prisma/generated/schemas';
import { z } from 'zod';

export const ClubSupporterDataSchema = ClubSupporterSchema.extend({
    club: ClubSchema,
});

export type ClubSupporterDataType = z.infer<typeof ClubSupporterDataSchema>;
