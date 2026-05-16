import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { FootyChannel } from '@/types/FootyChannel';

const mockClose = vi.fn();
const mockAddEventListener = vi.fn();
const createdUrls: string[] = [];

beforeEach(() => {
    createdUrls.length = 0;
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Regular function so it can be used as a constructor with `new`.
    vi.stubGlobal('EventSource', function (url: string) {
        createdUrls.push(url);
        return { addEventListener: mockAddEventListener, close: mockClose };
    });
});

describe('useAutoRefresh', () => {
    describe('single channel', () => {
        it('opens an EventSource for the given channel on mount', () => {
            renderHook(() => useAutoRefresh(FootyChannel.Games));
            expect(createdUrls).toEqual(['/api/events?channel=games']);
        });

        it('registers an update event listener', () => {
            renderHook(() => useAutoRefresh(FootyChannel.Games));
            expect(mockAddEventListener).toHaveBeenCalledWith('update', expect.any(Function));
        });

        it('calls router.refresh() when the update event fires', () => {
            const { refresh } = useRouter();
            renderHook(() => useAutoRefresh(FootyChannel.Games));

            const [, listener] = mockAddEventListener.mock.calls[0] as [string, () => void];
            listener();
            vi.runAllTimers();

            expect(refresh).toHaveBeenCalledTimes(1);
        });

        it('closes the EventSource on unmount', () => {
            const { unmount } = renderHook(() => useAutoRefresh(FootyChannel.Games));
            unmount();
            expect(mockClose).toHaveBeenCalledTimes(1);
        });

        it('opens a new EventSource when the channel changes', () => {
            const { rerender } = renderHook<void, { channel: FootyChannel }>(
                ({ channel }) => useAutoRefresh(channel),
                { initialProps: { channel: FootyChannel.Games } },
            );
            rerender({ channel: FootyChannel.Players });
            expect(createdUrls).toEqual([
                '/api/events?channel=games',
                '/api/events?channel=players',
            ]);
        });

        it('closes the old EventSource when the channel changes', () => {
            const { rerender } = renderHook<void, { channel: FootyChannel }>(
                ({ channel }) => useAutoRefresh(channel),
                { initialProps: { channel: FootyChannel.Games } },
            );
            rerender({ channel: FootyChannel.Players });
            expect(mockClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('multiple channels', () => {
        it('opens one EventSource per channel', () => {
            renderHook(() => useAutoRefresh([FootyChannel.Games, FootyChannel.Results]));
            expect(createdUrls).toEqual([
                '/api/events?channel=games',
                '/api/events?channel=results',
            ]);
        });

        it('closes all EventSources on unmount', () => {
            const { unmount } = renderHook(() => useAutoRefresh([FootyChannel.Games, FootyChannel.Results]));
            unmount();
            expect(mockClose).toHaveBeenCalledTimes(2);
        });

        it('coalesces rapid events from multiple channels into one refresh', () => {
            const { refresh } = useRouter();
            renderHook(() => useAutoRefresh([FootyChannel.Games, FootyChannel.Results]));

            const listeners = mockAddEventListener.mock.calls.map(
                (call) => call[1] as () => void,
            );
            listeners.forEach(fn => fn());
            vi.runAllTimers();

            expect(refresh).toHaveBeenCalledTimes(1);
        });
    });
});
