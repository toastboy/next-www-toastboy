import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { TransformStream as NodeTransformStream, WritableStream as NodeWritableStream } from 'node:stream/web';
import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'node:util';
import { BroadcastChannel as NodeBroadcastChannel } from 'node:worker_threads';

import type { SetupServer } from 'msw/node';

type GlobalPolyfills = Pick<typeof globalThis, 'TextDecoder' | 'TextEncoder' | 'TransformStream' | 'WritableStream' | 'BroadcastChannel'>;

const globalScope = globalThis as typeof globalThis & GlobalPolyfills;

const polyfills: GlobalPolyfills = {
    TextDecoder: NodeTextDecoder as unknown as GlobalPolyfills['TextDecoder'],
    TextEncoder: NodeTextEncoder as unknown as GlobalPolyfills['TextEncoder'],
    TransformStream: NodeTransformStream as unknown as GlobalPolyfills['TransformStream'],
    WritableStream: NodeWritableStream as unknown as GlobalPolyfills['WritableStream'],
    BroadcastChannel: NodeBroadcastChannel as unknown as GlobalPolyfills['BroadcastChannel'],
};

const ensurePolyfill = <K extends keyof GlobalPolyfills>(key: K) => {
    if (typeof globalScope[key] === 'undefined') {
        globalScope[key] = polyfills[key] as (typeof globalScope)[K];
    }
};

ensurePolyfill('TextDecoder');
ensurePolyfill('TextEncoder');
ensurePolyfill('TransformStream');
ensurePolyfill('WritableStream');
ensurePolyfill('BroadcastChannel');

let server: SetupServer;

beforeAll(async () => {
    const mod = await import('./src/tests/setup/msw-server');
    server = mod.server;
    server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

global.ResizeObserver = class ResizeObserver {
    observe() { /* empty */ }
    unobserve() { /* empty */ }
    disconnect() { /* empty */ }
};
