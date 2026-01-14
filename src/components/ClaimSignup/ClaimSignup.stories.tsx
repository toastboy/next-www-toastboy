import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, mocked, within } from 'storybook/test';

import { authClient } from '@/lib/auth-client';

import { ClaimSignup } from './ClaimSignup';

const meta = {
    title: 'Forms/ClaimSignup',
    component: ClaimSignup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ClaimSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Render: Story = {
    args: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        token: 'example-token',
    },
};

export const ValidSubmit: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        mocked(authClient.signUp.email).mockResolvedValue({
            token: null,
            user: {
                id: '123x',
                name: 'John Doe',
                email: 'john.doe@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                emailVerified: false,
                image: null,
            },
        });

        const canvas = within(canvasElement);
        const password = await canvas.findByTestId('password-input');
        const confirmPassword = await canvas.findByTestId('confirm-password-input');
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.clear(password);
        await userEvent.type(password, 'validPassword123');
        await userEvent.clear(confirmPassword);
        await userEvent.type(confirmPassword, 'validPassword123');
        await userEvent.click(submitButton);

        type SignUpEmailFn = (
            payload: { name: string; email: string; password: string },
            options?: { onError?: (ctx: unknown) => void },
        ) => Promise<unknown>;
        const mockSignUpEmail = authClient.signUp.email as unknown as jest.MockedFunction<SignUpEmailFn>;
        await expect(mockSignUpEmail).toHaveBeenCalled();
        const firstCallArg = mockSignUpEmail.mock.calls[0][0] as {
            name: string,
            email: string,
            password: string,
        };
        await expect(firstCallArg).toEqual({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'validPassword123',
        });
    },
};

export const InvalidSubmit: Story = {
    ...Render,
    play: async function ({ canvasElement, userEvent, viewMode }) {
        if (viewMode === 'docs') return;

        const canvas = within(canvasElement);
        const password = await canvas.findByTestId('password-input');
        const confirmPassword = await canvas.findByTestId('confirm-password-input');
        const submitButton = await canvas.findByTestId('submit-button');

        await userEvent.clear(password);
        await userEvent.type(password, 'validPassword123');
        await userEvent.clear(confirmPassword);
        await userEvent.type(confirmPassword, 'doofusPassword789');
        await userEvent.click(submitButton);

        // Mantine duplicates the error text in the label and the error element, so assert via aria-describedby.
        const errorId = confirmPassword.getAttribute('aria-describedby');
        if (!errorId) {
            throw new Error('Expected confirm password input to have aria-describedby pointing at the error element');
        }

        // Mantine may render the error element outside the story canvas (portal).
        // Try the canvas first, then fall back to the global document by id.
        let errorEl = canvasElement.querySelector<HTMLElement>(`#${CSS.escape(errorId)}`);
        errorEl ??= document.getElementById(errorId);

        if (!errorEl) {
            throw new Error(`Expected to find error element with id "${errorId}"`);
        }

        await expect(errorEl.textContent ?? '').toMatch(/passwords do not match/i);
    },
};
