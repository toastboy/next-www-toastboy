import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

type LinkQueue = Record<string, boolean>;

const fetchPageLinks = async (url: string): Promise<string[]> => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const links: string[] = [];
        $('a').each((_, element) => {
            const link = $(element).attr('href');
            if (link) {
                links.push(new URL(link, url).href);
            }
        });
        return links;
    } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        return [];
    }
};

const crawlSite = async (startUrl: string, domain: string) => {
    const toVisit: LinkQueue = { [startUrl]: true };
    const visited: LinkQueue = {};

    while (Object.keys(toVisit).length > 0) {
        const [currentUrl] = Object.entries(toVisit).find(() => true) ?? [''];
        delete toVisit[currentUrl];
        if (!currentUrl || visited[currentUrl] || !currentUrl.startsWith(domain)) continue;

        console.log(`Visiting: ${currentUrl}`);
        visited[currentUrl] = true;
        const links = await fetchPageLinks(currentUrl);

        links.forEach(link => {
            if (!visited[link] && link.startsWith(domain) && !link.includes('#') && !/\d$/.test(link)) {
                toVisit[link] = true;
            }
        });
    }

    return Object.keys(visited);
};

const main = async () => {
    const domain = 'http://localhost:3880/footy/';
    const startUrl = domain; // Typically the homepage
    const visitedLinks = await crawlSite(startUrl, domain);
    const json = JSON.stringify(visitedLinks, null, 2);
    fs.writeFileSync('./livesitelinks.json', json);
};

main().catch(console.error);
