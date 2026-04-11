import 'dotenv/config';

import { faker } from '@faker-js/faker';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PlayerResponse, PrismaClient, TeamName, TransactionType } from 'prisma/generated/client';
import playerRecordService from '@/services/PlayerRecord';

// Fixed seed for reproducible test data
faker.seed(12345);

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// IDs 1 and 2 correspond to the mock auth defaults in auth.server.ts:
//   mockUserDefaults.user.playerId  = 1
//   mockUserDefaults.admin.playerId = 2
const PLAYER_COUNT = 20;
const COST_PENCE = 500;       // £5 per player per game
const HALL_COST_PENCE = 2000; // £20 hall hire per game

/** Next Friday at 19:00 from a given date */
function nextFriday(from: Date): Date {
    const d = new Date(from);
    const daysUntilFriday = ((5 - d.getDay()) + 7) % 7 || 7;
    d.setDate(d.getDate() + daysUntilFriday);
    d.setHours(19, 0, 0, 0);
    return d;
}

async function main() {
    console.log('🌱 CI seed script started');

    // -------------------------------------------------------------------------
    // Clear all tables in FK-safe order (matches existing seed.ts)
    // -------------------------------------------------------------------------
    await prisma.arse.deleteMany();
    await prisma.clubSupporter.deleteMany();
    await prisma.club.deleteMany();
    await prisma.countrySupporter.deleteMany();
    await prisma.country.deleteMany();
    await prisma.gameChat.deleteMany();
    await prisma.gameInvitation.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.outcome.deleteMany();
    await prisma.playerRecord.deleteMany();
    await prisma.gameDay.deleteMany();
    await prisma.playerExtraEmail.deleteMany();
    await prisma.playerLogin.deleteMany();
    await prisma.emailVerification.deleteMany();
    await prisma.player.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // -------------------------------------------------------------------------
    // Players (explicit IDs so mock auth playerId references stay stable)
    // -------------------------------------------------------------------------
    const players = Array.from({ length: PLAYER_COUNT }, (_, i) => ({
        id: i + 1,
        name: faker.person.fullName(),
        accountEmail: faker.internet.email(),
        anonymous: false,
        goalie: i < 3,
        joined: faker.date.between({ from: new Date('2020-01-01'), to: new Date('2024-01-01') }),
        born: faker.number.int({ min: 1970, max: 2000 }),
    }));

    await prisma.player.createMany({ data: players });
    console.log(`  Created ${players.length} players`);

    // -------------------------------------------------------------------------
    // A small set of countries (enough for the world-map / supporters feature)
    // -------------------------------------------------------------------------
    await prisma.country.createMany({
        data: [
            { fifaCode: 'ENG', name: 'England' },
            { fifaCode: 'SCO', name: 'Scotland' },
            { fifaCode: 'IRL', name: 'Ireland' },
            { fifaCode: 'WAL', name: 'Wales' },
        ],
    });

    // -------------------------------------------------------------------------
    // Game days — one per week (Friday) for ~2 years, plus one upcoming game
    // -------------------------------------------------------------------------
    const now = new Date();
    const gameDays: {
        id: number;
        year: number;
        date: Date;
        game: boolean;
        cost: number;
        hallCost: number;
    }[] = [];

    let gameDayId = 1;
    // Start from the Friday ~2 years ago
    let current = nextFriday(new Date(now.getFullYear() - 2, now.getMonth(), now.getDate()));

    while (current < now) {
        gameDays.push({
            id: gameDayId++,
            year: current.getFullYear(),
            date: new Date(current),
            game: true,
            cost: COST_PENCE,
            hallCost: HALL_COST_PENCE,
        });
        current.setDate(current.getDate() + 7);
    }

    const upcomingGame = {
        id: gameDayId,
        year: nextFriday(now).getFullYear(),
        date: nextFriday(now),
        game: true,
        cost: COST_PENCE,
        hallCost: HALL_COST_PENCE,
    };
    gameDays.push(upcomingGame);

    await prisma.gameDay.createMany({ data: gameDays });
    console.log(`  Created ${gameDays.length} game days (${gameDays.length - 1} historical + 1 upcoming)`);

    // -------------------------------------------------------------------------
    // Outcomes and transactions for historical games only
    // (upcoming game has no outcomes so all players appear in the "none" group
    //  on the responses admin page, which is what responses.spec.ts needs)
    // -------------------------------------------------------------------------
    const historicalGameDays = gameDays.slice(0, -1);
    const outcomes: {
        gameDayId: number;
        playerId: number;
        response: PlayerResponse;
        team: TeamName;
        points: number;
        pub: number;
    }[] = [];
    const transactions: {
        type: TransactionType;
        amountPence: number;
        playerId: number | null;
        gameDayId: number;
    }[] = [];

    for (const gameDay of historicalGameDays) {
        // Pick 10–16 players at random for each game
        const shuffled = faker.helpers.shuffle([...players]);
        const count = faker.number.int({ min: 10, max: Math.min(16, PLAYER_COUNT) });
        const playing = shuffled.slice(0, count);

        const half = Math.floor(count / 2);
        const teamAPlayers = playing.slice(0, half);
        const teamBPlayers = playing.slice(half);

        // 0 = A wins, 1 = draw, 2 = B wins
        const result = faker.number.int({ min: 0, max: 2 });
        const aPoints = result === 0 ? 3 : result === 1 ? 1 : 0;
        const bPoints = result === 2 ? 3 : result === 1 ? 1 : 0;

        for (const player of teamAPlayers) {
            outcomes.push({
                gameDayId: gameDay.id,
                playerId: player.id,
                response: PlayerResponse.Yes,
                team: TeamName.A,
                points: aPoints,
                pub: faker.datatype.boolean({ probability: 0.3 }) ? 1 : 0,
            });
            transactions.push({
                type: TransactionType.PlayerGameCharge,
                amountPence: COST_PENCE,
                playerId: player.id,
                gameDayId: gameDay.id,
            });
        }

        for (const player of teamBPlayers) {
            outcomes.push({
                gameDayId: gameDay.id,
                playerId: player.id,
                response: PlayerResponse.Yes,
                team: TeamName.B,
                points: bPoints,
                pub: faker.datatype.boolean({ probability: 0.3 }) ? 1 : 0,
            });
            transactions.push({
                type: TransactionType.PlayerGameCharge,
                amountPence: COST_PENCE,
                playerId: player.id,
                gameDayId: gameDay.id,
            });
        }

        // Hall hire transaction (no player)
        transactions.push({
            type: TransactionType.HallHire,
            amountPence: HALL_COST_PENCE,
            playerId: null,
            gameDayId: gameDay.id,
        });
    }

    // Prisma createMany doesn't support more than a few thousand rows in one call
    // on some adapters, so batch in chunks of 500
    const CHUNK = 500;
    for (let i = 0; i < outcomes.length; i += CHUNK) {
        await prisma.outcome.createMany({ data: outcomes.slice(i, i + CHUNK) });
    }
    console.log(`  Created ${outcomes.length} outcomes`);

    for (let i = 0; i < transactions.length; i += CHUNK) {
        await prisma.transaction.createMany({ data: transactions.slice(i, i + CHUNK) });
    }
    console.log(`  Created ${transactions.length} transactions`);

    // -------------------------------------------------------------------------
    // Player records — derived from outcomes (same as production seed)
    // -------------------------------------------------------------------------
    console.log('  Calculating player records...');
    await playerRecordService.deleteAll();
    await playerRecordService.upsertForGameDay();
    console.log('  Player records done');

    console.log('🌱 CI seed complete');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
