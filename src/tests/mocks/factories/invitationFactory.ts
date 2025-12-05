import { InvitationType } from 'prisma/generated/schemas/models/Invitation.schema';

import { defaultInvitation } from '@/tests/mocks/data/invitation';

export const createMockInvitation = (overrides: Partial<InvitationType> = {}): InvitationType => ({
    ...defaultInvitation,
    ...overrides,
});
