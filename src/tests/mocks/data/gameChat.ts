import { GameChatType } from "prisma/generated/schemas/models/GameChat.schema";

export const defaultGameChat: GameChatType = {
    id: 1,
    gameDay: 1,
    stamp: new Date(),
    player: 1,
    body: "Hello, world!",
};

export const createMockGameChat = (overrides: Partial<GameChatType> = {}): GameChatType => ({
    ...defaultGameChat,
    ...overrides,
});

export const defaultGameChatList: GameChatType[] = Array.from({ length: 100 }, (_, index) =>
    createMockGameChat({
        id: index + 1,
        gameDay: index + 1,
        player: index + 1,
    }),
);
