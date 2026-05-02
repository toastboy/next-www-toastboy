import type { ClubSchema, ClubSupporterSchema } from 'prisma/zod/schemas';
import type { z } from 'zod';

export type ClubSupporterDataType = z.infer<typeof ClubSupporterSchema> & {
    club: z.infer<typeof ClubSchema>;
};
