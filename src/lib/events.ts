import 'server-only';

import { EventEmitter } from 'events';

import type { FootyChannel } from '@/types/FootyChannel';

// Survive hot-module reloads in development without leaking multiple emitters.
const g = global as typeof global & { footyEmitter?: EventEmitter };
const emitter: EventEmitter = g.footyEmitter ?? new EventEmitter();
g.footyEmitter = emitter;

/**
 * Publish an event on the named channel. Call this from server actions or
 * services immediately after a database mutation to push live updates to all
 * connected clients subscribed to that channel.
 */
export function emit(channel: FootyChannel): void {
    emitter.emit(channel);
}

export { emitter };
