'use client';

import { Anchor, Avatar, Box, Button, Checkbox, Flex, NativeSelect, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useState } from 'react';
import { z } from 'zod';

import { config } from '@/lib/config';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import {
    InvitationResponseInputSchema,
    SubmitGameInvitationResponseProxy,
} from '@/types/actions/SubmitGameInvitationResponse';
import { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

const formSchema = InvitationResponseInputSchema.omit({ token: true }).extend({
    comment: z.string().max(127).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const responseOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
    { value: 'Dunno', label: 'Dunno' },
];

interface Props {
    details: GameInvitationResponseDetails;
    onSubmitGameInvitationResponse: SubmitGameInvitationResponseProxy;
}

export const GameInvitationResponseForm: React.FC<Props> = ({ details, onSubmitGameInvitationResponse }) => {
    const [currentResponse, setCurrentResponse] = useState(details.response);
    const [currentComment, setCurrentComment] = useState(details.comment);

    const form = useForm<FormValues>({
        initialValues: {
            response: details.response ?? 'Dunno',
            goalie: details.goalie ?? false,
            comment: details.comment ?? '',
        },
        validate: zod4Resolver(formSchema),
        validateInputOnBlur: true,
    });

    const handleSubmit = async (values: FormValues) => {
        const id = notifications.show({
            loading: true,
            title: 'Saving response',
            message: 'Saving your response...',
            autoClose: false,
            withCloseButton: false,
        });

        try {
            await onSubmitGameInvitationResponse({
                token: details.token,
                response: values.response,
                goalie: values.goalie,
                comment: values.comment?.trim() ?? null,
            });

            setCurrentResponse(values.response);
            setCurrentComment(values.comment?.trim() ?? '');

            notifications.update({
                id,
                color: 'teal',
                title: 'Response saved',
                message: 'Your response has been updated.',
                icon: <IconCheck size={config.notificationIconSize} />,
                loading: false,
                autoClose: config.notificationAutoClose,
            });
        } catch (error) {
            captureUnexpectedError(error, {
                layer: 'client',
                component: 'GameInvitationResponseForm',
                action: 'submitResponse',
                route: '/footy/game/[id]',
                extra: {
                    playerId: details.playerId,
                    gameDayId: details.gameDayId,
                    response: values.response,
                },
            });
            const message = error instanceof Error ? error.message : 'Failed to save response';
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

    const displayResponse = currentResponse ?? 'No response yet';
    const displayComment = currentComment ? `("${currentComment}")` : '';
    const playerLink = details.playerLogin ? `/footy/player/${details.playerLogin}` : `/footy/player/${details.playerId}`;

    return (
        <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
                <Title order={2}>
                    {currentResponse ? 'Thanks for Your Response' : 'Enter Your Response'}
                </Title>
                <Flex align="center" gap="md" wrap="wrap">
                    <Avatar
                        src={`/api/footy/player/${details.playerId}/mugshot`}
                        alt={details.playerName}
                        size={48}
                        radius="xl"
                    />
                    <Text>
                        <Anchor href={playerLink}>{details.playerName}</Anchor>: {displayResponse} {displayComment}
                    </Text>
                </Flex>
                <Text>
                    You can change it later if you need to, even if the teams have been picked - either by clicking
                    on the link in the email you received, or by logging in to the site at{' '}
                    <Anchor href={`/footy/game/${details.gameDayId}`}>the game page</Anchor>. If you can&apos;t get to
                    a computer, call my mobile on <strong>{config.organiserPhoneNumber}</strong>.
                </Text>
                <Text>Cheers,</Text>
                <Text>Jon</Text>
                <NativeSelect
                    label="Response"
                    data={responseOptions}
                    {...form.getInputProps('response')}
                />
                <Checkbox
                    label="Goalie"
                    {...form.getInputProps('goalie', { type: 'checkbox' })}
                />
                <TextInput
                    label="Optional comment/excuse"
                    maxLength={127}
                    {...form.getInputProps('comment')}
                />
                <Button type="submit" w="fit-content">
                    Done
                </Button>
            </Stack>
        </Box>
    );
};
