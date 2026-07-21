import { groupDisplays, visibleRowCount } from '@/lib/collapsibleGroups';

describe('groupDisplays', () => {
    it('marks the first row of each run of equal keys as visible, and the rest as continuations', () => {
        const rows = [1, 2, 2, 4];
        expect(groupDisplays(rows, (row) => row)).toEqual([
            { visible: true },
            { visible: true },
            { visible: false },
            { visible: true },
        ]);
    });

    it('treats a three-way run as one group', () => {
        const rows = [1, 1, 1];
        expect(groupDisplays(rows, (row) => row)).toEqual([
            { visible: true },
            { visible: false },
            { visible: false },
        ]);
    });

    it('always marks the first row visible even with an empty list of rows before it', () => {
        expect(groupDisplays([1], (row) => row)).toEqual([{ visible: true }]);
    });

    it('never groups rows whose key is unique per call, e.g. missing data', () => {
        const rows = [undefined, null, 1];
        expect(groupDisplays(rows, () => Symbol())).toEqual([
            { visible: true },
            { visible: true },
            { visible: true },
        ]);
    });
});

describe('visibleRowCount', () => {
    const visible = { visible: true };
    const hidden = { visible: false };

    it('returns the initial count when it lands on a group boundary', () => {
        expect(visibleRowCount([visible, visible, visible, visible], 2)).toBe(2);
    });

    it('extends past a group that straddles the cutoff', () => {
        expect(visibleRowCount([visible, visible, hidden, visible], 2)).toBe(3);
    });

    it('extends to the end if the trailing group runs off the end of the list', () => {
        expect(visibleRowCount([visible, visible, hidden, hidden], 2)).toBe(4);
    });

    it('never returns more rows than exist', () => {
        expect(visibleRowCount([visible, visible], 5)).toBe(2);
    });

    it('clamps a negative initial count to zero instead of returning a negative count', () => {
        expect(visibleRowCount([visible, visible], -1)).toBe(0);
    });
});
