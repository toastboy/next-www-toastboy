'use client';

import React, { useMemo, useState } from 'react';

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
        gameDayId: number;
        playerId: number;
        response: Exclude<AdminPlayerResponse, null>;
        goalie: boolean;
        comment: string;
    }) => Promise<void>;
}

export const Responses: React.FC<ResponsesProps> = ({ gameId, gameDate, responses, onSave }) => {
    const [rows, setRows] = useState<AdminResponseRow[]>(responses);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [message, setMessage] = useState<string>('');

    const grouped = useMemo(() => {
        return {
            yes: rows.filter((r) => r.response === 'Yes'),
            no: rows.filter((r) => r.response === 'No'),
            none: rows.filter((r) => r.response === null || r.response === 'Dunno'),
        };
    }, [rows]);

    const handleSubmit = async (row: AdminResponseRow) => {
        if (!row.response || row.response === 'Dunno') return;
        setSavingId(row.playerId);
        try {
            await onSave({
                gameDayId: gameId,
                playerId: row.playerId,
                response: row.response,
                goalie: row.goalie,
                comment: row.comment,
            });
            setMessage('Response updated');
            setRows((current) =>
                current.map((r) => (r.playerId === row.playerId ? row : r)),
            );
        } finally {
            setSavingId(null);
        }
    };

    const renderGroup = (title: string, testId: string, items: AdminResponseRow[]) => (
        <section data-testid={testId} data-count={items.length}>
            <h3>{title} ({items.length})</h3>
            {items.map((row) => (
                <div
                    key={row.playerId}
                    data-testid="response-row"
                    data-player-id={row.playerId}
                    style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}
                >
                    <span data-testid="player-name" style={{ minWidth: 140 }}>{row.playerName}</span>
                    <label>
                        <span className="sr-only">Response</span>
                        <select
                            data-testid="response-select"
                            value={row.response ?? 'None'}
                            onChange={(e) => {
                                const value = e.target.value as AdminPlayerResponse | 'None';
                                setRows((current) =>
                                    current.map((r) =>
                                        r.playerId === row.playerId
                                            ? { ...r, response: value === 'None' ? null : value }
                                            : r,
                                    ),
                                );
                            }}
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="Dunno">Dunno</option>
                            <option value="None">None</option>
                        </select>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input
                            data-testid="goalie-checkbox"
                            type="checkbox"
                            checked={row.goalie}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setRows((current) =>
                                    current.map((r) =>
                                        r.playerId === row.playerId ? { ...r, goalie: checked } : r,
                                    ),
                                );
                            }}
                        />
                        Goalie
                    </label>
                    <input
                        data-testid="comment-input"
                        type="text"
                        value={row.comment}
                        onChange={(e) => {
                            const value = e.target.value;
                            setRows((current) =>
                                current.map((r) =>
                                    r.playerId === row.playerId ? { ...r, comment: value } : r,
                                ),
                            );
                        }}
                        placeholder="Comment"
                    />
                    <button
                        data-testid="response-submit"
                        type="button"
                        disabled={savingId === row.playerId}
                        onClick={() => handleSubmit(row)}
                    >
                        Update
                    </button>
                </div>
            ))}
        </section>
    );

    // stable ordering: yes, no, none
    return (
        <div>
            <h2>Responses</h2>
            <p>Game {gameId}: {gameDate}</p>
            {!!message && <div role="status">{message}</div>}
            {renderGroup('Yes', 'response-group-yes', grouped.yes)}
            {renderGroup('No', 'response-group-no', grouped.no)}
            {renderGroup('None', 'response-group-none', grouped.none)}
        </div>
    );
};
