/* eslint-disable simple-import-sort/imports */
// Mantine styles must be imported in this order: https://mantine.dev/styles/mantine-styles/
import '@mantine/core/styles.css';

import '@mantine/code-highlight/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
/* eslint-enable simple-import-sort/imports */

import { MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/nextjs-vite";
import type { Decorator } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { initialize, mswLoader } from "msw-storybook-addon";
import { useEffect } from "react";

const badgePng = new URL("../src/tests/mocks/data/badge.png", import.meta.url).toString();
const flagPng = new URL("../src/tests/mocks/data/flag.png", import.meta.url).toString();
const footballPng = new URL("../src/tests/mocks/data/football.png", import.meta.url).toString();
const mugshotPng = new URL("../src/tests/mocks/data/mugshot.png", import.meta.url).toString();

const mantineDecorator: Decorator = (Story) => (
    <MantineProvider>
        <Story />
    </MantineProvider>
);

initialize({ onUnhandledRequest: "bypass" });

const imageCache = new Map<string, Promise<ArrayBuffer>>();

const loadImage = (url: string): Promise<ArrayBuffer> => {
    const cached = imageCache.get(url);
    if (cached) return cached;
    const loadPromise = fetch(url).then((response) => response.arrayBuffer());
    imageCache.set(url, loadPromise);
    return loadPromise;
};

type MockAuthState = 'none' | 'user' | 'admin';
type MockAuthUser = {
    name?: string | null;
    email?: string | null;
    playerId?: number | null;
};

const MOCK_AUTH_COOKIE = 'mock-auth-state';
const MOCK_AUTH_USER_COOKIE = 'mock-auth-user';

const defaultMockUsers = {
    user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'testuser@example.com',
        role: 'user' as const,
        playerId: 1,
        emailVerified: true,
        image: null,
        banned: false,
        banReason: null,
        banExpires: null,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
    },
    admin: {
        id: 'test-admin-id',
        name: 'Test Admin',
        email: 'testadmin@example.com',
        role: 'admin' as const,
        playerId: 2,
        emailVerified: true,
        image: null,
        banned: false,
        banReason: null,
        banExpires: null,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
    },
};

const parseCookies = (cookieHeader: string | null): Record<string, string> => {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce<Record<string, string>>((acc, cookie) => {
        const trimmed = cookie.trim();
        if (!trimmed) return acc;
        const [name, ...rest] = trimmed.split('=');
        if (!name) return acc;
        acc[name] = decodeURIComponent(rest.join('='));
        return acc;
    }, {});
};

const resolveMockAuth = (cookieHeader: string | null) => {
    const cookies = parseCookies(cookieHeader);
    const role = cookies[MOCK_AUTH_COOKIE] as MockAuthState | undefined;
    const userRaw = cookies[MOCK_AUTH_USER_COOKIE];
    let userOverride: MockAuthUser | null = null;
    if (userRaw) {
        try {
            userOverride = JSON.parse(userRaw) as MockAuthUser;
        } catch {
            userOverride = null;
        }
    }

    const effectiveRole = role === 'admin' || role === 'user' ? role : 'none';
    if (effectiveRole === 'none') {
        return { role: 'none' as const, user: null };
    }

    const baseUser = defaultMockUsers[effectiveRole];
    const user = {
        ...baseUser,
        ...userOverride,
        role: effectiveRole,
    };
    return { role: effectiveRole, user };
};

