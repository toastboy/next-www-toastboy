// @type {import('next').NextConfig}
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/api/**',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/footy/drinkers',
                destination: '/footy/admin/drinkers',
                permanent: true,
            },
            {
                source: '/footy/money',
                destination: '/footy/admin/money',
                permanent: true,
            },
            {
                source: '/footy/moregames',
                destination: '/footy/admin/moregames',
                permanent: true,
            },
            {
                source: '/footy/newgame',
                destination: '/footy/admin/newgame',
                permanent: true,
            },
            {
                source: '/footy/newplayer',
                destination: '/footy/admin/newplayer',
                permanent: true,
            },
            {
                source: '/footy/picker',
                destination: '/footy/admin/picker',
                permanent: true,
            },
            {
                source: '/footy/responses',
                destination: '/footy/admin/responses',
                permanent: true,
            },
            {
                source: '/footy/averages',
                destination: '/footy/table/averages',
                permanent: true,
            },
            {
                source: '/footy/averages/:year',
                destination: '/footy/table/points/:year',
                permanent: true,
            },
            {
                source: '/footy/mailout',
                destination: '/footy/players',
                permanent: true,
            },
            {
                source: '/footy/nextgame',
                destination: '/footy/game',
                permanent: true,
            },
            {
                source: '/footy/points',
                destination: '/footy/table/points',
                permanent: true,
            },
            {
                source: '/footy/points/:year',
                destination: '/footy/table/points/:year',
                permanent: true,
            },
            {
                source: '/footy/pub',
                destination: '/footy/table/pub',
                permanent: true,
            },
            {
                source: '/footy/pub/:year',
                destination: '/footy/table/pub/:year',
                permanent: true,
            },
            {
                source: '/footy/speedy',
                destination: '/footy/table/speedy',
                permanent: true,
            },
            {
                source: '/footy/speedy/:year',
                destination: '/footy/table/pub/:year',
                permanent: true,
            },
            {
                source: '/footy/stalwart',
                destination: '/footy/table/stalwart',
                permanent: true,
            },
            {
                source: '/footy/stalwart/:year',
                destination: '/footy/table/pub/:year',
                permanent: true,
            },
        ];
    },
};

// Injected content via Sentry wizard below

import { withSentryConfig } from "@sentry/nextjs";

const sentryConfig = {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "toastboycouk",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    webpack: {
        // Automatically annotate React components to show their full name in breadcrumbs and session replay
        reactComponentAnnotation: {
            enabled: true,
        },
        // Automatically tree-shake Sentry logger statements to reduce bundle size
        treeshake: {
            removeDebugLogging: true,
        },
        // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
        // See the following for more information:
        // https://docs.sentry.io/product/crons/
        // https://vercel.com/docs/cron-jobs
        automaticVercelMonitors: true,
    },

    // This option and beyond added after running the wizard
    sourcemaps: {
        deleteSourcemapsAfterUpload: true,
    },
};

export default withSentryConfig(nextConfig, sentryConfig);
