import { GameChatType } from 'prisma/generated/schemas/models/GameChat.schema';

import { defaultGameChat } from '@/tests/mocks/data/gameChat';

export const createMockGameChat = (overrides: Partial<GameChatType> = {}): GameChatType => ({
    ...defaultGameChat,
    ...overrides,
});
