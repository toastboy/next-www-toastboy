import { ConfigSchema, ConfigType } from '@/types/config';

const rawConfig: ConfigType = {
    minGamesForAveragesTable: 10,
    minRepliesForSpeedyTable: 10,
    contactEmailDestination: 'footy@toastboy.co.uk',
    sessionRevalidate: 60000,
    notificationAutoClose: 4000,
    notificationIconSize: 18,
    organiserPhoneNumber: '07802 346128',
};

// App-wide configuration object which is runtime-validated using zod. If this
// throws it will surface early during server start / build so misconfiguration
// is caught quickly.

export const config = ConfigSchema.parse(rawConfig);
