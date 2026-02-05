'use client';

import {
    Box,
    Button,
    ComboboxData,
    ComboboxItem,
    ComboboxItemGroup,
    Container,
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
import Link from 'next/link';
import type { ClubType } from 'prisma/zod/schemas/models/Club.schema';
import type { CountryType } from 'prisma/zod/schemas/models/Country.schema';
import type { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import type { PlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';
import type React from 'react';
import { Activity, useEffect, useRef } from 'react';

import { EmailInput } from '@/components/EmailInput/EmailInput';
import { config } from '@/lib/config';
import { ClubSupporterDataType } from '@/types';
import type { UpdatePlayerProxy } from '@/types/actions/UpdatePlayer';
import { UpdatePlayerInput, UpdatePlayerSchema } from '@/types/actions/UpdatePlayer';
import { CountrySupporterDataType } from '@/types/CountrySupporterDataType';

export interface Props {
    player: PlayerType & { accountEmail?: string | null };
    extraEmails: PlayerExtraEmailType[];
    countries: CountrySupporterDataType[];
    clubs: ClubSupporterDataType[];
    allCountries: CountryType[];
    allClubs: ClubType[];
    verifiedEmail?: string;
    onUpdatePlayer: UpdatePlayerProxy;
}

type PlayerProfileFormValues = Omit<UpdatePlayerInput, 'clubs' | 'finished'> & {
    clubs: string[];
    retired: boolean;
};

export const PlayerProfileForm: React.FC<Props> = ({
    player,
    extraEmails,
    countries,
    clubs,
    allCountries,
    allClubs,
    verifiedEmail,
    onUpdatePlayer,
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
            icon: <IconCheck size={config.notificationIconSize} />,
            loading: false,
            autoClose: config.notificationAutoClose,
        });
        hasShownVerifiedNotification.current = true;
    }, [verifiedEmail]);

    const form = useForm<PlayerProfileFormValues>({
        initialValues: {
            name: player.name ?? '',
            anonymous: player.anonymous ?? false,
            retired: Boolean(player.finished),
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
            const { retired, clubs, ...rest } = values;
            const finished = retired ? (player.finished ?? new Date()) : null;

            await onUpdatePlayer(
                player.id,
                {
                    ...rest,
                    clubs: clubs.map((clubId) => Number(clubId)),
                    finished,
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
                icon: <IconCheck size={config.notificationIconSize} />,
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
                icon: <IconAlertTriangle size={config.notificationIconSize} />,
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
                country.length > 0 ?
                    `${country.charAt(0).toUpperCase()}${country.slice(1)}` :
                    'Unknown';

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
        <Container size="xs" mt="xl">
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
                <Flex
                    align="center"
                    gap="md"
                    justify="space-between"
                    mb="md"
                    mt="sm"
                    wrap="wrap"
                    w="100%"
                >
                    <Tooltip
                        label={[
                            `If selected, you will appear as 'Player ${player.id.toString()}' `,
                            `on the public site, with no picture or other identifying information.`,
                        ].join('')}
                        withArrow
                        multiline
                        w={220}
                    >
                        <Box>
                            <Switch
                                label="Anonymous"
                                data-testid="anonymous-switch"
                                {...form.getInputProps('anonymous', { type: 'checkbox' })}
                            />
                        </Box>
                    </Tooltip>
                    <Tooltip
                        label={[
                            `When selected, you will no longer receive match invitations. `,
                            `You can always change this later. If instead you want to `,
                            `delete your account permanently, please use the 'Delete Account' `,
                            `button below.`,
                        ].join('')}
                        withArrow
                        multiline
                        w={220}
                    >
                        <Box>
                            <Switch
                                label="Retired"
                                data-testid="retired-switch"
                                {...form.getInputProps('retired', { type: 'checkbox' })}
                            />
                        </Box>
                    </Tooltip>
                </Flex>
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
                            <Flex
                                key={index}
                                mb="md"
                                gap="sm"
                                align="flex-end"
                            >
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

                <Flex
                    align="center"
                    gap="md"
                    justify="space-between"
                    mb="md"
                    mt="sm"
                    wrap="wrap"
                    w="100%"
                >
                    <Button
                        data-testid="submit-button"
                        disabled={!form.isDirty()}
                        mt="md"
                        type="submit"
                    >
                        Save Changes
                    </Button>
                    <Button
                        color="red"
                        component={Link}
                        data-testid="delete-button"
                        href="/footy/deleteaccount"
                        mt="md"
                        type="button"
                    >
                        Delete Account
                    </Button>
                </Flex>
            </Box>
        </Container>
    );
};
