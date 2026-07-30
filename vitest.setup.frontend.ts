import '@testing-library/jest-dom/vitest';

import * as React from 'react';
import { vi } from 'vitest';

// next/navigation is aliased to src/tests/__mocks__/next/navigation.ts in
// vitest.components.config.ts, so its exports (useRouter, usePathname, etc.)
// are already vi.fn() instances for every component test without a per-file
// vi.mock('next/navigation') call.
vi.mock('@/lib/auth.client');
vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: () => 'http://localhost',
}));

const createTiptapChainMock = () => {
    const chainApi = {
        focus: () => chainApi,
        toggleBold: () => chainApi,
        toggleItalic: () => chainApi,
        toggleUnderline: () => chainApi,
        toggleStrike: () => chainApi,
        toggleHighlight: () => chainApi,
        toggleCode: () => chainApi,
        toggleHeading: () => chainApi,
        toggleBlockquote: () => chainApi,
        setHorizontalRule: () => chainApi,
        toggleBulletList: () => chainApi,
        toggleOrderedList: () => chainApi,
        setLink: () => chainApi,
        unsetLink: () => chainApi,
        setTextAlign: () => chainApi,
        run: vi.fn(),
    };

    return chainApi;
};

const createTiptapEditorMock = () => ({
    getHTML: () => '<p>Test</p>',
    isActive: vi.fn(() => false),
    chain: () => createTiptapChainMock(),
    can: () => createTiptapChainMock(),
});

const EditorContent = () => null;

vi.mock('@tiptap/react', () => ({
    useEditor: vi.fn(() => createTiptapEditorMock()),
    EditorContent,
}));

const createRichTextNode = (name: string, props?: Record<string, unknown>, children?: React.ReactNode) =>
    React.createElement('div', { 'data-testid': `rich-text-${name}`, ...props }, children);

const RichTextEditor = ({ children, ...props }: { children?: React.ReactNode }) =>
    createRichTextNode('editor', props, children);

// RichTextEditor.Toolbar has no standalone named export in the real
// @mantine/tiptap package, so it stays as the one dot-notation exception
// mirrored here. See CLAUDE.md.
RichTextEditor.Toolbar = ({ children }: { children?: React.ReactNode }) =>
    createRichTextNode('toolbar', undefined, children);

const RichTextEditorControlsGroup = ({ children }: { children?: React.ReactNode }) =>
    createRichTextNode('controls', undefined, children);

const RichTextEditorContent = () => createRichTextNode('content', undefined, 'Hello, this is a test!');
const BoldControl = () => createRichTextNode('bold');
const ItalicControl = () => createRichTextNode('italic');
const UnderlineControl = () => createRichTextNode('underline');
const StrikeThroughControl = () => createRichTextNode('strikethrough');
const ClearFormattingControl = () => createRichTextNode('clear-formatting');
const HighlightControl = () => createRichTextNode('highlight');
const CodeControl = () => createRichTextNode('code');
const H1Control = () => createRichTextNode('h1');
const H2Control = () => createRichTextNode('h2');
const H3Control = () => createRichTextNode('h3');
const H4Control = () => createRichTextNode('h4');
const BlockquoteControl = () => createRichTextNode('blockquote');
const HrControl = () => createRichTextNode('hr');
const BulletListControl = () => createRichTextNode('bullet-list');
const OrderedListControl = () => createRichTextNode('ordered-list');
const RichTextEditorLinkControl = () => createRichTextNode('link');
const UnlinkControl = () => createRichTextNode('unlink');
const AlignLeftControl = () => createRichTextNode('align-left');
const AlignCenterControl = () => createRichTextNode('align-center');
const AlignJustifyControl = () => createRichTextNode('align-justify');
const AlignRightControl = () => createRichTextNode('align-right');

vi.mock('@mantine/tiptap', () => ({
    AlignCenterControl,
    AlignJustifyControl,
    AlignLeftControl,
    AlignRightControl,
    BlockquoteControl,
    BoldControl,
    BulletListControl,
    ClearFormattingControl,
    CodeControl,
    H1Control,
    H2Control,
    H3Control,
    H4Control,
    HighlightControl,
    HrControl,
    ItalicControl,
    Link: {},
    OrderedListControl,
    RichTextEditor,
    RichTextEditorContent,
    RichTextEditorControlsGroup,
    RichTextEditorLinkControl,
    StrikeThroughControl,
    UnderlineControl,
    UnlinkControl,
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
}));

// TODO: Now we have dependency injection for actions, we can remove these
// mocks, I think

vi.mock('@/actions/sendEmail', () => ({
    sendEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/actions/sendEnquiry', () => ({
    sendEnquiry: vi.fn(),
}));

vi.mock('@/actions/auth-export', () => ({
    authExport: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/actions/submitGameInvitationResponse', () => ({
    submitGameInvitationResponse: vi.fn(),
}));

vi.mock('@/actions/deletePlayer', () => ({
    deletePlayer: vi.fn(),
}));

vi.mock('@/actions/triggerInvitations', () => ({
    triggerInvitations: vi.fn(),
}));

vi.mock('@/actions/createMoreGameDays', () => ({
    createMoreGameDays: vi.fn(),
}));

vi.mock('@/actions/createPlayer', () => ({
    createPlayer: vi.fn(),
}));

vi.mock('@/actions/verifyEmail', () => ({
    sendEmailVerification: vi.fn(),
}));

vi.mock('@/actions/updatePlayer', () => ({
    updatePlayer: vi.fn(),
}));

vi.mock('@/actions/updatePlayerRecords', () => ({
    updatePlayerRecords: vi.fn().mockResolvedValue(undefined),
}));

const mockMatchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
});

if (!('matchMedia' in globalThis)) {
    Object.defineProperty(globalThis, 'matchMedia', { value: mockMatchMedia, writable: true });
}

if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = mockMatchMedia;
}

if (!('ResizeObserver' in globalThis)) {
    class MockResizeObserver {
        observe() { /* empty */ }
        unobserve() { /* empty */ }
        disconnect() { /* empty */ }
    }

    Object.defineProperty(globalThis, 'ResizeObserver', {
        value: MockResizeObserver,
        writable: true,
    });
}

if (!('EventSource' in globalThis)) {
    class MockEventSource {
        url: string;

        constructor(url: string | URL) {
            this.url = String(url);
        }

        addEventListener() { /* empty */ }
        removeEventListener() { /* empty */ }
        close() { /* empty */ }
    }

    Object.defineProperty(globalThis, 'EventSource', {
        value: MockEventSource,
        writable: true,
        configurable: true,
    });
}

interface HTMLElementLike {
    prototype: {
        scrollIntoView?: () => void;
    };
}

const HTMLElementRef = (globalThis as { HTMLElement?: HTMLElementLike }).HTMLElement;
if (HTMLElementRef && !('scrollIntoView' in HTMLElementRef.prototype)) {
    HTMLElementRef.prototype.scrollIntoView = () => undefined;
}

// Stub document.fonts for happy-dom (Mantine Textarea Autosize uses document.fonts.addEventListener)
if (typeof document !== 'undefined' && !document.fonts) {
    Object.defineProperty(document, 'fonts', {
        value: {
            addEventListener: () => { /* empty */ },
            removeEventListener: () => { /* empty */ },
        },
        writable: true,
    });
}
