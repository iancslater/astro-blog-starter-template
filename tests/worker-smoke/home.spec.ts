import { test, expect, type ConsoleMessage } from "@playwright/test";

/**
 * Built-Worker homepage smoke test.
 *
 * Runs against the production build served through the generated Cloudflare
 * Worker (`wrangler dev`), not `astro dev`. This guards against a regression
 * where the Cloudflare adapter's default Workerd prerender environment
 * serialized every prerendered Astro page body as the literal text
 * "[object Object]" while the build itself still succeeded.
 */

const MALFORMED_TOKENS = ["[object Object]", "[object Promise]"];

test.describe("built worker homepage", () => {
	test("renders the real homepage, not a serialized object", async ({ page }) => {
		const consoleErrors: ConsoleMessage[] = [];
		const pageErrors: Error[] = [];

		page.on("console", (message) => {
			if (message.type() === "error") {
				consoleErrors.push(message);
			}
		});
		page.on("pageerror", (error) => {
			pageErrors.push(error);
		});

		const response = await page.goto("/");

		expect(response).not.toBeNull();
		expect(response?.status()).toBeLessThan(400);

		const header = page.locator("header");
		const footer = page.locator("footer");
		await expect(header).toBeVisible();
		await expect(footer).toBeVisible();

		const heading = page.locator("h1");
		await expect(heading).toBeVisible();
		await expect(heading).toHaveText("Transmission received…");

		const bodyText = (await page.locator("body").innerText()).trim();

		expect(bodyText).toContain("This is negative utopia.");
		expect(bodyText.length).toBeGreaterThan(200);

		for (const token of MALFORMED_TOKENS) {
			expect(bodyText).not.toContain(token);
		}

		expect(bodyText.toLowerCase()).not.toContain("stack trace");
		expect(bodyText).not.toMatch(/\bat\s+\S+\s+\(.+:\d+:\d+\)/);
		expect(bodyText.toLowerCase()).not.toMatch(/(internal server error|application error|something went wrong)/);

		expect(pageErrors, `Unexpected uncaught page errors: ${pageErrors.map((e) => e.message).join(", ")}`).toHaveLength(0);
		expect(
			consoleErrors,
			`Unexpected console errors: ${consoleErrors.map((m) => m.text()).join(", ")}`,
		).toHaveLength(0);
	});
});
