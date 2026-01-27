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
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { EmailInput } from '@/components/EmailInput/EmailInput';
import { config } from '@/lib/config';
import { SendEnquiryProxy } from '@/types/actions/SendEnquiry';
import { EnquiryInput, EnquirySchema } from '@/types/EnquiryInput';

export interface Props {
    redirectUrl: string;
    onSendEnquiry: SendEnquiryProxy;
}

export const EnquiryForm: React.FC<Props> = ({ redirectUrl, onSendEnquiry }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const form = useForm<EnquiryInput>({
        initialValues: {
            name: '',
            email: '',
            message: '',
        },
        validate: zod4Resolver(EnquirySchema),
        validateInputOnBlur: true,
    });

    useEffect(() => {
        const enquiryStatus = searchParams.get('enquiry');
        const errorMessage = searchParams.get('error');

        if (!enquiryStatus) {
            return;
        }

        if (enquiryStatus === 'verified') {
            notifications.show({
                color: 'teal',
                title: 'Email verified',
                message: 'Thanks! Your enquiry has been delivered.',
                icon: <IconCheck size={config.notificationIconSize} />,
            });
        }

        if (enquiryStatus === 'error') {
            notifications.show({
                color: 'red',
                title: 'Verification failed',
                message: errorMessage ?? 'We could not verify your email.',
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
            });
        }

        const updatedParams = new URLSearchParams(searchParams.toString());
        updatedParams.delete('enquiry');
        updatedParams.delete('error');
        const query = updatedParams.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    }, [pathname, router, searchParams]);

    const handleSubmit = async (values: EnquiryInput) => {
        const id = notifications.show({
            loading: true,
            title: 'Sending enquiry',
            message: 'Sending your message...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await onSendEnquiry(values, redirectUrl);
            form.reset();

            notifications.update({
                id,
                color: 'teal',
                title: 'Confirm your email',
                message: 'Check your inbox and verify your email to deliver the message.',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (error) {
            console.error('Failed to send enquiry:', error);
            const message = error instanceof Error ? error.message : 'Unable to send your message.';
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
                    Want to join, have a question, or just say hello? Send us a message and we will reply soon.
                </Text>
                <TextInput
                    label="Name"
                    required
                    data-testid="enquiry-name"
                    {...form.getInputProps('name')}
                />
                <EmailInput
                    label="Email"
                    required
                    data-testid="enquiry-email"
                    {...form.getInputProps('email')}
                />
                <Textarea
                    label="Message"
                    required
                    autosize
                    minRows={4}
                    data-testid="enquiry-message"
                    {...form.getInputProps('message')}
                />
                <Button type="submit" data-testid="enquiry-submit">
                    Send message
                </Button>
            </Stack>
        </Box>
    );
};
