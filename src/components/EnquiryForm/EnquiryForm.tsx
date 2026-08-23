'use client';

import {
    Box,
    Button,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { EmailInput } from '@/components/EmailInput/EmailInput';
import { config } from '@/lib/config';
import { toPublicMessage } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import type {
    EnquiryInput,
    SendEnquiryProxy,
} from '@/types/actions/SendEnquiry';
import { EnquirySchema } from '@/types/actions/SendEnquiry';

export interface Props {
    onSendEnquiry: SendEnquiryProxy;
}

export const EnquiryForm = ({ onSendEnquiry }: Props) => {
    const pathname = usePathname();
    const [submitting, setSubmitting] = useState(false);
    const form = useForm<EnquiryInput>({
        initialValues: {
            name: '',
            email: '',
            message: '',
        },
        validate: zod4Resolver(EnquirySchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = async (values: EnquiryInput) => {
        const id = notifications.show({
            loading: true,
            title: 'Sending enquiry',
            message: 'Sending your message...',
            autoClose: false,
            withCloseButton: false,
        });

        setSubmitting(true);
        try {
            await onSendEnquiry(values);
            form.reset();

            notifications.update({
                id,
                color: 'teal',
                title: 'Confirm your email',
                message:
                    'Check your inbox and verify your email to deliver the message.',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
            });
        } catch (error) {
            captureUnexpectedError(error, {
                layer: 'client',
                component: 'EnquiryForm',
                action: 'sendEnquiry',
                route: pathname,
            });
            const message = toPublicMessage(
                error,
                'Unable to send your message.',
            );
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message,
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box
            maw={520}
            component="form"
            onSubmit={form.onSubmit(handleSubmit)}
            noValidate
        >
            <Stack>
                <Title order={3}>Get in touch</Title>
                <Text>
                    Want to join, have a question, or just say hello? Send us a
                    message and we will reply soon.
                </Text>
                <TextInput
                    label="Name"
                    required
                    {...form.getInputProps('name')}
                />
                <EmailInput
                    label="Email"
                    required
                    {...form.getInputProps('email')}
                />
                <Textarea
                    label="Message"
                    required
                    autosize
                    minRows={4}
                    {...form.getInputProps('message')}
                />
                <Button
                    type="submit"
                    loading={submitting}
                >
                    Send message
                </Button>
            </Stack>
        </Box>
    );
};
