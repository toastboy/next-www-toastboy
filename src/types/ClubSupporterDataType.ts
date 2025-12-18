import { ClubSchema, ClubSupporterSchema } from 'prisma/zod/schemas';
import { z } from 'zod';

export const ClubSupporterDataSchema = ClubSupporterSchema.extend({
    club: ClubSchema,
});

export type ClubSupporterDataType = z.infer<typeof ClubSupporterDataSchema>;
