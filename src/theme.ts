import { createTheme, type MantineThemeOther } from '@mantine/core';

export const theme = createTheme({
    // `satisfies` (rather than a type annotation) forces every key declared on
    // MantineThemeOther to be present here, so a missing/mistyped token fails
    // to compile instead of silently becoming `undefined` at runtime.
    other: {
        playerNameMinWidthSingleLine: '18em',
        playerNameMinWidthMultiLine: '9em',
    } satisfies MantineThemeOther,
    components: {
        Paper: {
            defaultProps: {
                p: 'xl',
                shadow: 'xl',
                withBorder: true,
            },
        },
    },
});
