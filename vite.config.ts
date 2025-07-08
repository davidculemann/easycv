import { vitePlugin as remix } from "@remix-run/dev";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";
import envOnly from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
	interface Future {
		v3_singleFetch: true;
	}
}

export default defineConfig({
	plugins: [
		envOnly(),
		tsconfigPaths(),
		remix({
			presets: [vercelPreset()],
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_singleFetch: true,
				v3_lazyRouteDiscovery: true,
			},
		}),
	],
	server: {
		port: 3000,
		strictPort: true,
	},
	optimizeDeps: {
		include: ["@remix-run/react", "@remix-run/node"],
	},
	build: {
		rollupOptions: {
			onwarn(warning, warn) {
				// Ignore certain warnings that are not critical
				if (warning.code === "CIRCULAR_DEPENDENCY") return;
				if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
				warn(warning);
			},
		},
	},
});
