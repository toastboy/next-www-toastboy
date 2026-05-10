import type { useForm as useFormType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerResponse } from 'prisma/generated/enums';
import { vi } from 'vitest';

import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { Wrapper } from '@/tests/components/lib/common';
import {
    createMockGameInvitationResponseDetails,
    defaultGameInvitationResponseDetails,
} from '@/tests/mocks/data/gameInvitationResponse';
import { SubmitGameInvitationResponseProxy } from '@/types/actions/SubmitGameInvitationResponse';
import { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

const formMockState = vi.hoisted(() => ({
    submitUndefinedComment: false,
}));

vi.mock('@mantine/form', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@mantine/form')>();

    return {
        ...actual,
        useForm: (options: Parameters<typeof useFormType>[0]) => {
            if (!formMockState.submitUndefinedComment) {
                return actual.useForm(options);
            }

            return {
                getInputProps: (field: string, config?: { type?: string }) => {
                    if (config?.type === 'checkbox') {
                        return {
                            checked: false,
                            onChange: vi.fn(),
                        };
                    }

                    if (field === 'response') {
                        return {
                            value: 'No',
                            onChange: vi.fn(),
                        };
                    }

                    return {
                        value: '',
                        onChange: vi.fn(),
                    };
                },
                isDirty: () => true,
                onSubmit:
                    (handler: (values: { response: 'No'; goalie: false; comment: undefined }) => Promise<void>) =>
                        async (event?: { preventDefault?: () => void }) => {
                            event?.preventDefault?.();
                            await handler({
                                response: 'No',
                                goalie: false,
                                comment: undefined,
                            });
                        },
            };
        },
    };
});

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: vi.fn(),
}));

