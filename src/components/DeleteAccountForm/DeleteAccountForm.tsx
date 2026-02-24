'use client';

import {
    Anchor,
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

import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import {
    DeleteAccountInput,
    DeleteAccountSchema,
    DeletePlayerProxy,
} from '@/types/actions/DeletePlayer';

export interface Props {
    onDeletePlayer: DeletePlayerProxy;
}

export const DeleteAccountForm: React.FC<Props> = ({ onDeletePlayer }) => {
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

            await onDeletePlayer();

            form.reset();
            setSuccess(true);
        } catch (error) {
            captureUnexpectedError(error, {
                layer: 'client',
                component: 'DeleteAccountForm',
                action: 'deleteAccountData',
                route: '/footy/deleteaccount',
            });
            const message = toPublicMessage(
                error,
                error instanceof Error ? String(error) : 'Unable to delete your account data.',
            );
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

    return (
        <Container size="xs" mt="xl">
            <Stack>
                <Title order={2}>
                    Delete your account data
                </Title>
                <Text>
                    This will permanently remove your personal information and any extra emails
                    linked to your account. If instead you would like to simply stop receiving
                    emails from us, you can select &lsquo;retired&rsquo;
                    in <Anchor href="/footy/profile">your profile</Anchor>.
                </Text>
                <Text>
                    By deleting your account data:
                </Text>
                <Box component="ul" pl="md" m={0}>
                    <Text component="li">
                        Your profile details will be erased.
                    </Text>
                    <Text component="li">
                        Any extra emails will be removed from the system.
                    </Text>
                    <Text component="li">
                        Your game statistics will be retained in an anonymized form
                        for overall site statistics.
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
                    <Text>
                        Before you delete your account data, you may wish to download your personal
                        information first. You can do this by going to
                        the <Anchor href="/footy/downloadmydata">data download page</Anchor>.
                    </Text>
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
