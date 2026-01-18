import { submitGameInvitationResponse } from '@/actions/submitGameInvitationResponse';
import gameDayService from '@/services/GameDay';
import gameInvitationService from '@/services/GameInvitation';
import outcomeService from '@/services/Outcome';

jest.mock('@/services/GameInvitation');
jest.mock('@/services/GameDay');
jest.mock('@/services/Outcome');

const mockGameInvitationService = gameInvitationService as jest.Mocked<typeof gameInvitationService>;
const mockGameDayService = gameDayService as jest.Mocked<typeof gameDayService>;
const mockOutcomeService = outcomeService as jest.Mocked<typeof outcomeService>;

describe('submitGameInvitationResponse', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGameInvitationService.get.mockResolvedValue({
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            playerId: 7,
            gameDayId: 99,
        } as Awaited<ReturnType<typeof gameInvitationService.get>>);
        mockGameDayService.get.mockResolvedValue({
            id: 99,
            year: 2024,
            date: new Date('2024-04-02T18:00:00Z'),
            game: true,
            mailSent: new Date('2024-03-30T09:00:00Z'),
            comment: null,
            bibs: null,
            pickerGamesHistory: null,
        } as Awaited<ReturnType<typeof gameDayService.get>>);
        mockOutcomeService.get.mockResolvedValue(null);
        mockOutcomeService.upsert.mockResolvedValue(null);
    });

    it('upserts the response and preserves a trimmed comment', async () => {
        await submitGameInvitationResponse({
            token: '123e4567-e89b-12d3-a456-426614174000',
            response: 'Yes',
            goalie: true,
            comment: '  Ready to play  ',
        });

        expect(mockOutcomeService.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                gameDayId: 99,
                playerId: 7,
                response: 'Yes',
                goalie: true,
                comment: 'Ready to play',
            }),
        );
    });

    it('preserves the existing response interval', async () => {
        mockOutcomeService.get.mockResolvedValue({
            id: 1,
            response: 'No',
            responseInterval: 123,
            points: null,
            team: null,
            comment: null,
            pub: null,
            paid: null,
            goalie: false,
            gameDayId: 99,
            playerId: 7,
        } as Awaited<ReturnType<typeof outcomeService.get>>);

        await submitGameInvitationResponse({
            token: '123e4567-e89b-12d3-a456-426614174000',
            response: 'No',
            goalie: false,
            comment: '',
        });

        expect(mockOutcomeService.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                responseInterval: 123,
            }),
        );
    });
});
