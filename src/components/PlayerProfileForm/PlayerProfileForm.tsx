'use client';

import {
    Box,
    Button,
    ComboboxData,
    ComboboxItem,
    ComboboxItemGroup,
    MultiSelect,
    NumberInput,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';
import { CountryType } from 'prisma/zod/schemas/models/Country.schema';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { PlayerEmailType } from 'prisma/zod/schemas/models/PlayerEmail.schema';

import { updatePlayer } from '@/actions/updatePlayer';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { UpdatePlayerInput, UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export interface Props {
    player: PlayerType;
    emails: PlayerEmailType[];
    allCountries: CountryType[];
    allClubs: ClubType[];
}

export const PlayerProfileForm: React.FC<Props> = ({ player, emails, allCountries, allClubs }) => {
    const router = useRouter();
    const initialEmails = emails.map((playerEmail) => playerEmail.email);
    const bornYear = player.born ? player.born.getFullYear() : new Date().getFullYear();

    const form = useForm({
        initialValues: {
            name: player.name ?? '',
            emails: initialEmails.length ? initialEmails : [''],
            born: bornYear,
            countries: [],
            clubs: [],
        } satisfies UpdatePlayerInput,
        validate: zod4Resolver(UpdatePlayerSchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = async (
        values: typeof form.values,
    ) => {
        const id = notifications.show({
            loading: true,
            title: 'Updating player',
            message: 'Updating player...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const updatedPlayer = await updatePlayer(player.id, values);

            notifications.update({
                id,
                color: 'teal',
                title: 'Profile updated',
                message: 'Profile updated successfully',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });

            router.push(`/footy/player/${updatedPlayer.id}`);
        } catch (err) {
            console.error('Failed to update profile:', err);
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

    const countryData = allCountries.map((country) => ({
        label: country.name,
        value: country.isoCode,
    }));

    const clubData: ComboboxData = Object.values(
        allClubs.reduce<Record<string, ComboboxItemGroup>>((acc, club) => {
            const country = club.country ?? '';
            const group =
                country.length > 0
                    ? `${country.charAt(0).toUpperCase()}${country.slice(1)}`
                    : 'Unknown';

            const entry: ComboboxItemGroup = acc[group] ?? { group, items: [] as ComboboxItem[] };
            entry.items.push({
                label: club.clubName,
                value: club.id.toString(),
            });

            acc[group] = entry;
            return acc;
        }, {}),
    );

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
            <Box
                mt="md"
                p="md"
                style={{
                    border: '1px solid var(--mantine-color-gray-3)',
                    borderRadius: 'var(--mantine-radius-md)',
                }}
            >
                {form.values.emails.map((_, index) => (
                    <Box key={index} mb="sm">
                        <EmailInput
                            label={`Email address ${index + 1}`}
                            required={index === 0}
                            {...form.getInputProps(`emails.${index}`)}
                        />
                    </Box>
                ))}

                <Button
                    type="button"
                    variant="light"
                    onClick={() => form.insertListItem('emails', '')}
                >
                    Add another email
                </Button>
            </Box>

            <NumberInput
                label="Year of Birth"
                description="Helps pick balanced sides"
                placeholder="Not shown on the public site"
                {...form.getInputProps('born')}
            />

            <MultiSelect
                label="National Team(s)"
                placeholder="What national team(s) do you support?"
                data={countryData}
                searchable
                {...form.getInputProps('countries')}
            />

            <MultiSelect
                label="Club(s)"
                placeholder="What club(s) do you support?"
                data={clubData}
                searchable
                {...form.getInputProps('clubs')}
            />

            <Button type="submit" mt="md">
                Submit
            </Button>
        </Box>
    );
};
