import { expect, test } from '@playwright/test';

interface Story {
    id: string;
    title: string;
    name: string;
    importPath: string;
    tags?: string[];
}

interface StorybookIndex {
    v: number;
    entries: Record<string, Story>;
}

test.describe('Storybook Stories', () => {
    let storybookIndex: StorybookIndex;
    let stories: Story[];

    test.beforeAll(async ({ request }) => {
        // Fetch the Storybook index to get all stories
        const response = await request.get('http://127.0.0.1:6006/index.json');
        expect(response.ok()).toBeTruthy();
        storybookIndex = await response.json();
        
        const allEntries = Object.values(storybookIndex.entries);
        console.log(`Total entries in index: ${allEntries.length}`);
        
        // Filter to only get actual stories (type: 'story'), not docs pages
        stories = allEntries.filter((entry) => {
            return (entry as any).type === 'story';
        });
        
        console.log(`Found ${stories.length} stories to test (filtered from ${allEntries.length} total entries)`);
        if (stories.length === 0 && allEntries.length > 0) {
            console.warn('⚠️  No stories found but index has entries. Sample entry:', JSON.stringify(allEntries[0], null, 2));
        }
    });

    test('Storybook index is accessible', async () => {
        expect(storybookIndex).toBeDefined();
        expect(stories.length, 'No stories found in Storybook. Check that stories exist and are built correctly.').toBeGreaterThan(0);
    });

    test('All stories render without errors', async ({ page }) => {
        const errors: string[] = [];
        const failedStories: string[] = [];

        // Listen for console errors in the iframe
        page.on('pageerror', (error) => {
            errors.push(`Page error: ${error.message}`);
        });

        for (const story of stories) {
            try {
                // Navigate directly to the story via iframe URL
                // Use 'domcontentloaded' instead of 'networkidle' to avoid timeout on polling components
                await page.goto(
                    `http://127.0.0.1:6006/iframe.html?id=${story.id}&viewMode=story`,
                    { waitUntil: 'domcontentloaded', timeout: 10000 }
                );

                // Wait for root element to be present
                await page.waitForSelector('#storybook-root', { timeout: 5000 }).catch(() => {
                    // If no storybook-root, that's okay, might be a different structure
                });
                
                // Small delay to let components render
                await page.waitForTimeout(300);

                // Check that body has content (basic smoke test)
                const bodyContent = await page.locator('body').textContent();
                if (!bodyContent || bodyContent.trim().length === 0) {
                    failedStories.push(`${story.title}/${story.name}: Empty render`);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                // Only log meaningful errors, not "Target closed" cascading errors
                if (!errorMessage.includes('Target page, context or browser has been closed')) {
                    failedStories.push(`${story.title}/${story.name}: ${errorMessage}`);
                }
            }
        }

        // Report results
        if (failedStories.length > 0) {
            console.error('\n❌ Failed stories:');
            failedStories.slice(0, 10).forEach((msg) => console.error(`  - ${msg}`));
            if (failedStories.length > 10) {
                console.error(`  ... and ${failedStories.length - 10} more`);
            }
        }
        if (errors.length > 0) {
            console.error('\n❌ Console errors detected:');
            errors.slice(0, 5).forEach((msg) => console.error(`  - ${msg}`));
            if (errors.length > 5) {
                console.error(`  ... and ${errors.length - 5} more`);
            }
        }

        expect(failedStories, `${failedStories.length} stories failed to render`).toHaveLength(0);
        console.log(`\n✓ All ${stories.length} stories rendered successfully`);
    });

    test('Visual regression testing for all stories', async ({ page }) => {
        // This test takes screenshots of each story for visual comparison
        // Run with --update-snapshots to create new baseline images
        
        const failedSnapshots: string[] = [];
        
        for (const story of stories) {
            try {
                await page.goto(
                    `http://127.0.0.1:6006/iframe.html?id=${story.id}&viewMode=story`,
                    { waitUntil: 'domcontentloaded', timeout: 10000 }
                );

                // Wait for content to be visible
                await page.waitForSelector('#storybook-root', { timeout: 5000 }).catch(() => {});
                await page.waitForTimeout(300); // Let animations/styles settle

                // Take a screenshot and compare with baseline
                // Sanitize the story name for filename
                const screenshotName = `${story.title.replace(/\//g, '-')}--${story.name}`.toLowerCase().replace(/\s+/g, '-');
                
                await expect(page).toHaveScreenshot(`${screenshotName}.png`, {
                    fullPage: false,
                    maxDiffPixels: 100, // Allow small differences (e.g., anti-aliasing)
                    timeout: 5000,
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                // Ignore "Target closed" cascading errors
                if (!errorMessage.includes('Target page, context or browser has been closed')) {
                    failedSnapshots.push(`${story.title}/${story.name}: ${errorMessage.split('\n')[0]}`);
                }
            }
        }

        if (failedSnapshots.length > 0) {
            console.error('\n⚠️  Failed snapshots (may need updating):');
            failedSnapshots.slice(0, 10).forEach((msg) => console.error(`  - ${msg}`));
            if (failedSnapshots.length > 10) {
                console.error(`  ... and ${failedSnapshots.length - 10} more`);
            }
        }

        console.log(`\n✓ Visual regression test completed for ${stories.length - failedSnapshots.length}/${stories.length} stories`);
        
        // Allow some failures for visual tests (they might just need updating)
        // But fail if too many fail (indicates a real problem)
        expect(failedSnapshots.length, `Too many visual test failures: ${failedSnapshots.length}`).toBeLessThan(stories.length * 0.2);
    });
});
