import '@testing-library/jest-dom/vitest';

import * as React from 'react';
import { vi } from 'vitest';

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

RichTextEditor.Toolbar = ({ children }: { children?: React.ReactNode }) =>
    createRichTextNode('toolbar', undefined, children);

RichTextEditor.ControlsGroup = ({ children }: { children?: React.ReactNode }) =>
    createRichTextNode('controls', undefined, children);

RichTextEditor.Content = () => createRichTextNode('content', undefined, 'Hello, this is a test!');
RichTextEditor.Bold = () => createRichTextNode('bold');
RichTextEditor.Italic = () => createRichTextNode('italic');
RichTextEditor.Underline = () => createRichTextNode('underline');
RichTextEditor.Strikethrough = () => createRichTextNode('strikethrough');
RichTextEditor.ClearFormatting = () => createRichTextNode('clear-formatting');
RichTextEditor.Highlight = () => createRichTextNode('highlight');
RichTextEditor.Code = () => createRichTextNode('code');
RichTextEditor.H1 = () => createRichTextNode('h1');
RichTextEditor.H2 = () => createRichTextNode('h2');
RichTextEditor.H3 = () => createRichTextNode('h3');
RichTextEditor.H4 = () => createRichTextNode('h4');
RichTextEditor.Blockquote = () => createRichTextNode('blockquote');
RichTextEditor.Hr = () => createRichTextNode('hr');
RichTextEditor.BulletList = () => createRichTextNode('bullet-list');
RichTextEditor.OrderedList = () => createRichTextNode('ordered-list');
RichTextEditor.Link = () => createRichTextNode('link');
RichTextEditor.Unlink = () => createRichTextNode('unlink');
RichTextEditor.AlignLeft = () => createRichTextNode('align-left');
RichTextEditor.AlignCenter = () => createRichTextNode('align-center');
RichTextEditor.AlignJustify = () => createRichTextNode('align-justify');
RichTextEditor.AlignRight = () => createRichTextNode('align-right');

vi.mock('@mantine/tiptap', () => ({
    Link: {},
    RichTextEditor,
}));

vi.mock('swr', () => ({
    default: vi.fn(),
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
