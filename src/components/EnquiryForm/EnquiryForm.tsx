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

import { sendEnquiry } from '@/actions/sendEnquiry';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { EnquiryInput, EnquirySchema } from '@/types/EnquiryInput';

export type Props = unknown;

export const EnquiryForm: React.FC<Props> = () => {
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

        try {
            await sendEnquiry(values);
            form.reset();

            notifications.update({
                id,
                color: 'teal',
                title: 'Message sent',
                message: 'Thanks for reaching out. We will get back to you soon.',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });
        } catch (error) {
            console.error('Failed to send enquiry:', error);
            const message = error instanceof Error ? error.message : 'Unable to send your message.';
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message,
                icon: <IconAlertTriangle size={18} />,
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
