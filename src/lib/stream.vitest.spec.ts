import { Readable } from 'stream';
import { describe, expect, it } from 'vitest';

import { streamToBuffer } from '@/lib/stream';

describe('streamToBuffer', () => {
    it('converts a readable stream into a Buffer containing all chunks', async () => {
        const data = Buffer.from('hello world');
        const stream = Readable.from([data]);

        const result = await streamToBuffer(stream);

        expect(result).toEqual(data);
    });

    it.todo('concatenates multiple chunks into a single Buffer');
    it.todo('resolves with an empty Buffer for an empty stream');
    it.todo('rejects when the stream emits an error event');
});
