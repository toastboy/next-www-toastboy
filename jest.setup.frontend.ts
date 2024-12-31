import '@testing-library/jest-dom';
import { TextEncoder } from 'util';
import 'whatwg-fetch';

global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}
