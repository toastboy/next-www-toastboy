import { createMockPlayer } from '@/tests/mocks/data/player';
import type { DebtsSummaryType, MoneyChartDatum, PlayerDebtsType } from '@/types/DebtType';

export const defaultMoneyChartData: MoneyChartDatum[] = [
    { interval: 'Jan', credits: 120, debits: 80 },
    { interval: 'Feb', credits: 150, debits: 100 },
    { interval: 'Mar', credits: 90, debits: 120 },
    { interval: 'Apr', credits: 200, debits: 80 },
    { interval: 'May', credits: 60, debits: 150 },
    { interval: 'Jun', credits: 180, debits: 90 },
];

/**
 * Default mock data for player debts (unpaid game charges).
 */
export const defaultPlayerDebtsList: PlayerDebtsType[] = [
    {
        player: createMockPlayer({
            id: 11,
            name: 'Alex Current',
        }),
        debts: [
            { gameDayId: 8, amount: 350 },
            { gameDayId: 10, amount: 400 },
        ],
    },
    {
        player: createMockPlayer({
            id: 12,
            name: 'Sam Current',
        }),
        debts: [],
    },
    {
        player: createMockPlayer({
            id: 21,
            name: 'Jamie Historic',
        }),
        debts: [
            { gameDayId: 15, amount: 600 },
            { gameDayId: 18, amount: 625 },
        ],
    },
];

/**
 * Default mock data for the complete debts summary.
 */
export const defaultDebtsSummary: DebtsSummaryType = {
    players: defaultPlayerDebtsList,
};

/**
 * Creates a mock debts summary with optional overrides.
 */
export const createMockDebtsSummary = (
    overrides: Partial<DebtsSummaryType> = {},
): DebtsSummaryType => ({
    ...defaultDebtsSummary,
    ...overrides,
});
