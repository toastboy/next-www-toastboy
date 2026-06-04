import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AutoRefresh } from '@/components/AutoRefresh/AutoRefresh';
import { FootyChannel } from '@/types/FootyChannel';

vi.mock('@/hooks/useAutoRefresh');
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

describe('AutoRefresh', () => {
    it('renders nothing', () => {
        const { container } = render(<AutoRefresh channels={FootyChannel.Games} />);
        expect(container.firstChild).toBeNull();
    });

    it('calls useAutoRefresh with a single channel', () => {
        render(<AutoRefresh channels={FootyChannel.Games} />);
        expect(useAutoRefresh).toHaveBeenCalledWith(FootyChannel.Games);
    });

    it('calls useAutoRefresh with multiple channels', () => {
        render(<AutoRefresh channels={[FootyChannel.Games, FootyChannel.Players]} />);
        expect(useAutoRefresh).toHaveBeenCalledWith([FootyChannel.Games, FootyChannel.Players]);
    });
});
