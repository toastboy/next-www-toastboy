export {};

declare module '@mantine/core' {
    export interface MantineThemeOther {
        /** Maximum width of the app shell's main content column, in pixels. */
        appShellMaxWidth: number;
        /** Minimum width of the app shell's main content column, in pixels. */
        appShellMinWidth: number;
    }
}
