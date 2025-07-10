import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export type UpdateFrontmatter = {
	title: string;
	started_date: string; // Format: DD/MM/YYYY
	status: "done" | "current" | "default" | "error";
	side?: "left" | "right";
};

export type MDXUpdate = {
	code: string;
	frontmatter: UpdateFrontmatter;
	slug: string;
};

const UPDATES_PATH = path.join(process.cwd(), "content/updates");

function parseTimelineDate(dateStr: string): Date {
	if (!dateStr) {
		return new Date(0);
	}

	const [day, month, year] = dateStr.split("/").map(Number);

	return new Date(year, month - 1, day);
}

export async function getUpdateBySlug(slug: string): Promise<MDXUpdate> {
	const filePath = path.join(UPDATES_PATH, `${slug}.mdx`);
	const source = await fs.readFile(filePath, "utf8");

	const { content, data } = matter(source);
	const frontmatter = data as UpdateFrontmatter;

	const result = await bundleMDX({
		source: content,
		mdxOptions(options) {
			options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
			options.rehypePlugins = [...(options.rehypePlugins ?? []), rehypeSlug, rehypeHighlight];
			return options;
		},
	});

	return {
		code: result.code,
		frontmatter,
		slug,
	};
}

export async function getAllUpdates(): Promise<MDXUpdate[]> {
	const slugs = await getUpdateSlugs();
	const updates = await Promise.all(slugs.map((slug) => getUpdateBySlug(slug)));

	return updates.sort((a, b) => {
		const dateA = parseTimelineDate(a.frontmatter.started_date);
		const dateB = parseTimelineDate(b.frontmatter.started_date);
		return dateA.getTime() - dateB.getTime();
	});
}

export async function getUpdateSlugs(): Promise<string[]> {
	try {
		await fs.access(UPDATES_PATH);
	} catch (_error) {
		await fs.mkdir(UPDATES_PATH, { recursive: true });
		return [];
	}

	const files = await fs.readdir(UPDATES_PATH);
	return files.filter((file) => /\.mdx$/.test(file)).map((file) => file.replace(/\.mdx$/, ""));
}
