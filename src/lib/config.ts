import { ConfigSchema, ConfigType } from '@/types/config';

const rawConfig: ConfigType = {
    minGamesForAveragesTable: 10,
    minRepliesForSpeedyTable: 10,
    contactEmailDestination: 'footy@toastboy.co.uk',
    sessionRevalidate: 60000, // 1 minute
};

// App-wide configuration object which is runtime-validated using zod. If this
// throws it will surface early during server start / build so misconfiguration
// is caught quickly.

const config = ConfigSchema.parse(rawConfig);
export default config;
