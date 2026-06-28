import { TableNameSchema } from 'prisma/zod/schemas';
import { describe, expect, it } from 'vitest';

import { getYearName,QualifiedTableName, ShortTableTitle, TableTitle, UnqualifiedTableName } from '@/lib/tables';

describe('getYearName', () => {
    it('returns "All-time" for year 0', () => {
        expect(getYearName(0)).toBe('All-time');
    });

    it('returns the year as a string for non-zero years', () => {
        expect(getYearName(2025)).toBe('2025');
        expect(getYearName(1998)).toBe('1998');
    });
});

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

describe('TableTitle', () => {
    it('returns "Captain Speedy" for the speedy table', () => {
        expect(TableTitle(TableNameSchema.enum.speedy)).toBe('Captain Speedy');
    });

    it('returns "Stalwart Standings" for the stalwart table', () => {
        expect(TableTitle(TableNameSchema.enum.stalwart)).toBe('Stalwart Standings');
    });

    it('returns a capitalised "<name> Table" for other tables', () => {
        expect(TableTitle(TableNameSchema.enum.points)).toBe('Points Table');
        expect(TableTitle(TableNameSchema.enum.averages)).toBe('Averages Table');
        expect(TableTitle(TableNameSchema.enum.pub)).toBe('Pub Table');
    });
});

describe('QualifiedTableName', () => {
    it('combines "All-time" with the table title for year 0', () => {
        expect(QualifiedTableName(TableNameSchema.enum.points, 0)).toBe('All-time Points Table');
    });

    it('combines the year with the table title for non-zero years', () => {
        expect(QualifiedTableName(TableNameSchema.enum.points, 2025)).toBe('2025 Points Table');
        expect(QualifiedTableName(TableNameSchema.enum.speedy, 2024)).toBe('2024 Captain Speedy');
    });
});

describe('UnqualifiedTableName', () => {
    it('returns the min-games message for the averages table', () => {
        const result = UnqualifiedTableName(TableNameSchema.enum.averages);
        expect(result).toMatch(/^Played Fewer than \d+ Games$/);
    });

    it('returns the min-replies message for the speedy table', () => {
        const result = UnqualifiedTableName(TableNameSchema.enum.speedy);
        expect(result).toMatch(/^Responded Fewer than \d+ Times$/);
    });

    it('returns undefined for tables with no unqualified section', () => {
        expect(UnqualifiedTableName(TableNameSchema.enum.points)).toBeUndefined();
        expect(UnqualifiedTableName(TableNameSchema.enum.stalwart)).toBeUndefined();
        expect(UnqualifiedTableName(TableNameSchema.enum.pub)).toBeUndefined();
    });
});
