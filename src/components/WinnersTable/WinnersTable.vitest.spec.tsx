import { render, screen } from '@testing-library/react';
import { TableNameSchema } from 'prisma/zod/schemas';
import { vi } from 'vitest';

import { Props as PlayerLinkProps } from '@/components/PlayerLink/PlayerLink';
import { WinnersTable } from '@/components/WinnersTable/WinnersTable';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordDataList } from '@/tests/mocks';

vi.mock('@/components/PlayerLink/PlayerLink');

describe('WinnersTable', () => {
    it('renders winners table with title and records', () => {
        render(
            <Wrapper>
                <WinnersTable
                    table={TableNameSchema.enum.points}
                    records={defaultPlayerRecordDataList}
                />
            </Wrapper>,
        );

        const props = extractMockProps<PlayerLinkProps>('PlayerLink');
        expect(screen.getByText('Points')).toBeInTheDocument();
        expect(props.length).toBe(20);
        expect(props[0].player.name).toEqual('Gary Player');
    });
});
