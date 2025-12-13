import type { Meta, StoryObj } from '@storybook/nextjs';

import { YearTable } from '@/components/YearTable/YearTable';
import { defaultPlayerRecordDataList } from '@/tests/mocks/data/playerRecordData';

const meta: Meta<typeof YearTable> = {
    title: 'Tables/YearTable',
    component: YearTable as Meta<typeof YearTable>['component'],
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        table: 'averages',
        year: 2025,
        qualified: defaultPlayerRecordDataList,
        unqualified: defaultPlayerRecordDataList,
    },
};
