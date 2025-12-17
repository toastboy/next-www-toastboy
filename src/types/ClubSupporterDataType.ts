import { z } from 'zod';

import { ClubSchema, ClubSupporterSchema } from '@/generated/zod/schemas';

export const ClubSupporterDataSchema = ClubSupporterSchema.extend({
    club: ClubSchema,
});

export type ClubSupporterDataType = z.infer<typeof ClubSupporterDataSchema>;
