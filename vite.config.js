import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, normalizePath } from 'vite';
import path from "path";

export default defineConfig({
	root: normalizePath(path. resolve("./")),
	resolve: {
		alias: {
			"@bib": path.resolve(__dirname, 'src/lib'),
			"@img": path.resolve(__dirname, 'src/images'),
			"@routes": path.resolve(__dirname, 'src/routes'),
		}
	},
	plugins: [sveltekit()]
});
