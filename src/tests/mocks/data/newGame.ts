import type { InvitationDecision } from '@/lib/invitations';
import type { NewGameInput } from '@/types/NewGameInput';

export const defaultNewGameInput: NewGameInput = {
    overrideTimeCheck: false,
    customMessage: '',
};

export const defaultInvitationDecision: InvitationDecision = {
    status: 'ready',
    reason: 'ready',
    overrideTimeCheck: false,
    customMessage: null,
};

export const createMockInvitationDecision = (
    overrides: Partial<InvitationDecision> = {},
): InvitationDecision => ({
    ...defaultInvitationDecision,
    ...overrides,
});
