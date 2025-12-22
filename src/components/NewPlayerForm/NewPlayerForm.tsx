'use client';

import { Box, Button, NativeSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { z } from 'zod';

import { EmailInput } from '@/components/EmailInput/EmailInput';
import { sendEmail } from '@/lib/mail';

export interface Props {
    players: PlayerType[];
}

/**
 * A form component for registering new players.
 * 
 * Collects player information including first name, last name, email, and an optional introducer.
 * Upon submission, sends a welcome email to the new player and displays notifications for success or failure.
 * 
 * @param props - Component props
 * @param props.players - Array of existing players used to populate the "Introduced by" dropdown
 * 
 * @example
 * ```tsx
 * <NewPlayerForm players={existingPlayers} />
 * ```
 */
export const NewPlayerForm: React.FC<Props> = ({ players }) => {
    const schema = z.object({
        firstName: z.string().min(1, { message: 'First name is required' }),
        lastName: z.string().optional(),
        email: z.email({ message: 'Invalid email' }),
        introducedBy: z.string().optional(),
    });

    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            introducedBy: '',
        } satisfies z.infer<typeof schema>,
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

    const introducers = [
        { label: '(Nobody)', value: '' },
        ...players.map((player) => ({
            label: player.name ?? '',
            value: player.id.toString(),
        })).sort((a, b) => a.label.localeCompare(b.label)),
    ];

    return (
        <Box
            maw={400}
            component="form"
            onSubmit={form.onSubmit(handleSubmit)}
        >
            <TextInput
                label="First name"
                required
                {...form.getInputProps('firstName')}
            />
            <TextInput
                label="Last name"
                {...form.getInputProps('lastName')}
            />
            <EmailInput
                label="Email address"
                required
                {...form.getInputProps('email')}
            />
            <NativeSelect
                label="Introduced by"
                data={introducers}
                {...form.getInputProps('introducedBy')}
            />

            <Button type="submit" mt="md">
                Submit
            </Button>
        </Box>
    );
};
