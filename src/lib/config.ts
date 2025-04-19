/**
 * Configuration interface for application settings.
 *
 * @property minGamesForAveragesTable - The minimum number of games required for a player to qualify for the averages table.
 * @property minRepliesForSpeedyTable - The minimum number of replies required for a player to qualify for the speedy table.
 * @property sessionRevalidate - The duration (in milliseconds) after which a session should be revalidated.
 */
interface Config {
    minGamesForAveragesTable: number,
    minRepliesForSpeedyTable: number,

    sessionRevalidate: number,
}

const config: Config = {
    minGamesForAveragesTable: 10,
    minRepliesForSpeedyTable: 10,

    sessionRevalidate: 60000, // 1 minute
};

export default config;
