import { describe, expect, it, vi } from 'vitest';

import { triggerInvitationsCore } from '@/lib/actions/triggerInvitations';
import { createMockInvitationDecision } from '@/tests/mocks/data/newGame';

describe('triggerInvitationsCore', () => {
    it('sends invitations when the decision is ready', async () => {
        const getInvitationDecision = vi.fn().mockResolvedValue(
            createMockInvitationDecision({
                status: 'ready',
                reason: 'ready',
                gameDayId: 42,
            }),
        );
        const sendGameInvitations = vi.fn();

        const decision = await triggerInvitationsCore(
            { overrideTimeCheck: true, customMessage: 'Heads up!' },
            { getInvitationDecision, sendGameInvitations },
        );

        expect(decision.status).toBe('ready');
        expect(sendGameInvitations).toHaveBeenCalledWith(42, 'Heads up!');
    });

    it('does not send invitations when the decision is skipped', async () => {
        const getInvitationDecision = vi.fn().mockResolvedValue(
            createMockInvitationDecision({
                status: 'skipped',
                reason: 'too-early',
            }),
        );
        const sendGameInvitations = vi.fn();

        const decision = await triggerInvitationsCore(
            { overrideTimeCheck: false, customMessage: '' },
            { getInvitationDecision, sendGameInvitations },
        );

        expect(decision.status).toBe('skipped');
        expect(sendGameInvitations).not.toHaveBeenCalled();
    });
});
