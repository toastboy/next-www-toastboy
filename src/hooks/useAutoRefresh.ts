'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import type { FootyChannel } from '@/types/FootyChannel';

/**
 * Subscribes to one or more named SSE channels and calls router.refresh()
 * whenever an "update" event arrives on any of them. Multiple rapid events
 * are coalesced into a single refresh. Drop this into any client component
 * that wraps content which should stay live without polling.
 *
 * @param channels - The pub/sub channel(s) to subscribe to.
 */
export function useAutoRefresh(channels: FootyChannel | FootyChannel[]): void {
    const router = useRouter();
    const key = Array.isArray(channels) ?
        [...channels].sort().join(',') :
        channels;

    useEffect(() => {
        const list = key.split(',') as FootyChannel[];
        let pending = false;

        const listener = () => {
            if (!pending) {
                pending = true;
                setTimeout(() => {
                    pending = false;
                    router.refresh();
                }, 0);
            }
        };

        const sources = list.map(ch => {
            const es = new EventSource(`/api/events?channel=${ch}`);
            es.addEventListener('update', listener);
            return es;
        });

        return () => sources.forEach(es => es.close());
    }, [key, router]);
}
