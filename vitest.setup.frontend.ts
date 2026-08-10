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

// Component props (editor instances, Mantine style props like `mt`, etc.) aren't
// valid DOM attributes — spreading them onto the mock's <div> would trigger React
// warnings and stringify objects into attributes. Only pass through props a real
// DOM element accepts, including standard attributes and event handlers, so
// interaction/accessibility-focused tests against the mock keep working.
const DOM_SAFE_PROP_NAMES = new Set(['id', 'role', 'tabIndex', 'title']);
const isDomSafeProp = (key: string) =>
    key === 'className' ||
    key === 'style' ||
    key.startsWith('data-') ||
    key.startsWith('aria-') ||
    /^on[A-Z]/.test(key) ||
    DOM_SAFE_PROP_NAMES.has(key);

const pickDomSafeProps = (props: Record<string, unknown> = {}) =>
    Object.fromEntries(
        Object.entries(props).filter(([key]) => isDomSafeProp(key)),
    );

const createRichTextNode = (
    name: string,
    props?: Record<string, unknown>,
    children?: React.ReactNode,
) =>
    React.createElement(
        'div',
        { 'data-testid': `rich-text-${name}`, ...pickDomSafeProps(props) },
        children,
    );

// Widened to accept arbitrary props (editor instances, Mantine style props,
// control-specific props like `sticky`/`stickyOffset`, etc.) so the mock's own
// type doesn't drift from what real `@mantine/tiptap` consumers pass — only
// pickDomSafeProps above decides what actually reaches the DOM.
type MockRichTextProps = React.PropsWithChildren<Record<string, unknown>>;
const mockControl = (name: string) => (_props?: MockRichTextProps) =>
    createRichTextNode(name);

const RichTextEditor = Object.assign(
    ({ children, ...props }: MockRichTextProps) =>
        createRichTextNode('editor', props, children),
    {
        Toolbar: ({ children }: MockRichTextProps) =>
            createRichTextNode('toolbar', undefined, children),
        ControlsGroup: ({ children }: MockRichTextProps) =>
            createRichTextNode('controls', undefined, children),
        Content: (_props?: MockRichTextProps) =>
            createRichTextNode('content', undefined, 'Hello, this is a test!'),
        Bold: mockControl('bold'),
        Italic: mockControl('italic'),
        Underline: mockControl('underline'),
        Strikethrough: mockControl('strikethrough'),
        ClearFormatting: mockControl('clear-formatting'),
        Highlight: mockControl('highlight'),
        Code: mockControl('code'),
        H1: mockControl('h1'),
        H2: mockControl('h2'),
        H3: mockControl('h3'),
        H4: mockControl('h4'),
        Blockquote: mockControl('blockquote'),
        Hr: mockControl('hr'),
        BulletList: mockControl('bullet-list'),
        OrderedList: mockControl('ordered-list'),
        Link: mockControl('link'),
        Unlink: mockControl('unlink'),
        AlignLeft: mockControl('align-left'),
        AlignCenter: mockControl('align-center'),
        AlignJustify: mockControl('align-justify'),
        AlignRight: mockControl('align-right'),
    },
);

vi.mock('@mantine/tiptap', () => ({
    Link: {},
    RichTextEditor,
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
    Object.defineProperty(globalThis, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
    });
}

if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = mockMatchMedia;
}

if (!('ResizeObserver' in globalThis)) {
    class MockResizeObserver {
        observe() {
            /* empty */
        }
        unobserve() {
            /* empty */
        }
        disconnect() {
            /* empty */
        }
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

        addEventListener() {
            /* empty */
        }
        removeEventListener() {
            /* empty */
        }
        close() {
            /* empty */
        }
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

const HTMLElementRef = (globalThis as { HTMLElement?: HTMLElementLike })
    .HTMLElement;
if (HTMLElementRef && !('scrollIntoView' in HTMLElementRef.prototype)) {
    HTMLElementRef.prototype.scrollIntoView = () => undefined;
}

// Stub document.fonts for happy-dom (Mantine Textarea Autosize uses document.fonts.addEventListener)
if (typeof document !== 'undefined' && !document.fonts) {
    Object.defineProperty(document, 'fonts', {
        value: {
            addEventListener: () => {
                /* empty */
            },
            removeEventListener: () => {
                /* empty */
            },
        },
        writable: true,
    });
}
