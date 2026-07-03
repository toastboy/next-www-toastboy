import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/GameDay');
vi.mock('services/Outcome');
vi.mock('next/navigation', () => ({
    notFound: vi.fn(() => { throw new Error('not_found'); }),
}));

vi.mock('@mantine/core', () => ({
    Container: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/AutoRefresh/AutoRefresh', () => ({
    AutoRefresh: function AutoRefresh() { return null; },
}));

vi.mock('@/components/ResponsesForm/ResponsesForm', () => ({
    ResponsesForm: function ResponsesForm() { return null; },
}));

import { SubmitResponse } from '@/actions/submitResponse';
import ResponsesPage from '@/app/footy/admin/responses/page';
import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import { findElement } from '@/tests/shared/reactTree';
import { FootyChannel } from '@/types/FootyChannel';

const currentGame = { id: 1249, date: new Date('2026-02-14T18:00:00Z') };
const responses = [{ playerId: 1, response: 'Yes' }];

describe('Admin Responses page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (gameDayService.getCurrent as Mock).mockResolvedValue(currentGame);
        (outcomeService.getAdminByGameDay as Mock).mockResolvedValue(responses);
    });

    it('calls notFound when there is no current game', async () => {
        (gameDayService.getCurrent as Mock).mockResolvedValue(null);

        await expect(ResponsesPage()).rejects.toThrow('not_found');
        expect(outcomeService.getAdminByGameDay).not.toHaveBeenCalled();
    });

    it('fetches admin outcomes for the current game day', async () => {
        await ResponsesPage();

        expect(outcomeService.getAdminByGameDay).toHaveBeenCalledWith(1249);
    });

    it('passes the gameDay id, date, and responses to ResponsesForm', async () => {
        const result = await ResponsesPage();

        const form = findElement(result, 'ResponsesForm');
        expect(form?.props.gameId).toBe(1249);
        expect(form?.props.responses).toBe(responses);
        expect(form?.props.submitResponse).toBe(SubmitResponse);
    });

    it('passes the date as an ISO date string', async () => {
        const result = await ResponsesPage();

        const form = findElement(result, 'ResponsesForm');
        expect(form?.props.gameDate).toBe('2026-02-14');
    });

    it('renders AutoRefresh subscribed to the Responses channel', async () => {
        const result = await ResponsesPage();

        const autoRefresh = findElement(result, 'AutoRefresh');
        expect(autoRefresh?.props.channels).toBe(FootyChannel.Responses);
    });

    it('handles service errors gracefully by propagating them', async () => {
        (outcomeService.getAdminByGameDay as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(ResponsesPage()).rejects.toThrow('DB failed');
    });
});
