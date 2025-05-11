#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { execSync } = require("node:child_process");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function toKebabCase(str) {
	return str
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function askQuestion(question) {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer);
		});
	});
}

async function createUpdate() {
	console.log("📝 Create a new update for the timeline\n");

	const title = await askQuestion("Title: ");
	const slug = toKebabCase(title);
	const started_date = await askQuestion("Started Date (DD/MM/YYYY format): ");

	const statusOptions = ["done", "current", "default", "error"];
	const statusPrompt = `Status (${statusOptions.join("/")}): `;
	let status = await askQuestion(statusPrompt);
	while (!statusOptions.includes(status)) {
		console.log(`Invalid status. Choose from: ${statusOptions.join(", ")}`);
		status = await askQuestion(statusPrompt);
	}

	const frontmatter = ["---", `title: ${title}`, `started_date: ${started_date}`, `status: ${status}`];

	frontmatter.push("---");
	frontmatter.push("");
	frontmatter.push("Write your update content here...");

	const content = frontmatter.join("\n");

	const updateDir = path.join(process.cwd(), "content", "updates");
	if (!fs.existsSync(updateDir)) {
		fs.mkdirSync(updateDir, { recursive: true });
	}

	const filePath = path.join(updateDir, `${slug}.mdx`);
	fs.writeFileSync(filePath, content);

	console.log(`\n✅ Created update at ${filePath}`);

	try {
		const editor = process.env.EDITOR || "code";
		execSync(`${editor} ${filePath}`);
	} catch (error) {
		console.log(`\nTo edit the file, open: ${filePath}`);
	}

	rl.close();
}

createUpdate().catch(console.error);
