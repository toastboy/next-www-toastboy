import { arse, club_supporter, club, country, game_chat, game_day, invitation, nationality, outcome, player, standings } from '@prisma/client'
import prisma from '../src/lib/prisma'

import fs from 'fs';
import path from 'path';

async function main() {
    const arses: arse[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/arses.json'), 'utf-8'));

    for (const arse of arses) {
        await prisma.arse.create({ data: arse });
    }

    const club: club_supporter[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/club_supporters.json'), 'utf-8'));

    for (const club_supporter of club) {
        await prisma.club_supporter.create({ data: club_supporter });
    }

    const clubs: club[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/clubs.json'), 'utf-8'));

    for (const club of clubs) {
        await prisma.club.create({ data: club });
    }

    const countries: country[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/countries.json'), 'utf-8'));

    for (const country of countries) {
        await prisma.country.create({ data: country });
    }

    const game_chats: game_chat[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/game_chats.json'), 'utf-8'));

    for (const game_chat of game_chats) {
        await prisma.game_chat.create({ data: game_chat });
    }

    const game_days: game_day[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/game_days.json'), 'utf-8'));

    for (const game_day of game_days) {
        await prisma.game_day.create({ data: game_day });
    }

    const invitations: invitation[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/invitations.json'), 'utf-8'));

    for (const invitation of invitations) {
        await prisma.invitation.create({ data: invitation });
    }

    const nationalities: nationality[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/nationalities.json'), 'utf-8'));

    for (const nationality of nationalities) {
        await prisma.nationality.create({ data: nationality });
    }

    const outcomes: outcome[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/outcomes.json'), 'utf-8'));

    for (const outcome of outcomes) {
        await prisma.outcome.create({ data: outcome });
    }

    const players: player[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/players.json'), 'utf-8'));

    for (const player of players) {
        await prisma.player.create({ data: player });
    }

    const standings: standings[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data/standings.json'), 'utf-8'));

    for (const standing of standings) {
        await prisma.standings.create({ data: standing });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
