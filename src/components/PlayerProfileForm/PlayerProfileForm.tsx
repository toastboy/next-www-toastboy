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
import { IconAlertTriangle, IconCheck, IconQuestionMark, IconTrash } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';
import { CountryType } from 'prisma/zod/schemas/models/Country.schema';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { PlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';
import { Activity, useEffect, useRef } from 'react';

import { updatePlayer } from '@/actions/updatePlayer';
import { EmailInput } from '@/components/EmailInput/EmailInput';
import { config } from '@/lib/config';
import { ClubSupporterDataType } from '@/types';
import { CountrySupporterDataType } from '@/types/CountrySupporterDataType';
import { UpdatePlayerInput, UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export interface Props {
    player: PlayerType & { accountEmail?: string | null };
    extraEmails: PlayerExtraEmailType[];
    countries: CountrySupporterDataType[];
    clubs: ClubSupporterDataType[];
    allCountries: CountryType[];
    allClubs: ClubType[];
    verifiedEmail?: string;
}

type PlayerProfileFormValues = Omit<UpdatePlayerInput, 'clubs'> & {
    clubs: string[];
};

export const PlayerProfileForm: React.FC<Props> = ({
    player,
    extraEmails,
    countries,
    clubs,
    allCountries,
    allClubs,
    verifiedEmail,
}) => {
    const initialExtraEmails = extraEmails.map((playerEmail) => playerEmail.email);
    const bornYear = player.born ?? undefined;
    const hasShownVerifiedNotification = useRef(false);

    useEffect(() => {
        if (!verifiedEmail || hasShownVerifiedNotification.current) {
            return;
        }

        notifications.show({
            color: 'teal',
            title: 'Email verified',
            message: `Email address ${verifiedEmail} has been successfully verified.`,
            icon: <IconCheck size={18} />,
            loading: false,
            autoClose: config.notificationAutoClose,
        });
        hasShownVerifiedNotification.current = true;
    }, [verifiedEmail]);

    const form = useForm<PlayerProfileFormValues>({
        initialValues: {
            name: player.name ?? '',
            anonymous: player.anonymous ?? false,
            extraEmails: initialExtraEmails.length ? initialExtraEmails : [''],
            addedExtraEmails: [],
            removedExtraEmails: [],
            born: bornYear,
            countries: countries.map((country) => country.country.isoCode),
            clubs: clubs.map((club) => club.clubId.toString()),
            comment: player.comment ?? '',
        } satisfies PlayerProfileFormValues,
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
            const nextExtraEmails = values.extraEmails
                .map((email) => email.trim())
                .filter((email) => email.length > 0);
            const addedExtraEmails = nextExtraEmails
                .filter((email) => !initialExtraEmails.includes(email));
            const removedExtraEmails = initialExtraEmails
                .filter((email) => !nextExtraEmails.includes(email));
            await updatePlayer(
                player.id,
                {
                    ...values,
                    extraEmails: nextExtraEmails,
                    addedExtraEmails,
                    removedExtraEmails,
                },
            );

            notifications.update({
                id,
                color: 'teal',
                title: 'Profile updated',
                message: 'Profile updated successfully',
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: config.notificationAutoClose,
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
                data-testid="name-input"
                required
                {...form.getInputProps('name')}
            />
            <Switch
                mt="sm"
                mb="md"
                label="Anonymous"
                data-testid="anonymous-switch"
                description={[
                    `If selected, you will appear as 'Player ${player.id.toString()}' `,
                    `on the public site, with no picture or other identifying information. `,
                    `Your email addresses will never be shown regardless of this setting `,
                    `unless a player is logged in.`,
                ].join('')}
                {...form.getInputProps('anonymous', { type: 'checkbox' })}
            />
            <TextInput
                label="Account email"
                data-testid="account-email-input"
                description="This is the email address you use to log in."
                value={player.accountEmail ?? ''}
                readOnly
                disabled
            />
            <Box
                mt="md"
                p="md"
                style={{
                    border: '1px solid var(--mantine-color-gray-3)',
                    borderRadius: 'var(--mantine-radius-md)',
                }}
            >
                {form.values.extraEmails.map((email, index) => {
                    const address = `address ${index + 1}`;
                    const isVerified = extraEmails.some(
                        (value) => (value.email === email && value.verifiedAt !== null),
                    );
                    const verificationPending = extraEmails.some(
                        (value) => (value.email === email && value.verifiedAt === null),
                    );
                    const verificationMessage = isVerified ?
                        `Extra email ${address} is verified` :
                        (verificationPending ?
                            `Verification email has been sent to ${email}` :
                            `Verification email will be sent to ${email} upon submission`);

                    return (
                        <Flex key={index} mb="md" gap="sm" align="flex-end">
                            <EmailInput
                                label={`Extra email ${address}`}
                                data-testid={`extra-email-input-${index}`}
                                style={{ flex: 1 }}
                                rightSection={
                                    <Activity
                                        mode={email?.trim().length ? 'visible' : 'hidden'}
                                    >
                                        <Tooltip
                                            label={verificationMessage}
                                            withArrow
                                        >
                                            {isVerified ?
                                                <IconCheck
                                                    size={16}
                                                    aria-label={verificationMessage}
                                                /> :
                                                <IconQuestionMark
                                                    size={16}
                                                    aria-label={verificationMessage}
                                                />
                                            }
                                        </Tooltip>
                                    </Activity>
                                }
                                {...form.getInputProps(`extraEmails.${index}`)}
                            />
                            <Tooltip
                                label={`Delete extra email ${address}`}
                                withArrow
                            >
                                <Button
                                    data-testid={`extra-email-delete-button-${index}`}
                                    variant="subtle"
                                    color="red"
                                    aria-label={`Delete extra email ${address}`}
                                    onClick={() => form.removeListItem('extraEmails', index)}
                                >
                                    <IconTrash size={16} />
                                </Button>
                            </Tooltip>
                        </Flex>
                    );
                })}

                <Button
                    type="button"
                    variant="light"
                    data-testid="add-extra-email-button"
                    onClick={() => form.insertListItem('extraEmails', '')}
                >
                    Add another email
                </Button>
            </Box>

            <NumberInput
                label="Year of Birth"
                data-testid="born-input"
                description="Helps pick balanced sides"
                placeholder="Not shown on the public site"
                {...form.getInputProps('born')}
            />

            <MultiSelect
                label="National Team(s)"
                data-testid="countries-multiselect"
                placeholder="What national team(s) do you support?"
                data={countryData}
                searchable
                {...form.getInputProps('countries')}
            />

            <MultiSelect
                label="Club(s)"
                data-testid="clubs-multiselect"
                placeholder="What club(s) do you support?"
                data={clubData}
                searchable
                {...form.getInputProps('clubs')}
            />

            <Textarea
                label="Comment"
                data-testid="comment-textarea"
                placeholder="Add a comment"
                {...form.getInputProps('comment')}
            />

            <Button
                type="submit"
                mt="md"
                data-testid="submit-button"
            >
                Submit
            </Button>
        </Box>
    );
};
