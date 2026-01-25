
import { render } from '@testing-library/react';
import { TableNameSchema } from 'prisma/zod/schemas';
import { vi } from 'vitest';

import { Props as PlayerLinkProps } from '@/components/PlayerLink/PlayerLink';
import { TableQualified } from '@/components/TableQualified/TableQualified';
import { Props as TableScoreProps } from '@/components/TableScore/TableScore';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

vi.mock('@/components/PlayerLink/PlayerLink');
vi.mock('@/components/TableScore/TableScore');

describe('TableQualified', () => {
    it('renders qualified table with player records', () => {
        render(
            <Wrapper>
                <TableQualified
                    table={TableNameSchema.enum.points}
                    title="2024 Points Table"
                    year={2024}
                    records={defaultPlayerRecordDataList}
                />
            </Wrapper>,
        );

        {
            const props = extractMockProps<PlayerLinkProps>('PlayerLink');
            expect(props.length).toBe(20);
            expect(props[0].player.name).toEqual("Gary Player");
        }

        {
            const props = extractMockProps<TableScoreProps>('TableScore');
            expect(props.length).toBe(20);
            expect(props[0].table).toEqual(TableNameSchema.enum.points);
            expect(props[0].playerRecord.playerId).toEqual(12);
        }
    });
});
