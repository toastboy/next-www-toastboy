import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it } from 'vitest';

import { GET } from '@/app/api/events/route';
import { broadcast, emitter } from '@/lib/events';

describe('/api/events', () => {
    beforeEach(() => {
        emitter.removeAllListeners();
    });

    it('returns 400 when the channel param is missing', () => {
        const request = new NextRequest('http://localhost/api/events');
        const response = GET(request);
        expect(response.status).toBe(400);
    });

    it('returns a streaming response with SSE headers for a valid channel', () => {
        const controller = new AbortController();
        const request = new NextRequest('http://localhost/api/events?channel=games', {
            signal: controller.signal,
        });
        const response = GET(request);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('text/event-stream');
        expect(response.headers.get('Cache-Control')).toBe('no-cache');
        expect(response.body).not.toBeNull();

        controller.abort();
    });

    it('streams an SSE event frame when the channel is emitted to', async () => {
        const controller = new AbortController();
        const request = new NextRequest('http://localhost/api/events?channel=games', {
            signal: controller.signal,
        });
        const response = GET(request);

        broadcast('games');

        const reader = response.body!.getReader();
        const { value } = await reader.read();
        const text = new TextDecoder().decode(value);

        expect(text).toBe('event: update\ndata: {}\n\n');

        controller.abort();
    });

    it('deregisters the emitter listener when the request is aborted', () => {
        const controller = new AbortController();
        const request = new NextRequest('http://localhost/api/events?channel=games', {
            signal: controller.signal,
        });
        GET(request);

        expect(emitter.listenerCount('games')).toBe(1);
        controller.abort();
        expect(emitter.listenerCount('games')).toBe(0);
    });

    it('does not send events for other channels to the stream', async () => {
        const controller = new AbortController();
        const request = new NextRequest('http://localhost/api/events?channel=games', {
            signal: controller.signal,
        });
        const response = GET(request);

        broadcast('players');
        broadcast('games');

        const reader = response.body!.getReader();
        const { value } = await reader.read();
        const text = new TextDecoder().decode(value);

        // Only the games event should appear; players was silently ignored.
        expect(text).toBe('event: update\ndata: {}\n\n');

        controller.abort();
    });
});
