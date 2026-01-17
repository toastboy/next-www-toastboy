'use client';

import { Box, Button, Checkbox, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';

import { triggerInvitations } from '@/actions/triggerInvitations';
import { config } from '@/lib/config';
import { NewGameInput, NewGameInputSchema } from '@/types/NewGameInput';

export const NewGameForm: React.FC = () => {
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
            const decision = await triggerInvitations(values);

            notifications.update({
                id,
                color: decision.status === 'ready' ? 'teal' : 'yellow',
                title: decision.status === 'ready' ? 'Invitations ready' : 'Invitations skipped',
                message: decision.reason === 'ready'
                    ? 'Invitations can be sent now.'
                    : `Skipped: ${decision.reason.replace(/-/g, ' ')}`,
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (error) {
            console.error('Failed to check invitations:', error);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(error)}`,
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
