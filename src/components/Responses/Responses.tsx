import React from 'react';

export type AdminPlayerResponse = 'Yes' | 'No' | 'Dunno' | null;

export interface AdminResponseRow {
    playerId: number;
    playerName: string;
    response: AdminPlayerResponse;
    goalie: boolean;
    comment: string;
}

export interface ResponsesProps {
    gameId: number;
    gameDate: string;
    responses: AdminResponseRow[];
    onSave: (update: {
        playerId: number;
        response: Exclude<AdminPlayerResponse, null>;
        goalie: boolean;
        comment: string;
    }) => Promise<void>;
}

/**
 * Placeholder component for TDD. The real implementation should mirror the
 * legacy responses page: grouped lists by response, counts, per-player form
 * controls, and success/error notifications.
 */
export const Responses: React.FC<ResponsesProps> = (_props) => {
    // TODO: Implement responses admin UI.
    return null;
};
