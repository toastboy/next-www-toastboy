'use client';

import {
    Box,
    Button,
    NativeSelect,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { PlayerDataType } from 'types';

import { createPlayer } from '@/actions/createPlayer';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { CreatePlayerInput, CreatePlayerSchema } from '@/types/CreatePlayerInput';

export interface Props {
    players: PlayerDataType[];
}

/**
 * A form component for registering new players.
 *
 * Collects player information including name, email, and an optional introducer.
 * Upon submission, creates the player and triggers onboarding email verification.
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
    const router = useRouter();

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            introducedBy: '',
        } satisfies CreatePlayerInput,
        validate: zod4Resolver(CreatePlayerSchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = async (
        values: typeof form.values,
    ) => {
        const id = notifications.show({
            loading: true,
            title: 'Creating player',
            message: 'Creating player...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const { player: newPlayer } = await createPlayer(values);

            notifications.update({
                id,
                color: 'teal',
                title: 'Player created',
                message: 'Player created successfully',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });

            router.push(`/footy/player/${newPlayer.id}`);
        } catch (err) {
            console.error('Failed to create player:', err);
            notifications.update({
                id,
                color: 'red',
                title: 'Error',
                message: `${String(err)}`,
                icon: <IconAlertTriangle size={18} />,
                loading: false,
                autoClose: false,
                withCloseButton: true,
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
                label="Name"
                required
                {...form.getInputProps('name')}
            />
            <EmailInput
                label="Email address"
                description="If no email is provided, the player will not be able to log in but the profile will still be created. If provided, they will receive a verification email to finish onboarding."
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
