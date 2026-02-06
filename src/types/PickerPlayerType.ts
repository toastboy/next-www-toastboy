import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

export type PickerPlayerType = OutcomePlayerType & {
    gamesPlayed: number;
};
