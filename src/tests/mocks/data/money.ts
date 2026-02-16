import type { DebtSummaryType, DebtType } from '@/types/DebtType';

export const defaultCurrentDebtList: DebtType[] = [
    {
        playerId: 11,
        playerName: 'Alex Current',
        amount: 7.5,
    },
    {
        playerId: 12,
        playerName: 'Sam Current',
        amount: 5,
    },
];

export const defaultHistoricDebtList: DebtType[] = [
    {
        playerId: 21,
        playerName: 'Jamie Historic',
        amount: 12.25,
    },
];

export const defaultDebtSummary: DebtSummaryType = {
    current: defaultCurrentDebtList,
    historic: defaultHistoricDebtList,
    total: 24.75,
};

export const createMockDebtSummary = (
    overrides: Partial<DebtSummaryType> = {},
): DebtSummaryType => ({
    ...defaultDebtSummary,
    ...overrides,
});
