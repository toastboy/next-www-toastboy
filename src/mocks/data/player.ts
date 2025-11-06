import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';

export const defaultPlayer: PlayerType = {
    id: 1,
    isAdmin: false,
    login: "garyp",
    name: "Gary Player",
    email: "gary.player@example.com",
    joined: new Date("2021-01-01"),
    finished: null,
    born: new Date("1975-11-01"),
    introducedBy: 23,
    comment: null,
    anonymous: false,
};
