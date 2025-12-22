'use client';

import { Box, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';

import { EmailInput } from '@/components/EmailInput/EmailInput';
import { sendEmail } from '@/lib/mail';

const schema = z.object({
    email: z.email({ message: 'Invalid email' }),
});

export type Props = unknown;

export const NewPlayerForm: React.FC<Props> = () => {
    const form = useForm({
        initialValues: { email: '' },
        validate: zod4Resolver(schema),
    });

    const handleSubmit = async (
        values: typeof form.values,
    ) => {
        const id = notifications.show({
            loading: true,
            title: 'Sending email',
            message: 'Sending email...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await sendEmail(values.email, "Test subject", "Test body");

            notifications.update({
                id,
                color: 'teal',
                title: 'Email sent',
                message: 'Email sent successfully',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Failed to send:', err);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(err)}`,
                icon: <IconAlertTriangle size={18} />,
                loading: false,
                autoClose: 2000,
            });
        }
    };

    return (
        <Box maw={400}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <EmailInput
                    label="Email address"
                    required
                    {...form.getInputProps('email')}
                />

                <Button type="submit" mt="md">
                    Submit
                </Button>
            </form>
        </Box>
    );
};
