import type { ImageMetadata } from 'astro';

// Eagerly import every portfolio image once, so astro:assets only ever sees a
// single import per file (avoids https://github.com/withastro/astro/issues/11887,
// where reading image() properties through a content collection schema causes
// the raw, unoptimized original to also be copied into the build output).
const modules = import.meta.glob<{ default: ImageMetadata }>('./portfolio/*', {
	eager: true,
});

const portfolioImages: Record<string, ImageMetadata> = {};
for (const path in modules) {
	const filename = path.split('/').pop()!;
	portfolioImages[filename] = modules[path].default;
}

export function getPortfolioImage(filename: string): ImageMetadata {
	const image = portfolioImages[filename];
	if (!image) throw new Error(`Unknown portfolio image: ${filename}`);
	return image;
}
