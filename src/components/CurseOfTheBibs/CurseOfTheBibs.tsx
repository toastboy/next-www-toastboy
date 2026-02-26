'use client';

import { PieChart, PieChartDatum } from '@/components/PieChart/PieChart';
import { WDLType } from '@/types/WDLType';

export interface Props {
    bibsData: WDLType;
}

export const CurseOfTheBibs = ({ bibsData }: Props) => {
    const pieData: PieChartDatum[] = Object.keys(bibsData).map((key) => ({
        label: key,
        value: bibsData[key as keyof typeof bibsData],
    }));

    return (
        <PieChart data={pieData} />
    );
};
