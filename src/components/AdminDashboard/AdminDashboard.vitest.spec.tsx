import { render, screen } from '@testing-library/react';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('@/components/AdminExportAuth/AdminExportAuth', () => ({
    AdminExportAuth: vi.fn(() => null),
}));

vi.mock(
    '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords',
    () => ({
        AdminUpdatePlayerRecords: vi.fn(() => null),
    }),
);

import { AdminDashboard } from '@/components/AdminDashboard/AdminDashboard';
import { AdminExportAuth } from '@/components/AdminExportAuth/AdminExportAuth';
import { AdminUpdatePlayerRecords } from '@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords';
import { Wrapper } from '@/tests/components/lib/common';

describe('AdminDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the heading and both admin widgets', () => {
        render(
            <Wrapper>
                <AdminDashboard
                    onUpdatePlayerRecords={vi.fn()}
                    getProgress={vi.fn()}
                    onExportAuth={vi.fn()}
                />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', { name: 'Admin Dashboard' }),
        ).toBeInTheDocument();
        expect(AdminUpdatePlayerRecords).toHaveBeenCalledTimes(1);
        expect(AdminExportAuth).toHaveBeenCalledTimes(1);
    });

    it('passes the server actions through to the widgets', () => {
        const onUpdatePlayerRecords = vi.fn();
        const getProgress = vi.fn();
        const onExportAuth = vi.fn();

        render(
            <Wrapper>
                <AdminDashboard
                    onUpdatePlayerRecords={onUpdatePlayerRecords}
                    getProgress={getProgress}
                    onExportAuth={onExportAuth}
                />
            </Wrapper>,
        );

        const [updateProps] = (AdminUpdatePlayerRecords as Mock).mock
            .calls[0] as [
            { onUpdatePlayerRecords: unknown; getProgress: unknown },
        ];
        expect(updateProps.onUpdatePlayerRecords).toBe(onUpdatePlayerRecords);
        expect(updateProps.getProgress).toBe(getProgress);

        const [exportProps] = (AdminExportAuth as Mock).mock.calls[0] as [
            { onExportAuth: unknown },
        ];
        expect(exportProps.onExportAuth).toBe(onExportAuth);
    });
});
