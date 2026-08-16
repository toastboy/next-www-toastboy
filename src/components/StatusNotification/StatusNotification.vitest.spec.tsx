import { IconCheck, IconX } from '@tabler/icons-react';
import { render, screen } from '@testing-library/react';

import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
import { Wrapper } from '@/tests/components/lib/common';

describe('StatusNotification', () => {
    it('renders a notification with the given message and icon', () => {
        render(
            <Wrapper>
                <StatusNotification
                    icon={<IconX size={18} />}
                    color="red"
                    message="Something went wrong."
                />
            </Wrapper>,
        );

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Something went wrong.',
        );
    });

    it('renders a close button by default', () => {
        render(
            <Wrapper>
                <StatusNotification
                    icon={<IconCheck size={18} />}
                    color="teal"
                    message="All good."
                />
            </Wrapper>,
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('hides the close button when withCloseButton is false', () => {
        render(
            <Wrapper>
                <StatusNotification
                    icon={<IconX size={18} />}
                    color="red"
                    withCloseButton={false}
                    message="This invitation link is invalid."
                />
            </Wrapper>,
        );

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders an anchor alongside the notification when provided', () => {
        render(
            <Wrapper>
                <StatusNotification
                    icon={<IconX size={18} />}
                    color="red"
                    withCloseButton={false}
                    message="Unable to verify email."
                    anchor={{
                        href: '/footy/profile',
                        label: 'Return to your profile',
                    }}
                />
            </Wrapper>,
        );

        expect(
            screen.getByRole('link', { name: 'Return to your profile' }),
        ).toHaveAttribute('href', '/footy/profile');
    });

    it('renders a plain variant with no icon or notification chrome', () => {
        render(
            <Wrapper>
                <StatusNotification
                    variant="plain"
                    color="red"
                    message="Failed to fetch users."
                />
            </Wrapper>,
        );

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(screen.getByText('Failed to fetch users.')).toBeInTheDocument();
    });

    it('renders a plain variant with an anchor', () => {
        render(
            <Wrapper>
                <StatusNotification
                    variant="plain"
                    message="Invitation details are missing."
                    anchor={{
                        href: '/footy/game',
                        label: 'Go to the game page',
                    }}
                />
            </Wrapper>,
        );

        expect(
            screen.getByText('Invitation details are missing.'),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Go to the game page' }),
        ).toHaveAttribute('href', '/footy/game');
    });
});
