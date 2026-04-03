import type { BalanceSummaryType, MoneyChartDatum, PlayerBalanceType } from '@/types/DebtType';

export const defaultMoneyChartData: MoneyChartDatum[] = [
    { interval: 'Jan', credits: 120, debits: 80 },
    { interval: 'Feb', credits: 150, debits: 100 },
    { interval: 'Mar', credits: 90, debits: 120 },
    { interval: 'Apr', credits: 200, debits: 80 },
    { interval: 'May', credits: 60, debits: 150 },
    { interval: 'Jun', credits: 180, debits: 90 },
];

export const defaultPlayerBalanceList: PlayerBalanceType[] = [
    {
        maxGameDayId: 10,
        playerId: 11,
        playerName: 'Alex Current',
        amount: -750,
    },
    {
        maxGameDayId: 12,
        playerId: 12,
        playerName: 'Sam Current',
        amount: 200,
    },
    {
        maxGameDayId: 21,
        playerId: 21,
        playerName: 'Jamie Historic',
        amount: -1225,
    },
];

export const defaultBalanceSummary: BalanceSummaryType = {
    players: defaultPlayerBalanceList,
    total: -1275,
    positiveTotal: 700,
    negativeTotal: -1975,
};

export const createMockBalanceSummary = (
    overrides: Partial<BalanceSummaryType> = {},
): BalanceSummaryType => ({
    ...defaultBalanceSummary,
    ...overrides,
});
