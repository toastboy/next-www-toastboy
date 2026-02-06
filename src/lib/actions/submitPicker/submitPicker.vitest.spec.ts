import { describe, expect, it } from 'vitest';

import { SubmitPickerCore } from '@/lib/actions/submitPicker';

describe('SubmitPickerCore', () => {
    it('accepts the selected players list', async () => {
        await expect(SubmitPickerCore([
            { playerId: 7, name: 'Taylor' },
            { playerId: 9, name: 'Jordan' },
        ])).resolves.toBeUndefined();
    });
});
