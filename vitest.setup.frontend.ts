import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';

const authClientMock = {
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn(),
    changePassword: vi.fn(),
    signIn: {
        social: vi.fn(),
    },
    signInWithEmail: vi.fn(),
    signUp: {
        email: vi.fn(),
    },
    useSession: vi.fn(() => ({
        data: null,
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
    })),
};

const authClientUiMock = {
    signInWithEmail: vi.fn(),
    useSession: vi.fn(() => ({
        data: null,
        isPending: false,
        error: null,
    })),
    signOut: vi.fn(),
    setAdmin: vi.fn(),
    isLoggedIn: vi.fn(),
    isAdmin: vi.fn(),
    getUser: vi.fn(),
    listUsers: vi.fn(),
};

vi.mock('@/lib/auth-client', () => ({
    authClient: authClientMock,
    signInWithGoogle: vi.fn((callbackURL: string) =>
        authClientMock.signIn.social({ provider: 'google', callbackURL }),
    ),
    signInWithMicrosoft: vi.fn((callbackURL: string) =>
        authClientMock.signIn.social({ provider: 'microsoft', callbackURL }),
    ),
}));

vi.mock('@/lib/authClient', () => ({
    authClient: authClientUiMock,
}));

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

vi.mock('swr', () => ({
    default: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
}));

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
