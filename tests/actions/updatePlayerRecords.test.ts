import { updatePlayerRecords } from 'actions/updatePlayerRecords';
import playerRecordService from 'services/PlayerRecord';
import { revalidatePath } from 'next/cache';

jest.mock('services/PlayerRecord');
jest.mock('next/cache');

describe('updatePlayerRecords', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete all player records', async () => {
        await updatePlayerRecords();
        expect(playerRecordService.deleteAll).toHaveBeenCalled();
    });

    it('should upsert player records for game day', async () => {
        await updatePlayerRecords();
        expect(playerRecordService.upsertForGameDay).toHaveBeenCalled();
    });

    it('should revalidate the admin path', async () => {
        await updatePlayerRecords();
        expect(revalidatePath).toHaveBeenCalledWith('/footy/admin');
    });
});
