'use client';

import { Box, Paper } from '@mantine/core';
import type { TableName } from 'prisma/generated/browser';
import type { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';
import { useState } from 'react';

import { PlayerClubs } from '@/components/PlayerClubs/PlayerClubs';
import { PlayerCountries } from '@/components/PlayerCountries/PlayerCountries';
import { PlayerMugshot } from '@/components/PlayerMugshot/PlayerMugshot';
import { PlayerTrophies } from '@/components/PlayerTrophies/PlayerTrophies';
import { PlayerDisplayType } from '@/services/Player';
import { ClubSupporterDataType, CountrySupporterDataType } from '@/types';

import classes from './PlayerCard.module.css';

export interface Props {
    player: PlayerDisplayType;
    clubs: ClubSupporterDataType[];
    countries: CountrySupporterDataType[];
    trophies: Map<TableName, PlayerRecordType[]>;
}

export const PlayerCard = ({ player, clubs, countries, trophies }: Props) => {
    return (
        <Paper shadow="xs" p="sm" miw="280px" h="100%" withBorder>
            {/* Keyed by player.id: if this PlayerCard instance is reused for a
                different player (e.g. prev/next navigation re-rendering in
                place rather than remounting), React discards and recreates
                this subtree from scratch, so its "is the mugshot ready" state
                — and the mugshot's own internal loaded state — start fresh
                rather than instantly showing the previous player's overlays. */}
            <PlayerCardImage
                key={player.id}
                player={player}
                clubs={clubs}
                countries={countries}
                trophies={trophies}
            />
        </Paper>
    );
};

const PlayerCardImage = ({ player, clubs, countries, trophies }: Props) => {
    // The trophies/clubs/countries overlays don't fetch anything of their own
    // that's worth a skeleton for — they simply reveal together once the
    // mugshot (whose own AspectRatio already reserves the card's footprint)
    // has finished loading, rather than each popping in independently.
    const [mugshotReady, setMugshotReady] = useState(false);
    // Fading via opacity alone would still leave these hit-testable, exposed
    // to assistive tech, and keyboard-focusable while "hidden". `inert` is
    // the one attribute that covers all three (pointer, a11y tree, and
    // focus) for any content that ends up inside these overlays, now or
    // later; `pointerEvents`/`aria-hidden` stay on as a fallback for browsers
    // that don't yet support `inert`.
    const overlayStyle = {
        opacity: mugshotReady ? 1 : 0,
        pointerEvents: mugshotReady ? 'auto' : 'none',
        transition: 'opacity 150ms ease',
    } as const;

    return (
        <Box w="100%" pos="relative" className={classes.imageContainer}>
            <PlayerMugshot player={player} onReady={() => setMugshotReady(true)} />
            <Box
                className={classes.trophies}
                left="0.5em"
                top="0.5em"
                style={overlayStyle}
                aria-hidden={!mugshotReady}
                inert={!mugshotReady}
            >
                <PlayerTrophies trophies={trophies} />
            </Box>
            <Box
                className={classes.badges}
                right="0.5em"
                bottom="0.5em"
                style={overlayStyle}
                aria-hidden={!mugshotReady}
                inert={!mugshotReady}
            >
                <PlayerClubs clubs={clubs} />
            </Box>
            <Box
                className={classes.badges}
                left="0.5em"
                bottom="0.5em"
                style={overlayStyle}
                aria-hidden={!mugshotReady}
                inert={!mugshotReady}
            >
                <PlayerCountries countries={countries} />
            </Box>
        </Box>
    );
};
