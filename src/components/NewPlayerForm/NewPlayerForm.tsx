'use client';

import {
    Anchor,
    Box,
    Button,
    Flex,
    MantineProvider,
    NativeSelect,
    Text,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import ReactDOMServer from 'react-dom/server';

import { createPlayer } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { CreatePlayerInput, CreatePlayerSchema } from '@/types/CreatePlayerInput';

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
            const { player: newPlayer, inviteLink } = await createPlayer(values);

            if (values.email?.length > 0) {
                // TODO: Finish off welcome email body
                const introducerEmail = values.introducedBy
                    ? players.find((p) => p.id.toString() === values.introducedBy)?.email ?? ''
                    : '';
                const cc = [introducerEmail, 'footy@toastboy.co.uk']
                    .filter((e): e is string => !!e).join(', ');
                const html = ReactDOMServer.renderToStaticMarkup(
                    <MantineProvider>
                        <Flex direction="column" gap="md">
                            <Text>
                                Welcome to Toastboy FC!
                            </Text>
                            <Text>
                                Follow this link to get started:
                                <Anchor href={inviteLink}>confirm your account</Anchor>
                            </Text>
                            <Text>
                                &&&& Detailed welcome text goes here: how to log on, where to find info, rules, etc. &&&&
                            </Text>
                        </Flex>
                    </MantineProvider>,
                );

                await sendEmail(values.email, cc, 'Welcome to Toastboy FC!', html);
            }

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
                description="If no email is provided, the player will not be able to log in but the profile will still be created."
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
