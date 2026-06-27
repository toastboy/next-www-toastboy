import { beforeEach, describe, it, vi } from 'vitest';

const { getProgressMock } = vi.hoisted(() => ({
    getProgressMock: vi.fn(),
}));

vi.mock('@/services/PlayerRecord', () => ({
    default: {
        getProgress: getProgressMock,
    },
}));


describe('getProgress action', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it.todo('returns the [processed, total] tuple from playerRecordService.getProgress');
    it.todo('returns null when playerRecordService.getProgress returns null');
    it.todo('propagates errors from playerRecordService.getProgress');
});
