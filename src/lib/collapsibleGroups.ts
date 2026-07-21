export interface GroupDisplay {
    visible: boolean;
}

/**
 * Marks which rows in a pre-grouped list start a new group ("visible") versus
 * continue the previous row's group. `groupKey` should return a value unique
 * to rows that must never be treated as grouped together (e.g. missing data).
 */
export const groupDisplays = <T>(rows: T[], groupKey: (row: T) => unknown): GroupDisplay[] => {
    const displays: GroupDisplay[] = [];
    let prevKey: unknown;

    rows.forEach((row, index) => {
        const key = groupKey(row);
        displays.push({ visible: index === 0 || key !== prevKey });
        prevKey = key;
    });

    return displays;
};

// Extends the initial page of rows forward past any group straddling the
// cutoff, so a group of related rows is never split across a "show more" toggle.
export const visibleRowCount = (groups: GroupDisplay[], initial: number): number => {
    let count = Math.min(Math.max(0, initial), groups.length);

    while (count < groups.length && !groups[count].visible) {
        count++;
    }

    return count;
};
