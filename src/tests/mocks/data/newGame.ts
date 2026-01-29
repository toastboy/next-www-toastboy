import type { InvitationDecision } from '@/lib/invitations';
import type { NewGameInput } from '@/types/actions/TriggerInvitations';

export const defaultNewGameInput: NewGameInput = {
    overrideTimeCheck: false,
    customMessage: '',
};

export const defaultInvitationDecision: InvitationDecision = {
    status: 'ready',
    reason: 'ready',
};

export const createMockInvitationDecision = (
    overrides: Partial<InvitationDecision> = {},
): InvitationDecision => ({
    ...defaultInvitationDecision,
    ...overrides,
});
