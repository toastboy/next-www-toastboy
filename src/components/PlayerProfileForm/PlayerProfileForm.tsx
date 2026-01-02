'use client';

import {
    Box,
    Button,
    ComboboxData,
    ComboboxItem,
    ComboboxItemGroup,
    Flex,
    MultiSelect,
    NumberInput,
    Switch,
    Textarea,
    TextInput,
    Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconTrash } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';
import { CountryType } from 'prisma/zod/schemas/models/Country.schema';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { PlayerEmailType } from 'prisma/zod/schemas/models/PlayerEmail.schema';

import { requestPlayerEmailVerification } from '@/actions/requestPlayerEmailVerification';
import { sendEmail } from '@/actions/sendEmail';
import { updatePlayer } from '@/actions/updatePlayer';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { ClubSupporterDataType } from '@/types';
import { CountrySupporterDataType } from '@/types/CountrySupporterDataType';
import { UpdatePlayerInput, UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export interface Props {
    player: PlayerType;
    emails: PlayerEmailType[];
    countries: CountrySupporterDataType[];
    clubs: ClubSupporterDataType[];
    allCountries: CountryType[];
    allClubs: ClubType[];
}

type PlayerProfileFormValues = Omit<UpdatePlayerInput, 'clubs'> & {
    clubs: string[];
};

export const PlayerProfileForm: React.FC<Props> = ({
    player,
    emails,
    countries,
    clubs,
    allCountries,
    allClubs,
}) => {
    const initialEmails = emails.map((playerEmail) => playerEmail.email);
    const bornYear = player.born ?? undefined;

    const form = useForm<PlayerProfileFormValues>({
        initialValues: {
            name: player.name ?? '',
            anonymous: player.anonymous ?? false,
            emails: initialEmails.length ? initialEmails : [''],
            addedEmails: [],
            removedEmails: [],
            born: bornYear,
            countries: countries.map((country) => country.country.isoCode),
            clubs: clubs.map((club) => club.clubId.toString()),
            comment: player.comment ?? '',
        } satisfies PlayerProfileFormValues,
        validate: zod4Resolver(UpdatePlayerSchema),
        validateInputOnBlur: true,
    });

    const handleVerifyEmail = async (email: string) => {
        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            notifications.show({
                color: 'red',
                title: 'Missing email',
                message: 'Enter an email address before requesting verification.',
                icon: <IconAlertTriangle size={18} />,
            });
            return;
        }

        const id = notifications.show({
            loading: true,
            title: 'Sending verification',
            message: 'Sending verification email...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            const { verificationLink } = await requestPlayerEmailVerification(
                player.id,
                normalizedEmail,
            );

            const html = [
                `<p>Hello${player.name ? ` ${player.name}` : ''},</p>`,
                '<p>Please verify your email address by clicking the link below:</p>',
                `<p><a href="${verificationLink}">Verify your email</a></p>`,
                '<p>If you did not request this, you can ignore this message.</p>',
            ].join('');

            await sendEmail(normalizedEmail, '', 'Verify your email address', html);

            notifications.update({
                id,
                color: 'teal',
                title: 'Verification sent',
                message: 'Verification email sent.',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });
        } catch (err) {
            console.error('Failed to send verification email:', err);
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
            const addedEmails = values.emails
                .map((email) => email.trim())
                .filter((email) => email.length > 0 && !initialEmails.includes(email));
            const removedEmails = initialEmails
                .filter((email) => !values.emails.includes(email));
            await updatePlayer(
                player.id,
                {
                    ...values,
                    addedEmails,
                    removedEmails,
                },
            );

            notifications.update({
                id,
                color: 'teal',
                title: 'Profile updated',
                message: 'Profile updated successfully',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
            });
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
            <Switch
                mt="sm"
                mb="md"
                label="Anonymous"
                description={
                    `If selected, you will appear as 'Player ${player.id.toString()}' on the public site, with no picture or other identifying information. Email addresses will never be shown regardless of this setting.`
                }
                {...form.getInputProps('anonymous', { type: 'checkbox' })}
            />
            <Box
                mt="md"
                p="md"
                style={{
                    border: '1px solid var(--mantine-color-gray-3)',
                    borderRadius: 'var(--mantine-radius-md)',
                }}
            >
                {form.values.emails.map((email, index) => {
                    const address = `address ${index + 1}`;
                    const isVerified = emails.some(
                        (value) => (value.email === email && value.verifiedAt !== null),
                    );

                    return (
                        <Flex key={index} mb="md" gap="sm" align="flex-end">
                            <EmailInput
                                label={`Email ${address}`}
                                required={index === 0}
                                style={{ flex: 1 }}
                                {...form.getInputProps(`emails.${index}`)}
                            />
                            <Tooltip
                                label={
                                    isVerified ?
                                        `Email ${address} is verified` :
                                        `Verify email ${address}`
                                }
                                withArrow
                            >
                                <Button
                                    variant={isVerified ? 'subtle' : 'filled'}
                                    color={isVerified ? 'green' : 'gray'}
                                    aria-label={`Verify email ${address}`}
                                    disabled={isVerified}
                                    onClick={() => handleVerifyEmail(email)}
                                >
                                    <IconCheck size={16} />
                                </Button>
                            </Tooltip>
                            {index === 0 ? (
                                <Button
                                    variant="subtle"
                                    color="gray"
                                    aria-label="Primary email cannot be deleted"
                                    disabled
                                    style={{ visibility: 'hidden' }}
                                >
                                    <IconTrash size={16} />
                                </Button>
                            ) : (
                                <Tooltip
                                    label={`Delete email ${address}`}
                                    withArrow
                                >
                                    <Button
                                        variant="subtle"
                                        color="red"
                                        aria-label={`Delete email ${address}`}
                                        onClick={() => form.removeListItem('emails', index)}
                                    >
                                        <IconTrash size={16} />
                                    </Button>
                                </Tooltip>
                            )}
                        </Flex>
                    );
                })}

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

            <Textarea
                label="Comment"
                placeholder="Add a comment"
                {...form.getInputProps('comment')}
            />

            <Button type="submit" mt="md">
                Submit
            </Button>
        </Box>
    );
};