describe('GameInvitationResponseForm', () => {
    const mockSubmitGameInvitationResponse: SubmitGameInvitationResponseProxy = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
        formMockState.submitUndefinedComment = false;
    });

    it('renders the response form', () => {
        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={defaultGameInvitationResponseDetails}
                    onSubmitGameInvitationResponse={mockSubmitGameInvitationResponse}
                />
            </Wrapper>,
        );

        expect(screen.getByText('Thanks for Your Response')).toBeInTheDocument();
        expect(screen.getByLabelText(/Response/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Goalie/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Optional comment/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Save Response/i })).toBeInTheDocument();
    });

    it('renders fallback values when invitation has no prior response or player login', () => {
        const detailsWithNoResponse = {
            ...createMockGameInvitationResponseDetails({
                response: null,
                playerLogin: null,
                comment: null,
            }),
            goalie: undefined,
        } as unknown as GameInvitationResponseDetails;

        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={detailsWithNoResponse}
                    onSubmitGameInvitationResponse={mockSubmitGameInvitationResponse}
                />
            </Wrapper>,
        );

        expect(screen.getByText('Enter Your Response')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: detailsWithNoResponse.playerName })).toHaveAttribute(
            'href',
            `/footy/player/${detailsWithNoResponse.playerId}`,
        );
        expect(screen.getByText((content) => content.includes('No response yet'))).toBeInTheDocument();
        expect(screen.getByLabelText(/Response/i)).toHaveValue('Yes');
        expect(screen.getByLabelText(/Goalie/i)).not.toBeChecked();
        expect(screen.getByRole('button', { name: /Save Response/i })).not.toBeDisabled();
    });

    it('defaults an empty incoming response value to Yes for submission', async () => {
        const user = userEvent.setup();
        const detailsWithEmptyResponse = {
            ...createMockGameInvitationResponseDetails(),
            response: '',
        } as unknown as GameInvitationResponseDetails;

        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={detailsWithEmptyResponse}
                    onSubmitGameInvitationResponse={mockSubmitGameInvitationResponse}
                />
            </Wrapper>,
        );

        expect(screen.getByLabelText(/Response/i)).toHaveValue('Yes');
        expect(screen.getByRole('button', { name: /Save Response/i })).not.toBeDisabled();

        await user.click(screen.getByRole('button', { name: /Save Response/i }));

        await waitFor(() => {
            expect(mockSubmitGameInvitationResponse).toHaveBeenCalledWith({
                token: detailsWithEmptyResponse.token,
                response: 'Yes',
                goalie: detailsWithEmptyResponse.goalie,
                comment: '',
            });
        });
    });

    it('shows admin-only responses in the summary but keeps the editable value player-safe', () => {
        const detailsWithAdminResponse = createMockGameInvitationResponseDetails({
            response: PlayerResponse.Excused,
        });

        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={detailsWithAdminResponse}
                    onSubmitGameInvitationResponse={mockSubmitGameInvitationResponse}
                />
            </Wrapper>,
        );

        expect(screen.getByText((content) => content.includes('Excused'))).toBeInTheDocument();
        expect(screen.getByLabelText(/Response/i)).toHaveValue('Yes');
        expect(screen.getByRole('button', { name: /Save Response/i })).toBeDisabled();
    });

    it('submits an updated response', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');

        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={defaultGameInvitationResponseDetails}
                    onSubmitGameInvitationResponse={mockSubmitGameInvitationResponse}
                />
            </Wrapper>,
        );

        await user.selectOptions(screen.getByLabelText(/Response/i), 'Yes');
        await user.click(screen.getByLabelText(/Goalie/i));
        await user.type(screen.getByLabelText(/Optional comment/i), 'Looking forward to it.');
        await user.click(screen.getByRole('button', { name: /Save Response/i }));

        await waitFor(() => {
            expect(mockSubmitGameInvitationResponse).toHaveBeenCalledWith({
                token: defaultGameInvitationResponseDetails.token,
                response: 'Yes',
                goalie: true,
                comment: 'Looking forward to it.',
            });
        });

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Response saved',
                    message: 'Your response has been updated.',
                }),
            );
        });
    });

    it('captures unexpected errors and shows an error notification when submit fails', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        const submitFailure = new Error('Save failed');
        const failingSubmit = vi.fn<SubmitGameInvitationResponseProxy>().mockRejectedValue(submitFailure);

        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={defaultGameInvitationResponseDetails}
                    onSubmitGameInvitationResponse={failingSubmit}
                />
            </Wrapper>,
        );

        await user.selectOptions(screen.getByLabelText(/Response/i), 'Yes');
        await user.click(screen.getByRole('button', { name: /Save Response/i }));

        await waitFor(() => {
            expect(captureUnexpectedError).toHaveBeenCalledWith(
                submitFailure,
                expect.objectContaining({
                    layer: 'client',
                    component: 'GameInvitationResponseForm',
                    action: 'submitResponse',
                    route: '/footy/game/[id]',
                    extra: {
                        playerId: defaultGameInvitationResponseDetails.playerId,
                        gameDayId: defaultGameInvitationResponseDetails.gameDayId,
                        response: 'Yes',
                    },
                }),
            );
        });

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
                color: 'red',
                title: 'Error',
                message: 'Save failed',
            }));
        });
    });

    it('shows a default error message when submit fails with a non-Error value', async () => {
        const user = userEvent.setup();
        const notificationUpdateSpy = vi.spyOn(notifications, 'update');
        const failingSubmit = vi.fn<SubmitGameInvitationResponseProxy>().mockRejectedValue('badness');

        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={defaultGameInvitationResponseDetails}
                    onSubmitGameInvitationResponse={failingSubmit}
                />
            </Wrapper>,
        );

        await user.selectOptions(screen.getByLabelText(/Response/i), 'No');
        await user.click(screen.getByRole('button', { name: /Save Response/i }));

        await waitFor(() => {
            expect(captureUnexpectedError).toHaveBeenCalledWith('badness', expect.any(Object));
        });

        await waitFor(() => {
            expect(notificationUpdateSpy).toHaveBeenCalledWith(expect.objectContaining({
                color: 'red',
                title: 'Error',
                message: 'Failed to save response',
            }));
        });
    });

    it('submits null when the form provides an undefined comment value', async () => {
        const user = userEvent.setup();
        formMockState.submitUndefinedComment = true;

        render(
            <Wrapper>
                <GameInvitationResponseForm
                    details={defaultGameInvitationResponseDetails}
                    onSubmitGameInvitationResponse={mockSubmitGameInvitationResponse}
                />
            </Wrapper>,
        );

        await user.click(screen.getByRole('button', { name: /Save Response/i }));

        await waitFor(() => {
            expect(mockSubmitGameInvitationResponse).toHaveBeenCalledWith({
                token: defaultGameInvitationResponseDetails.token,
                response: 'No',
                goalie: false,
                comment: null,
            });
        });
    });

});
