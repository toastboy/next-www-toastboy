import { beforeEach, describe, expect, it, vi } from 'vitest';

import { emit, emitter } from '@/lib/events';

describe('events', () => {
    beforeEach(() => {
        emitter.removeAllListeners();
    });

    describe('emit', () => {
        it('fires listeners on the matching channel', () => {
            const listener = vi.fn();
            emitter.on('games', listener);
            emit('games');
            expect(listener).toHaveBeenCalledTimes(1);
        });

        it('does not fire listeners registered on a different channel', () => {
            const listener = vi.fn();
            emitter.on('players', listener);
            emit('games');
            expect(listener).not.toHaveBeenCalled();
        });

        it('fires all listeners registered on the same channel', () => {
            const a = vi.fn();
            const b = vi.fn();
            emitter.on('games', a);
            emitter.on('games', b);
            emit('games');
            expect(a).toHaveBeenCalledTimes(1);
            expect(b).toHaveBeenCalledTimes(1);
        });

        it('fires independent listeners on separate channels', () => {
            const gamesListener = vi.fn();
            const playersListener = vi.fn();
            emitter.on('games', gamesListener);
            emitter.on('players', playersListener);
            emit('players');
            expect(gamesListener).not.toHaveBeenCalled();
            expect(playersListener).toHaveBeenCalledTimes(1);
        });
    });
});
