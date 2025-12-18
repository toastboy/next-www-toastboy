// Browser-safe Prisma mock for Storybook
// Ensures any accidental imports won't pull Node-only runtime
const prisma: unknown = {};
export default prisma as any;
