'use client';

import { Button } from '@mantine/core';
import { useState } from 'react';

import { SendEmailForm } from '@/components/SendEmailForm/SendEmailForm';
import type { PlayerDataEmailDisplayType } from '@/types';
import type { SendEmailProxy } from '@/types/actions/SendEmail';

/**
 * Props for the EmailPlayerButton component, which includes the player to email
 * and a callback function to handle the email sending action.
 */
export interface Props {
    player: PlayerDataEmailDisplayType;
    onSendEmail: SendEmailProxy;
}

/**
 * This component renders a button that, when clicked, opens a form to send an
 * email to the specified player. It manages the open state of the form and
 * passes the necessary props to the form component.
 *
 * @param player - The player to whom the email will be sent
 * @param onSendEmail - A callback function to handle the email sending action
 * @returns A React component that includes a button and the email form
 */
export const EmailPlayerButton = ({ player, onSendEmail }: Props) => {
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Button type="button" onClick={() => setOpened(true)}>Send Email...</Button>
            <SendEmailForm
                opened={opened}
                onClose={() => setOpened(false)}
                players={[player]}
                onSendEmail={onSendEmail}
            />
        </>
    );
};
