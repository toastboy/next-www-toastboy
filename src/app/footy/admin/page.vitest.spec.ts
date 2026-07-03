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

vi.mock('@mantine/core', () => ({
    Center: ({ children }: { children?: unknown }) => children,
    Container: ({ children }: { children?: unknown }) => children,
    Stack: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/AdminExportAuth/AdminExportAuth', () => ({
    AdminExportAuth: function AdminExportAuth() { return null; },
}));

vi.mock('@/components/AdminUpdatePlayerRecords/AdminUpdatePlayerRecords', () => ({
    AdminUpdatePlayerRecords: function AdminUpdatePlayerRecords() { return null; },
}));

import { authExport } from '@/actions/auth-export';
import { getProgress } from '@/actions/getProgress';
import { updatePlayerRecords } from '@/actions/updatePlayerRecords';
import AdminPage from '@/app/footy/admin/page';
import { findElement } from '@/tests/shared/reactTree';

describe('Admin Dashboard page', () => {
    it('renders the admin dashboard with UpdatePlayerRecords and ExportAuth components', () => {
        const result = AdminPage();

        expect(findElement(result, 'AdminUpdatePlayerRecords')).not.toBeNull();
        expect(findElement(result, 'AdminExportAuth')).not.toBeNull();
    });

    it('passes the updatePlayerRecords and getProgress server actions to AdminUpdatePlayerRecords', () => {
        const result = AdminPage();

        const updatePlayerRecordsEl = findElement(result, 'AdminUpdatePlayerRecords');
        expect(updatePlayerRecordsEl?.props.onUpdatePlayerRecords).toBe(updatePlayerRecords);
        expect(updatePlayerRecordsEl?.props.getProgress).toBe(getProgress);
    });

    it('passes the authExport server action to AdminExportAuth', () => {
        const result = AdminPage();

        const exportAuthEl = findElement(result, 'AdminExportAuth');
        expect(exportAuthEl?.props.onExportAuth).toBe(authExport);
    });
});
