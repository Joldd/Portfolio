import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

export const collections = {
	work: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
		// `img` holds filenames (not the `image()` helper): resolving through the
		// schema's image() forces Astro to read width/height at validation time,
		// which triggers a known Astro bug where the raw, unoptimized original
		// also gets copied into the build output alongside the optimized version
		// (see https://github.com/withastro/astro/issues/11887). Filenames are
		// instead resolved to optimized images via src/assets/portfolioImages.ts,
		// which only imports each file once, for `<Image>` to use.
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.union([z.string(), z.array(z.string())]),
			img_alt: z.string().optional(),
			github: z.string().optional(),
			itch: z.string().optional(),
			link: z.string().optional(),
		}),
	}),
};
