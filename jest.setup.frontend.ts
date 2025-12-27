import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { TransformStream as NodeTransformStream, WritableStream as NodeWritableStream } from 'node:stream/web';
import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'node:util';
import { BroadcastChannel as NodeBroadcastChannel } from 'node:worker_threads';

type GlobalPolyfills = Pick<typeof globalThis, 'TextDecoder' | 'TextEncoder' | 'TransformStream' | 'WritableStream' | 'BroadcastChannel'>;

const silenceConsole = () => {
    const noop = () => undefined;
    const spies = [
        jest.spyOn(console, 'log').mockImplementation(noop),
        jest.spyOn(console, 'info').mockImplementation(noop),
        jest.spyOn(console, 'warn').mockImplementation(noop),
        jest.spyOn(console, 'error').mockImplementation(noop),
        jest.spyOn(console, 'debug').mockImplementation(noop),
    ];

    afterAll(() => {
        for (const spy of spies) {
            spy.mockRestore();
        }
    });
};

if (process.env.JEST_SILENCE_CONSOLE !== 'false') {
    silenceConsole();
}

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

beforeEach(() => {
    jest.useRealTimers();
});

global.ResizeObserver = class ResizeObserver {
    observe() { /* empty */ }
    unobserve() { /* empty */ }
    disconnect() { /* empty */ }
};

// Mock @mantine/tiptap to avoid relying on TipTap editor internals in tests
jest.mock('@mantine/tiptap', () => {
    // Using require keeps this factory synchronous for Jest
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react') as typeof import('react');

    type DomProps = Record<string, unknown>;
    type WithChildren = React.PropsWithChildren<DomProps>;

    const omitDomProps = (props: DomProps, keys: string[]): DomProps => {
        const next: DomProps = {};
        for (const k of Object.keys(props ?? {})) {
            if (!keys.includes(k)) next[k] = props[k];
        }
        return next;
    };

    interface EditorLike { options?: { content?: string } }
    const EditorContext = React.createContext<EditorLike | null>(null);

    interface RichTextEditorComponent extends React.FC<WithChildren & { editor?: EditorLike }> {
        Toolbar: React.FC<WithChildren>;
        ControlsGroup: React.FC<WithChildren>;
        Content: React.FC<DomProps>;
        Bold: React.FC<DomProps>;
        Italic: React.FC<DomProps>;
        Underline: React.FC<DomProps>;
        Strikethrough: React.FC<DomProps>;
        ClearFormatting: React.FC<DomProps>;
        Highlight: React.FC<DomProps>;
        Code: React.FC<DomProps>;
        H1: React.FC<DomProps>;
        H2: React.FC<DomProps>;
        H3: React.FC<DomProps>;
        H4: React.FC<DomProps>;
        Blockquote: React.FC<DomProps>;
        Hr: React.FC<DomProps>;
        BulletList: React.FC<DomProps>;
        OrderedList: React.FC<DomProps>;
        Link: React.FC<DomProps>;
        Unlink: React.FC<DomProps>;
        AlignLeft: React.FC<DomProps>;
        AlignCenter: React.FC<DomProps>;
        AlignJustify: React.FC<DomProps>;
        AlignRight: React.FC<DomProps>;
    }

    const RichTextEditorBase: React.FC<WithChildren & { editor?: EditorLike }> = ({ editor, children, ...props }) => (
        React.createElement(
            EditorContext.Provider,
            { value: editor ?? null },
            React.createElement('div', { 'data-mock': 'RichTextEditor', ...omitDomProps(props, ['sticky', 'stickyOffset']) }, children),
        )
    );
    const RichTextEditor = RichTextEditorBase as RichTextEditorComponent;
    RichTextEditor.displayName = 'RichTextEditor';

    // Toolbar and content wrappers
    const RichTextEditorToolbar: React.FC<WithChildren> = ({ children, ...props }) => (
        React.createElement('div', { 'data-mock': 'RichTextEditor.Toolbar', ...omitDomProps(props, ['sticky', 'stickyOffset']) }, children)
    );
    RichTextEditorToolbar.displayName = 'RichTextEditor.Toolbar';

    const RichTextEditorControlsGroup: React.FC<WithChildren> = ({ children, ...props }) => (
        React.createElement('div', { 'data-mock': 'RichTextEditor.ControlsGroup', ...omitDomProps(props, ['sticky', 'stickyOffset']) }, children)
    );
    RichTextEditorControlsGroup.displayName = 'RichTextEditor.ControlsGroup';

    const DEFAULT_RICH_TEXT_EDITOR_CONTENT_HTML = '<p>Hello, this is a test!</p>';
    const RichTextEditorContent: React.FC<DomProps> = (props) => {
        const editor = React.useContext(EditorContext);
        const html = editor?.options?.content ?? DEFAULT_RICH_TEXT_EDITOR_CONTENT_HTML;
        return React.createElement('div', {
            'data-mock': 'RichTextEditor.Content',
            dangerouslySetInnerHTML: { __html: html },
            ...omitDomProps(props, ['sticky', 'stickyOffset']),
        });
    };
    RichTextEditorContent.displayName = 'RichTextEditor.Content';

    RichTextEditor.Toolbar = RichTextEditorToolbar;
    RichTextEditor.ControlsGroup = RichTextEditorControlsGroup;
    RichTextEditor.Content = RichTextEditorContent;

    // Controls rendered as simple buttons to satisfy rendering without accessing editor
    const Control = (name: string) => {
        const ControlComponent: React.FC<DomProps> = (props) => (
            React.createElement('button', { 'data-mock': `RichTextEditor.${name}`, type: 'button', ...omitDomProps(props, ['sticky', 'stickyOffset']) }, name)
        );
        ControlComponent.displayName = `RichTextEditor.${name}`;
        return ControlComponent;
    };

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

    return { __esModule: true, RichTextEditor, Link };
});
