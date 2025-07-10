import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";


// Validate required environment variables early
const validateEnv = () => {
	const required = {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
	};

	const missing = Object.entries(required)
		.filter(([, value]) => !value)
		.map(([key]) => key);

	if (missing.length > 0) {
		console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
		console.error("Please check your .env file and ensure all required variables are set.");
		process.exit(1);
	}
};

// Validate environment variables
validateEnv();

let viteDevServer;
if (process.env.NODE_ENV === "development") {
	try {
		const { createServer } = await import("vite");
		viteDevServer = await createServer({
			server: {
				middlewareMode: true,
			},
		});
		console.log("✅ Vite dev server created successfully");
	} catch (error) {
		console.error("❌ Failed to create Vite dev server:", error);
		process.exit(1);
	}
}

// Create a request handler for Remix
const remixHandler = createRequestHandler({
	build: viteDevServer
		? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
		: () => import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
	app.use(viteDevServer.middlewares);
} else {
	// Vite fingerprints its assets so we can cache forever.
	app.use(
		"/assets",
		express.static("build/client/assets", {
			immutable: true,
			maxAge: "1y",
		}),
	);
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(
	express.static("build/client", {
		maxAge: "1h",
	}),
);

app.use(morgan("tiny"));

// Add error handling middleware
app.use((error, req, res, next) => {
	console.error("Express error:", error);
	res.status(500).json({ error: "Internal server error" });
});

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express server listening at http://localhost:${port}`));
