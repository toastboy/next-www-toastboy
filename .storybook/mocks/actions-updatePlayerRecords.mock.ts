// Mock for server action in Storybook browser environment
export async function updatePlayerRecords(): Promise<void> {
  // no-op in Storybook; MSW handlers cover progress polling
  return Promise.resolve();
}
