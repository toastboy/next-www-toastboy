import type { BalanceSummaryType, ClubBalanceType, PlayerBalanceType } from '@/types/DebtType';

export const defaultPlayerBalanceList: PlayerBalanceType[] = [
    {
        playerId: 11,
        playerName: 'Alex Current',
        amount: -7.5,
    },
    {
        playerId: 12,
        playerName: 'Sam Current',
        amount: 2,
    },
    {
        playerId: 21,
        playerName: 'Jamie Historic',
        amount: -12.25,
    },
];

export const defaultClubBalance: ClubBalanceType = {
    playerId: null,
    playerName: 'Club',
    amount: 5,
};

export const defaultBalanceSummary: BalanceSummaryType = {
    players: defaultPlayerBalanceList,
    club: defaultClubBalance,
    total: -12.75,
    positiveTotal: 7,
    negativeTotal: -19.75,
};

export const createMockBalanceSummary = (
    overrides: Partial<BalanceSummaryType> = {},
): BalanceSummaryType => ({
    ...defaultBalanceSummary,
    ...overrides,
});
