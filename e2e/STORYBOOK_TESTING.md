# Storybook Visual Testing with Playwright

This project uses Playwright for comprehensive story-level testing of all Storybook components.

## Features

### 1. Story Discovery

- Automatically fetches all stories from Storybook's `index.json`
- Filters out documentation pages to test only actual component stories
- Reports total number of stories found

### 2. Smoke Testing

- Navigates to each story individually via iframe URL
- Verifies that each story renders without errors
- Checks for page errors and console errors
- Reports any failed stories with detailed error messages

### 3. Visual Regression Testing

- Captures screenshots of every story
- Compares against baseline images stored in `e2e/storybook.spec.ts-snapshots/`
- Detects visual changes across code changes
- Allows small pixel differences for anti-aliasing variations

## Usage

### Running Tests

```bash
# Run all Storybook tests (smoke + visual regression)
npm run test:storybook

# Update visual snapshots (creates new baseline images)
npm run test:storybook:update-snapshots
```

### First Time Setup

1. **Create baseline screenshots:**

   ```bash
   npm run test:storybook:update-snapshots
   ```

   This will generate baseline images for all stories in `e2e/storybook.spec.ts-snapshots/`

2. **Commit the snapshots:**

   ```bash
   git add e2e/storybook.spec.ts-snapshots/
   git commit -m "Add Storybook visual regression baselines"
   ```

### When to Update Snapshots

Update snapshots when:

- ✅ You intentionally changed a component's appearance
- ✅ You added new stories
- ✅ You updated design tokens/theme
- ❌ NOT when tests randomly fail (investigate the cause first)

### Test Output

The test provides detailed console output:

```
Found 42 stories to test
✓ All 42 stories rendered successfully
✓ Visual regression test completed for 42 stories
```

If failures occur:

```
❌ Failed stories:
  - Player/PlayerProfile: Empty render
  - Admin/AdminPanel: Timeout waiting for selector
```

## How It Works

### Story Discovery

```typescript
// Fetches Storybook's index.json
const response = await request.get('http://127.0.0.1:6006/index.json');
const stories = Object.values(index.entries);
```

### Direct Story Navigation

```typescript
// Navigates directly to story iframe for faster testing
await page.goto(
  `http://127.0.0.1:6006/iframe.html?id=${story.id}&viewMode=story`
);
```

### Visual Comparison

```typescript
// Takes screenshot and compares with baseline
await expect(page).toHaveScreenshot(`story-name.png`, {
  maxDiffPixels: 100  // Tolerate small differences
});
```

## CI Integration

The GitHub Actions workflow at `.github/workflows/storybook.yml`:

1. Builds Storybook as static site
2. Serves it via `http-server`
3. Runs Playwright tests
4. Uploads test reports and screenshots as artifacts

## Snapshot Management

### Snapshot Location

- Chromium: `e2e/storybook.spec.ts-snapshots/chromium/`
- Firefox: `e2e/storybook.spec.ts-snapshots/firefox/`
- Webkit: `e2e/storybook.spec.ts-snapshots/webkit/`

### Snapshot Naming

Snapshots are automatically named based on story hierarchy:

- Story: `Player/PlayerProfile` → `player-playerprofile--primary.png`
- Story: `Admin/UpdateRecords` → `admin-updaterecords--inprogress.png`

### Reviewing Failures

When visual tests fail:

1. Check the HTML report: `npx playwright show-report`
2. Review the diff images showing actual vs expected
3. Decide: bug or intentional change?
4. If intentional, update snapshots with `npm run test:storybook:update-snapshots`

## Configuration

### Playwright Config

Located in `playwright.config.ts`:

- Browsers tested: Chromium, Firefox, Webkit
- Timeout: 15 seconds per story
- Screenshot settings: `maxDiffPixels: 100`

### Customization

Edit `e2e/storybook.spec.ts` to:

- Adjust wait times: `await page.waitForTimeout(500)`
- Change pixel tolerance: `maxDiffPixels: 100`
- Add custom assertions for specific stories
- Filter which stories to test

Example - test only specific stories:

```typescript
stories = stories.filter(s => s.title.startsWith('Player/'));
```

## Troubleshooting

### "Story not found" errors

- Ensure Storybook is built: `npm run build:storybook`
- Check `storybook-static/` exists

### "Timeout" errors

- Increase timeout: `{ timeout: 30000 }`
- Check if story has slow async operations

### Flaky visual tests

- Increase `maxDiffPixels` if legitimate rendering variance
- Add longer wait for animations: `await page.waitForTimeout(1000)`
- Disable animations in test: Add CSS to disable transitions

### Port conflicts

- Ensure port 6006 is free
- Or change port in scripts and test file

## Best Practices

1. **Keep snapshots up to date** - Don't let them drift from reality
2. **Review diffs carefully** - Visual changes might indicate bugs
3. **Test in all browsers** - Different rendering engines may behave differently
4. **Add smoke tests** - Use the render test to catch JS errors early
5. **Commit snapshots** - They're part of your test suite

## Future Enhancements

Potential improvements:

- [ ] Accessibility testing with `@axe-core/playwright`
- [ ] Interaction testing (click buttons, fill forms)
- [ ] Mobile viewport testing
- [ ] Performance metrics (First Contentful Paint, etc.)
- [ ] Cross-browser screenshot comparison
- [ ] Story-specific test annotations
