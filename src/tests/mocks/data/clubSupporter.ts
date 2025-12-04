import { ClubSupporterType } from "prisma/generated/schemas/models/ClubSupporter.schema";

import { createMockClubSupporter } from "@/tests/mocks/factories/clubSupporterFactory";

export const defaultClubSupporter: ClubSupporterType = {
    playerId: 12,
    clubId: 2270,
};

export const defaultClubSupporterList: ClubSupporterType[] = Array.from({ length: 100 }, (_, index) =>
    createMockClubSupporter({
        playerId: index % 10 + 1,
        clubId: index + 1,
    }),
);
