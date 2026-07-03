import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/Player');

vi.mock('@mantine/core', () => ({
    Flex: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/FamilyTree/FamilyTree', () => ({
    FamilyTree: vi.fn(() => null),
}));

import FamilyTreePage from '@/app/footy/familytree/page';
import { FamilyTree } from '@/components/FamilyTree/FamilyTree';
import playerService from '@/services/Player';
import { defaultFamilyTree } from '@/tests/mocks/data/familyTree';

describe('FamilyTree page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (playerService.getFamilyTree as Mock).mockResolvedValue(defaultFamilyTree);
    });

    it('calls playerService.getFamilyTree', async () => {
        await FamilyTreePage();

        expect(playerService.getFamilyTree).toHaveBeenCalledTimes(1);
    });

    it('passes the tree data to the FamilyTree component', async () => {
        const element = await FamilyTreePage();
        renderToStaticMarkup(element);

        expect(FamilyTree).toHaveBeenCalledWith({ data: defaultFamilyTree }, undefined);
    });

    it('handles service errors gracefully', async () => {
        (playerService.getFamilyTree as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(FamilyTreePage()).rejects.toThrow('DB failed');
    });
});
