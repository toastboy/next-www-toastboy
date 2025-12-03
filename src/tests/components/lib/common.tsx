import { MantineProvider } from '@mantine/core';
import { ReactNode } from "react";

export const loaderClass = '.mantine-Loader-root';
export const errorText = 'failed to load';

interface WrapperProps {
    children?: ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return (
        <MantineProvider defaultColorScheme="light">
            {children}
        </MantineProvider>
    );
};
