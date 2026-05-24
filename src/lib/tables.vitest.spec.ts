import { TableNameSchema } from 'prisma/zod/schemas';

import { ShortTableTitle } from '@/lib/tables';

describe('ShortTableTitle', () => {
    it.each([
        [TableNameSchema.enum.points,   'Points'],
        [TableNameSchema.enum.averages, 'Averages'],
        [TableNameSchema.enum.stalwart, 'Stalwart'],
        [TableNameSchema.enum.speedy,   'Speedy'],
        [TableNameSchema.enum.pub,      'Pub'],
    ])('%s → %s', (table, expected) => {
        expect(ShortTableTitle(table)).toBe(expected);
    });
});
