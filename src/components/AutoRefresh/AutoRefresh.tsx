'use client';

import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import type { FootyChannel } from '@/types/FootyChannel';

interface AutoRefreshProps {
    channels: FootyChannel | FootyChannel[];
}

/**
 * Drop this into any server-rendered page to have it automatically re-fetch
 * its data when any of the named channels is published to via broadcast().
 * Renders nothing — purely a side-effect component.
 */
export function AutoRefresh({ channels }: AutoRefreshProps) {
    /* v8 ignore next 2 -- there's no logic to test here */
    useAutoRefresh(channels);
    return null;
}
