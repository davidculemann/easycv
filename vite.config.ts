import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import envOnly from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [envOnly(), tsconfigPaths(), reactRouter()],
	server: {
		port: 3000,
		strictPort: true,
	},
	optimizeDeps: {
		include: ["react-router"],
	},
});
