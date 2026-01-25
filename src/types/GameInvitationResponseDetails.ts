import { PlayerResponse } from 'prisma/generated/browser';

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
