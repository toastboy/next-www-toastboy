import type { Meta, StoryObj } from '@storybook/nextjs';
import { http, HttpResponse } from 'msw';

import { defaultArse, defaultPlayer, defaultPlayerFormList, defaultPlayerRecord, defaultTrophiesList } from '@/tests/mocks';
import badgeImage from '@/tests/mocks/data/badge.png';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import flagImage from '@/tests/mocks/data/flag.png';
import mugshotImage from '@/tests/mocks/data/mugshot.png';

import PlayerProfile from './PlayerProfile';

const meta = {
    title: 'Player/PlayerProfile',
    component: PlayerProfile,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof PlayerProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

const badgeUrl = typeof badgeImage === 'string' ? badgeImage : badgeImage.src;
const flagUrl = typeof flagImage === 'string' ? flagImage : flagImage.src;
const mugshotUrl = typeof mugshotImage === 'string' ? mugshotImage : mugshotImage.src;

export const Primary: Story = {
    args: {
        playerName: 'Lionel Scruffy',
        player: defaultPlayer,
        year: 2023,
        form: defaultPlayerFormList,
        lastPlayed: defaultPlayerFormList[9],
        clubs: defaultClubSupporterDataList,
        countries: defaultCountrySupporterDataList,
        arse: defaultArse,
        activeYears: [2020, 2021, 2022, 2023],
        record: defaultPlayerRecord,
        trophies: defaultTrophiesList,
    },
    parameters: {
        msw: {
            handlers: [
                // TODO: Refactor to use a shared handler factory
                http.get('*/api/footy/player/:id/mugshot', async () => {
                    const res = await fetch(mugshotUrl);
                    const buffer = await res.arrayBuffer();

                    return new HttpResponse(buffer, {
                        headers: {
                            'Content-Type': 'image/png',
                        },
                    });
                }),
                http.get('*/api/footy/club/:id/badge', async () => {
                    const res = await fetch(badgeUrl);
                    const buffer = await res.arrayBuffer();

                    return new HttpResponse(buffer, {
                        headers: {
                            'Content-Type': 'image/png',
                        },
                    });
                }),
                http.get('*/api/footy/country/:code/flag', async () => {
                    const res = await fetch(flagUrl);
                    const buffer = await res.arrayBuffer();

                    return new HttpResponse(buffer, {
                        headers: {
                            'Content-Type': 'image/png',
                        },
                    });
                }),
            ],
        },
    },
};