const mockAuthDecorator: Decorator = (Story, context) => {
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const { role = 'none', user } = (context.parameters?.mockAuth ?? {}) as {
            role?: MockAuthState;
            user?: MockAuthUser;
        };

        if (role === 'none') {
            document.cookie = `${MOCK_AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            document.cookie = `${MOCK_AUTH_USER_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            return;
        }

        document.cookie = `${MOCK_AUTH_COOKIE}=${encodeURIComponent(role)}; path=/`;
        if (user) {
            document.cookie = `${MOCK_AUTH_USER_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/`;
        } else {
            document.cookie = `${MOCK_AUTH_USER_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
    }, [context.parameters?.mockAuth]);

    return <Story />;
};

const imageHandlers = [
    http.get("*/api/footy/country/:isoCode/flag", async () => {
        const buffer = await loadImage(flagPng);
        return HttpResponse.arrayBuffer(buffer, {
            headers: { "Content-Type": "image/png" },
        });
    }),
    http.get("*/api/footy/club/:id/badge", async () => {
        const buffer = await loadImage(badgePng);
        return HttpResponse.arrayBuffer(buffer, {
            headers: { "Content-Type": "image/png" },
        });
    }),
    http.get("*/api/footy/player/:id/mugshot", async () => {
        const buffer = await loadImage(mugshotPng);
        return HttpResponse.arrayBuffer(buffer, {
            headers: { "Content-Type": "image/png" },
        });
    }),
    http.get("*/api/footy/assets/football.png", async () => {
        const buffer = await loadImage(footballPng);
        return HttpResponse.arrayBuffer(buffer, {
            headers: { "Content-Type": "image/png" },
        });
    }),
];

const authHandlers = [
    http.get("*/api/auth/session", ({ request }) => {
        const headerCookies = request.headers.get('cookie');
        const cookieSource = headerCookies ?? (typeof document !== 'undefined' ? document.cookie : null);
        const { role, user } = resolveMockAuth(cookieSource);
        if (role === 'none' || !user) {
            return HttpResponse.json({ session: null, user: null });
        }

        return HttpResponse.json({
            session: {
                id: `${role}-session-id`,
                userId: user.id ?? `${role}-id`,
                token: `${role}-session-token`,
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-01'),
                expiresAt: new Date('2099-01-01'),
                ipAddress: '127.0.0.1',
                userAgent: 'Storybook',
                impersonatedBy: null,
            },
            user,
        });
    }),
    http.post("*/api/auth/sign-in/email", async ({ request }) => {
        const body = await request.json() as { email?: string };
        const inferredRole = body.email?.toLowerCase().includes('admin') ? 'admin' : 'user';
        const user = defaultMockUsers[inferredRole];
        return HttpResponse.json(
            { status: true, user },
            {
                headers: {
                    'Set-Cookie': [
                        `${MOCK_AUTH_COOKIE}=${encodeURIComponent(inferredRole)}; path=/`,
                        `${MOCK_AUTH_USER_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/`,
                    ].join(', '),
                },
            },
        );
    }),
    http.post("*/api/auth/sign-out", () => (
        HttpResponse.json(
            { status: true },
            {
                headers: {
                    'Set-Cookie': [
                        `${MOCK_AUTH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                        `${MOCK_AUTH_USER_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                    ].join(', '),
                },
            },
        )
    )),
    http.post("*/api/auth/admin/impersonate-user", () => (
        HttpResponse.json({ status: true })
    )),
    http.post("*/api/auth/admin/stop-impersonating", () => (
        HttpResponse.json({ status: true })
    )),
    http.post("*/api/auth/request-password-reset", () => (
        HttpResponse.json({
            status: true,
            message: 'If this email exists in our system, check your email for the reset link',
        })
    )),
    http.post("*/api/auth/reset-password", () => (
        HttpResponse.json({ status: true })
    )),
    http.post("*/api/auth/change-password", () => (
        HttpResponse.json({ status: true })
    )),
    http.post("*/api/auth/sign-up/email", () => (
        HttpResponse.json({ status: true })
    )),
];

const preview: Preview = {
    decorators: [mantineDecorator, mockAuthDecorator],
    loaders: [mswLoader],
    parameters: {
        nextjs: {
            appDirectory: true,
        },
        msw: {
            handlers: [...imageHandlers, ...authHandlers],
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: "todo",
        },
    },
};

export default preview;
