import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/actions/auth-export', () => ({
    authExport: vi.fn(),
}));

vi.mock('@/actions/getProgress', () => ({
    getProgress: vi.fn(),
}));

vi.mock('@/actions/updatePlayerRecords', () => ({
    updatePlayerRecords: vi.fn(),
}));

vi.mock('@/components/AdminDashboard/AdminDashboard', () => ({
    AdminDashboard: vi.fn(() => null),
}));

import { authExport } from '@/actions/auth-export';
import { getProgress } from '@/actions/getProgress';
import { updatePlayerRecords } from '@/actions/updatePlayerRecords';
import AdminPage from '@/app/footy/admin/page';
import { AdminDashboard } from '@/components/AdminDashboard/AdminDashboard';

describe('Admin Dashboard page', () => {
    it('renders the AdminDashboard component', () => {
        renderToStaticMarkup(AdminPage());

        expect(AdminDashboard).toHaveBeenCalledTimes(1);
    });

    it('passes the updatePlayerRecords and getProgress server actions to AdminDashboard', () => {
        renderToStaticMarkup(AdminPage());

        const [props] = (AdminDashboard as Mock).mock.calls[0] as [
            { onUpdatePlayerRecords: unknown; getProgress: unknown },
        ];
        expect(props.onUpdatePlayerRecords).toBe(updatePlayerRecords);
        expect(props.getProgress).toBe(getProgress);
    });

    it('passes the authExport server action to AdminDashboard', () => {
        renderToStaticMarkup(AdminPage());

        const [props] = (AdminDashboard as Mock).mock.calls[0] as [
            { onExportAuth: unknown },
        ];
        expect(props.onExportAuth).toBe(authExport);
    });
});
