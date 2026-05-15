'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import type { FootyChannel } from '@/types/FootyChannel';

/**
 * Subscribes to a named SSE channel and calls router.refresh() whenever an
 * "update" event arrives, causing all server components on the page to
 * re-render with fresh data. Drop this into any client component that wraps
 * content which should stay live without polling.
 *
 * @param channel - The pub/sub channel to subscribe to.
 */
export function useAutoRefresh(channel: FootyChannel): void {
    const router = useRouter();

    useEffect(() => {
        const es = new EventSource(`/api/events?channel=${channel}`);
        es.addEventListener('update', () => router.refresh());
        return () => es.close();
    }, [channel, router]);
}
