import { Player } from 'prisma/generated/prisma/client';

export const defaultPlayer: Player = {
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
