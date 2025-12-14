import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { TransformStream as NodeTransformStream, WritableStream as NodeWritableStream } from 'node:stream/web';
import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'node:util';
import { BroadcastChannel as NodeBroadcastChannel } from 'node:worker_threads';

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

global.ResizeObserver = class ResizeObserver {
    observe() { /* empty */ }
    unobserve() { /* empty */ }
    disconnect() { /* empty */ }
};

// Mock @mantine/tiptap to avoid relying on TipTap editor internals in tests
jest.mock('@mantine/tiptap', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React: typeof import('react') = require('react');

    type DomProps = Record<string, unknown>;
    type WithChildren = React.PropsWithChildren<DomProps>;

    const omitDomProps = (props: DomProps, keys: string[]): DomProps => {
        const next: DomProps = {};
        for (const k of Object.keys(props ?? {})) {
            if (!keys.includes(k)) next[k] = (props as DomProps)[k];
        }
        return next;
    };

    const EditorContext = React.createContext<any>(null);
    const RichTextEditor = ({ editor, children, ...props }: WithChildren & { editor?: any }) => (
        React.createElement(
            EditorContext.Provider,
            { value: editor },
            React.createElement('div', { 'data-mock': 'RichTextEditor', ...omitDomProps(props, ['sticky', 'stickyOffset']) }, children)
        )
    );

    // Toolbar and content wrappers
    RichTextEditor.Toolbar = ({ children, ...props }: WithChildren) => (
        React.createElement('div', { 'data-mock': 'RichTextEditor.Toolbar', ...omitDomProps(props, ['sticky', 'stickyOffset']) }, children)
    );
    RichTextEditor.ControlsGroup = ({ children, ...props }: WithChildren) => (
        React.createElement('div', { 'data-mock': 'RichTextEditor.ControlsGroup', ...omitDomProps(props, ['sticky', 'stickyOffset']) }, children)
    );
    RichTextEditor.Content = (props: DomProps) => {
        const editor = React.useContext(EditorContext);
        const html = editor?.options?.content ?? '<p>Hello, this is a test!</p>';
        return React.createElement('div', {
            'data-mock': 'RichTextEditor.Content',
            dangerouslySetInnerHTML: { __html: html },
            ...omitDomProps(props, ['sticky', 'stickyOffset']),
        });
    };

    // Controls rendered as simple buttons to satisfy rendering without accessing editor
    const Control = (name: string) => (props: DomProps) => (
        React.createElement('button', { 'data-mock': `RichTextEditor.${name}`, type: 'button', ...omitDomProps(props, ['sticky', 'stickyOffset']) }, name)
    );

    // Common controls used in our components/tests
    RichTextEditor.Bold = Control('Bold');
    RichTextEditor.Italic = Control('Italic');
    RichTextEditor.Underline = Control('Underline');
    RichTextEditor.Strikethrough = Control('Strikethrough');
    RichTextEditor.ClearFormatting = Control('ClearFormatting');
    RichTextEditor.Highlight = Control('Highlight');
    RichTextEditor.Code = Control('Code');
    RichTextEditor.H1 = Control('H1');
    RichTextEditor.H2 = Control('H2');
    RichTextEditor.H3 = Control('H3');
    RichTextEditor.H4 = Control('H4');
    RichTextEditor.Blockquote = Control('Blockquote');
    RichTextEditor.Hr = Control('Hr');
    RichTextEditor.BulletList = Control('BulletList');
    RichTextEditor.OrderedList = Control('OrderedList');
    RichTextEditor.Link = Control('Link');
    RichTextEditor.Unlink = Control('Unlink');
    RichTextEditor.AlignLeft = Control('AlignLeft');
    RichTextEditor.AlignCenter = Control('AlignCenter');
    RichTextEditor.AlignJustify = Control('AlignJustify');
    RichTextEditor.AlignRight = Control('AlignRight');

    // Provide a minimal Link export as used by mantine tiptap
    const Link = Control('LinkControl');

    return { RichTextEditor, Link };
});
