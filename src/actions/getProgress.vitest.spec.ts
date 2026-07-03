import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getProgressMock } = vi.hoisted(() => ({
    getProgressMock: vi.fn(),
}));

vi.mock('@/services/PlayerRecord', () => ({
    default: {
        getProgress: getProgressMock,
    },
}));

import { getProgress } from '@/actions/getProgress';

describe('getProgress action', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('returns the [processed, total] tuple from playerRecordService.getProgress', async () => {
        getProgressMock.mockResolvedValueOnce([4, 10]);

        const result = await getProgress();

        expect(result).toEqual([4, 10]);
    });

    it('returns null when playerRecordService.getProgress returns null', async () => {
        getProgressMock.mockResolvedValueOnce(null);

        const result = await getProgress();

        expect(result).toBeNull();
    });

    it('propagates errors from playerRecordService.getProgress', async () => {
        const coreError = new Error('progress lookup failed');
        getProgressMock.mockRejectedValueOnce(coreError);

        await expect(getProgress()).rejects.toBe(coreError);
    });
});
