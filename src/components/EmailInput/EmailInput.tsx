'use client';

import { TextInput, type TextInputProps } from '@mantine/core';

export type Props = Omit<TextInputProps, 'type'>;

export const EmailInput: React.FC<Props> = (props) => {
    return (
        <TextInput
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...props}
        />
    );
};
