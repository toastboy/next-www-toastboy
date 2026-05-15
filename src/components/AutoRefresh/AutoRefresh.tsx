'use client';

import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import type { FootyChannel } from '@/types/FootyChannel';

interface AutoRefreshProps {
    channel: FootyChannel;
}

/**
 * Drop this into any server-rendered page to have it automatically re-fetch
 * its data when the named channel is published to via emit(). Renders nothing
 * — purely a side-effect component.
 */
export function AutoRefresh({ channel }: AutoRefreshProps) {
    /* v8 ignore next -- there's no logic to test here */
    useAutoRefresh(channel);
    return null;
}
