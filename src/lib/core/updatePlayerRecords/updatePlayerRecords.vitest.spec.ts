import { describe, expect, it, vi } from 'vitest';

import { coreUpdatePlayerRecords } from '@/lib/core/updatePlayerRecords';

describe('coreUpdatePlayerRecords', () => {
    it('deletes and upserts player records', async () => {
        const playerRecordService = {
            deleteAll: vi.fn(),
            upsertForGameDay: vi.fn(),
        };

        await coreUpdatePlayerRecords({ playerRecordService });

        expect(playerRecordService.deleteAll).toHaveBeenCalled();
        expect(playerRecordService.upsertForGameDay).toHaveBeenCalled();
    });
});
