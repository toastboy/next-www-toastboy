import { triggerInvitations } from '@/actions/triggerInvitations';
import { sendGameInvitations } from '@/lib/gameInvitations';
import { getInvitationDecision } from '@/lib/invitations';
import { createMockInvitationDecision } from '@/tests/mocks';

jest.mock('@/lib/invitations', () => ({
    getInvitationDecision: jest.fn(),
}));

jest.mock('@/lib/gameInvitations', () => ({
    sendGameInvitations: jest.fn(),
}));

const mockGetInvitationDecision = getInvitationDecision as jest.MockedFunction<typeof getInvitationDecision>;
const mockSendGameInvitations = sendGameInvitations as jest.MockedFunction<typeof sendGameInvitations>;

describe('triggerInvitations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('sends invitations when the decision is ready', async () => {
        mockGetInvitationDecision.mockResolvedValue(
            createMockInvitationDecision({
                status: 'ready',
                reason: 'ready',
                gameDayId: 42,
                customMessage: 'Heads up!',
            }),
        );

        const decision = await triggerInvitations({
            overrideTimeCheck: true,
            customMessage: 'Heads up!',
        });

        expect(decision.status).toBe('ready');
        expect(mockSendGameInvitations).toHaveBeenCalledWith({
            gameDayId: 42,
            customMessage: 'Heads up!',
        });
    });

    it('does not send invitations when the decision is skipped', async () => {
        mockGetInvitationDecision.mockResolvedValue(
            createMockInvitationDecision({
                status: 'skipped',
                reason: 'too-early',
            }),
        );

        const decision = await triggerInvitations({
            overrideTimeCheck: false,
            customMessage: '',
        });

        expect(decision.status).toBe('skipped');
        expect(mockSendGameInvitations).not.toHaveBeenCalled();
    });
});
