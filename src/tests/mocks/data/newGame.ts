import type { InvitationDecision } from '@/lib/invitations';
import type { NewGameInput } from '@/types/actions/TriggerInvitations';

export const defaultNewGameInput = {
    overrideTimeCheck: false,
    customMessage: '',
} satisfies NewGameInput;

export const defaultInvitationDecision = {
    status: 'ready',
    reason: 'ready',
} satisfies InvitationDecision;

export const createMockInvitationDecision = (
    overrides: Partial<InvitationDecision> = {},
): InvitationDecision => ({
    ...defaultInvitationDecision,
    ...overrides,
});
