import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.svx', '.md'],
    preprocess: [vitePreprocess()],
    kit: {
        adapter: adapter(),
    }
};

export default config;