'use client';

import { Box, Button, Checkbox, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';

import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type { TriggerInvitationsProxy } from '@/types/actions/TriggerInvitations';
import { NewGameInput, NewGameInputSchema } from '@/types/actions/TriggerInvitations';

export interface Props {
    onTriggerInvitations: TriggerInvitationsProxy;
}

export const NewGameForm: React.FC<Props> = ({ onTriggerInvitations }) => {
    const form = useForm<NewGameInput>({
        initialValues: {
            overrideTimeCheck: false,
            customMessage: '',
        },
        validate: zod4Resolver(NewGameInputSchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = async (values: NewGameInput) => {
        const id = notifications.show({
            loading: true,
            title: 'Checking invitations',
            message: 'Checking invitation timing...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const decision = await onTriggerInvitations(values);

            notifications.update({
                id,
                color: decision.status === 'ready' ? 'teal' : 'yellow',
                title: decision.status === 'ready' ? 'Invitations ready' : 'Invitations skipped',
                message: decision.reason === 'ready' ?
                    'Invitations can be sent now.' :
                    `Skipped: ${decision.reason.replace(/-/g, ' ')}`,
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (error) {
            captureUnexpectedError(error, {
                layer: 'client',
                component: 'NewGameForm',
                action: 'triggerInvitations',
                route: '/footy/admin/newgame',
                extra: {
                    overrideTimeCheck: values.overrideTimeCheck,
                },
            });
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: toPublicMessage(
                    error,
                    error instanceof Error ? String(error) : 'Failed to check invitations.',
                ),
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        }
    };

    return (
        <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
                <Checkbox
                    label="Override time check (normally invitations are sent 9am the working day before the game)"
                    {...form.getInputProps('overrideTimeCheck', { type: 'checkbox' })}
                />
                <Textarea
                    label='Custom message (e.g. "You are getting this email early because...")'
                    autosize
                    minRows={6}
                    {...form.getInputProps('customMessage')}
                />
                <Button type="submit" w="fit-content">
                    Submit
                </Button>
            </Stack>
        </Box>
    );
};
