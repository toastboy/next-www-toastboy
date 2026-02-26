import { render, screen } from '@testing-library/react';

import { AdminUserData } from '@/components/AdminUserData/AdminUserData';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultAdminUserDataPayload } from '@/tests/mocks/data/adminUserData';

describe('AdminUserData', () => {
    it('renders the user name as the section title', () => {
        render(
            <Wrapper>
                <AdminUserData user={defaultAdminUserDataPayload} />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', { level: 2, name: defaultAdminUserDataPayload.name }),
        ).toBeInTheDocument();
    });

    it('renders serialized user JSON data', () => {
        render(
            <Wrapper>
                <AdminUserData user={defaultAdminUserDataPayload} />
            </Wrapper>,
        );

        expect(screen.getByText(new RegExp(defaultAdminUserDataPayload.email))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(defaultAdminUserDataPayload.createdAt))).toBeInTheDocument();
    });
});
