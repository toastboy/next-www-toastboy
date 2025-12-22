import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { EmailInput } from '@/components/EmailInput/EmailInput';
import { Wrapper } from '@/tests/components/lib/common';

describe('EmailInput', () => {
    it('renders with default props', () => {
        render(
            <Wrapper>
                <EmailInput />
            </Wrapper>,
        );

        const input = screen.getByPlaceholderText('you@example.com');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'email');
        expect(input).toHaveAttribute('inputmode', 'email');
        expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('renders with custom label', () => {
        render(
            <Wrapper>
                <EmailInput label="Email Address" />
            </Wrapper>,
        );

        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
        render(
            <Wrapper>
                <EmailInput placeholder="Enter your email" />
            </Wrapper>,
        );

        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('accepts user input', async () => {
        const user = userEvent.setup();
        render(
            <Wrapper>
                <EmailInput />
            </Wrapper>,
        );

        const input = screen.getByPlaceholderText('you@example.com');
        await user.type(input, 'test@example.com');

        expect(input).toHaveValue('test@example.com');
    });

    it('renders with error state', () => {
        render(
            <Wrapper>
                <EmailInput error="Invalid email address" />
            </Wrapper>,
        );

        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    it('renders with required attribute', () => {
        render(
            <Wrapper>
                <EmailInput required label="Email" />
            </Wrapper>,
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeRequired();
    });

    it('renders with disabled state', () => {
        render(
            <Wrapper>
                <EmailInput disabled />
            </Wrapper>,
        );

        const input = screen.getByPlaceholderText('you@example.com');
        expect(input).toBeDisabled();
    });

    it('forwards additional TextInput props', () => {
        render(
            <Wrapper>
                <EmailInput
                    label="Email"
                    description="Enter your email address"
                    withAsterisk
                />
            </Wrapper>,
        );

        expect(screen.getByText('Enter your email address')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('calls onChange handler when value changes', async () => {
        const user = userEvent.setup();
        const handleChange = jest.fn();
        render(
            <Wrapper>
                <EmailInput onChange={handleChange} />
            </Wrapper>,
        );

        const input = screen.getByPlaceholderText('you@example.com');
        await user.type(input, 'test@example.com');

        expect(handleChange).toHaveBeenCalled();
    });

    it('applies custom className', () => {
        const { container } = render(
            <Wrapper>
                <EmailInput className="custom-class" />
            </Wrapper>,
        );

        const inputWrapper = container.querySelector('.custom-class');
        expect(inputWrapper).toBeInTheDocument();
    });
});
