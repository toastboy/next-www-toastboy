import axios from 'axios';
import { writeFile } from 'fs/promises';

// To run:
// npx tsc ./prisma/fetch.ts
// node ./prisma/fetch.js

async function fetchData(baseURL: string, table: string) {
    try {
        const url = `${baseURL}/${table}`;
        const response = await axios.get(url);
        const data = response.data;
        await writeFile(`/tmp/${table}.json`, JSON.stringify(data, null, 2));
        console.log(`${table} fetched and saved successfully`);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function main() {
    const baseURL = "http://localhost:3000/api/footy/";

    await fetchData(baseURL, "arses");
    await fetchData(baseURL, "club_supporters");
    await fetchData(baseURL, "clubs");
    await fetchData(baseURL, "nationalities");
    await fetchData(baseURL, "countries");
    await fetchData(baseURL, "game_chats");
    await fetchData(baseURL, "invitations");
    await fetchData(baseURL, "outcomes");
    await fetchData(baseURL, "standings");
    await fetchData(baseURL, "game_days");
    await fetchData(baseURL, "players");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
    });
