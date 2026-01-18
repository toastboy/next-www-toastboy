import { PlayerResponse } from 'prisma/generated/enums';

export interface GameInvitationResponseDetails {
    token: string;
    playerId: number;
    playerName: string;
    playerLogin: string | null;
    gameDayId: number;
    response: PlayerResponse | null;
    goalie: boolean;
    comment: string | null;
}
