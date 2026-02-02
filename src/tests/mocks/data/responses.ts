import type { AdminResponseRow } from '@/components/Responses/Responses';

export const defaultResponsesAdminData: AdminResponseRow[] = [
    {
        playerId: 1,
        playerName: 'Alex Keeper',
        response: 'Yes',
        goalie: true,
        comment: 'I can cover first half',
    },
    {
        playerId: 2,
        playerName: 'Britt Winger',
        response: 'No',
        goalie: false,
        comment: 'Out of town',
    },
    {
        playerId: 3,
        playerName: 'Casey Mid',
        response: null,
        goalie: false,
        comment: '',
    },
    {
        playerId: 4,
        playerName: 'Dev Striker',
        response: null,
        goalie: false,
        comment: '',
    },
];
