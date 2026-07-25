import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

/**
 * Built-Worker Playwright configuration.
 *
 * Serves the production build through the generated Cloudflare Worker
 * (`wrangler dev` against `dist/client/wrangler.json`) and runs a browser
 * smoke test against it. This is deliberately separate from an `astro dev`
 * based check so that the actual built/deployed output is exercised — the
 * `[object Object]` regression this guards against only reproduced through
 * the built Worker, not through `astro dev`.
 *
 * A fresh production build is expected to have run before this config
 * starts (see the `test:worker` script in package.json).
 *
 * Run with: npm run test:worker
 */

const SYSTEM_CHROMIUM_PATHS = [
	"/usr/bin/chromium-browser",
	"/usr/bin/chromium",
	"/usr/bin/google-chrome",
];

const executablePath = SYSTEM_CHROMIUM_PATHS.find(existsSync);

const PORT = 8791;

export default defineConfig({
	testDir: "./tests/worker-smoke",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: 1,
	timeout: 30_000,
	reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/worker" }]],

	use: {
		...devices["Desktop Chrome"],
		baseURL: `http://127.0.0.1:${PORT}`,
		launchOptions: {
			...(executablePath ? { executablePath } : {}),
			args: ["--no-sandbox", "--disable-dev-shm-usage"],
		},
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},

	webServer: {
		command: `npx wrangler dev --config dist/client/wrangler.json --port ${PORT} --ip 127.0.0.1`,
		url: `http://127.0.0.1:${PORT}/`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},

	projects: [
		{
			name: "chromium",
		},
	],
});
