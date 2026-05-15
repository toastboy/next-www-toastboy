import 'server-only';

import { NextRequest } from 'next/server';

import { emitter } from '@/lib/events';
import type { FootyChannel } from '@/types/FootyChannel';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const encoder = new TextEncoder();

/**
 * Server-sent events endpoint. Clients subscribe by passing ?channel=<name>.
 * Emits an "update" event whenever the corresponding channel is published to
 * via emit() in a server action or service. The client should call
 * router.refresh() on receipt to re-render server components with fresh data.
 */
export function GET(request: NextRequest): Response {
    const channel = request.nextUrl.searchParams.get('channel') as FootyChannel | null;

    if (!channel) {
        return new Response('Missing channel parameter', { status: 400 });
    }

    const stream = new ReadableStream({
        start(controller) {
            const listener = () => {
                controller.enqueue(encoder.encode('event: update\ndata: {}\n\n'));
            };

            emitter.on(channel, listener);

            request.signal.addEventListener('abort', () => {
                emitter.off(channel, listener);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
