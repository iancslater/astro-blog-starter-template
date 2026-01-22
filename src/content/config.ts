import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

/**
 * Propaganda collection
 *
 * Markdown / MDX files placed in src/content/propaganda must follow this schema.
 * Required fields:
 *  - title: string
 *  - type: either "poster" or "sticker"
 *  - downloadFile: string  (path to a PDF or PNG located in /public, e.g. "/downloads/my-poster.pdf")
 *
 * Optional fields:
 *  - printSize: string
 *  - orientation: "portrait" | "landscape"
 *  - year: string
 *  - tags: string[]
 *  - previewImage: string (path to preview image in /public)
 */
const propaganda = defineCollection({
	// Load Markdown and MDX files in the `src/content/propaganda/` directory.
	loader: glob({ base: "./src/content/propaganda", pattern: "**/*.{md,mdx}" }),
	type: "content",
	schema: z.object({
		title: z.string(),
		type: z.enum(["poster", "sticker"]),
		printSize: z.string().optional(),
		orientation: z.enum(["portrait", "landscape"]).optional(),
		year: z.string().optional(),
		tags: z.array(z.string()).optional(),
		// Path to a file in /public (PDF or PNG). Example: "/downloads/propaganda-1939.pdf"
		downloadFile: z.string(),
		// Optional preview image path in /public. Example: "/images/propaganda-1939-preview.png"
		previewImage: z.string().optional(),
	}),
});

export const collections = { blog, propaganda };