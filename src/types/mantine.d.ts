import type { CSSProperties } from 'react';

export { };

declare module '@mantine/core' {
    export interface MantineThemeOther {
        /** Minimum width of a player name column, so the name fits on one line. */
        playerNameMinWidthSingleLine: NonNullable<CSSProperties['minWidth']>;
        /** Minimum width of a player name column, so the name fits on multiple lines. */
        playerNameMinWidthMultiLine: NonNullable<CSSProperties['minWidth']>;
    }
}
