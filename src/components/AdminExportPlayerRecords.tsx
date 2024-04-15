import { Button } from '@mantine/core';
import fs from 'fs';
import path from "path";
import playerRecordService from 'services/PlayerRecord';

async function exportPlayerRecords() {
    'use server';

    const data = await playerRecordService.getAll();
    const json = JSON.stringify(data?.filter((record) => record.gameDayId >= 1072), null, 2);
    const filePath = path.join('/tmp', 'PlayerRecords.json');
    fs.writeFileSync(filePath, json);
}

export async function AdminExportPlayerRecords() {
    return (
        <div>
            <form action={exportPlayerRecords}>
                <Button type="submit">Export Player Records (2021 onwards)</Button>
            </form>
        </div >
    );
}
