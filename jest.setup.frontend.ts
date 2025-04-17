import '@testing-library/jest-dom';
import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'util';
import 'whatwg-fetch';

global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = NodeTextDecoder as unknown as typeof global.TextDecoder;
}

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = NodeTextEncoder as unknown as typeof global.TextEncoder;
}
