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

    it('concatenates multiple chunks into a single Buffer', async () => {
        const stream = Readable.from([
            Buffer.from('hello'),
            Buffer.from(' '),
            Buffer.from('world'),
        ]);

        const result = await streamToBuffer(stream);

        expect(result).toEqual(Buffer.from('hello world'));
    });

    it('handles Uint8Array chunks by converting them to Buffers', async () => {
        const stream = Readable.from([new Uint8Array([72, 101, 108, 108, 111])]);

        const result = await streamToBuffer(stream);

        expect(result).toEqual(Buffer.from('Hello'));
    });

    it('resolves with an empty Buffer for an empty stream', async () => {
        const stream = Readable.from([]);

        const result = await streamToBuffer(stream);

        expect(result).toEqual(Buffer.alloc(0));
    });

    it('rejects when the stream emits an error event', async () => {
        const stream = new Readable({
            read() {
                this.emit('error', new Error('stream error'));
            },
        });

        await expect(streamToBuffer(stream)).rejects.toThrow('stream error');
    });
});
