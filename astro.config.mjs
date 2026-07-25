// @ts-check
import { defineConfig, sessionDrivers } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap()],
	adapter: cloudflare({
		// Prerender static pages with Astro's Node environment instead of workerd.
		// The default Workerd prerenderer emits "[object Object]" for prerendered
		// Astro page bodies with the current Astro 7 / Cloudflare adapter stack.
		prerenderEnvironment: "node",
	}),
	// Disable the SESSION KV binding that @astrojs/cloudflare auto-injects.
	// Without this, wrangler tries to provision the KV namespace on every deploy
	// and fails with error 10014 ("already exists") after the first deployment.
	// This template does not use sessions, so the null driver is appropriate.
	session: {
		driver: sessionDrivers.null(),
	},
});
