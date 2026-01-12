'use client';

import {
    Box,
    Button,
    Checkbox,
    Container,
    Notification,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { DeleteAccountInput, DeleteAccountSchema } from 'types/DeleteAccountInput';

import { deletePlayer } from '@/actions/deletePlayer';
import { config } from '@/lib/config';

export type Props = unknown;

export const DeleteAccountForm: React.FC<Props> = () => {
    const [errorText, setErrorText] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const form = useForm<DeleteAccountInput>({
        initialValues: {
            confirmPhrase: '',
            confirmPii: false,
        },
        validate: zod4Resolver(DeleteAccountSchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = async () => {
        try {
            setErrorText(null);
            setSuccess(false);

            await deletePlayer();

            form.reset();
            setSuccess(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected error';
            console.error('Failed to delete account data:', error);
            setErrorText(message);
        }
    };

    const notification = success ? (
        <Notification
            data-testid="success-notification"
            icon={<IconCheck size={config.notificationIconSize} />}
            color="green"
        >
            An email has been sent containing a link for you to confirm the deletion of your account.
        </Notification>
    ) : (errorText ? (
        <Notification
            data-testid="error-notification"
            icon={<IconX size={config.notificationIconSize} />}
            color="red"
            onClose={() => setErrorText(null)}
        >
            {errorText}. Please try again.
        </Notification>
    ) : null);

    // TODO Add blurb and link to email unsubscribe as an alternative to deleting account
    return (
        <Container size="xs" mt="xl">
            <Stack>
                <Title order={2}>
                    Delete your account data
                </Title>
                <Text>
                    This will permanently remove your personal information and any extra emails
                    linked to your account.
                </Text>
                <Box component="ul" pl="md" m={0}>
                    <Text component="li">
                        Your profile details will be erased.
                    </Text>
                    <Text component="li">
                        Any extra emails will be removed from the system.
                    </Text>
                </Box>
            </Stack>

            <Box
                component="form"
                onSubmit={form.onSubmit(handleSubmit)}
                noValidate
                mt="lg"
            >
                <Stack>
                    <TextInput
                        withAsterisk
                        data-testid="confirm-phrase-input"
                        label="Type DELETE to confirm"
                        placeholder="DELETE"
                        {...form.getInputProps('confirmPhrase')}
                    />
                    <Checkbox
                        data-testid="confirm-pii-checkbox"
                        label="I understand that all of my personal data will be deleted."
                        {...form.getInputProps('confirmPii', { type: 'checkbox' })}
                    />
                    {notification}
                    <Button
                        data-testid="submit-button"
                        type="submit"
                        color="red"
                        fullWidth
                    >
                        Delete my data
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
};
