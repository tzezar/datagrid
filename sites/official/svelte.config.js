import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { escapeSvelte, mdsvex } from 'mdsvex'
import { createHighlighter } from 'shiki'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'



/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.svx', '.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await createHighlighter({
				themes: ['vitesse-dark', 'ayu-dark', 'vitesse-light', 'poimandres'],
				langs: ['javascript', 'typescript', 'svelte', 'json', `bash`]
			})
			await highlighter.loadLanguage('javascript', 'typescript')
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'poimandres' }))
			return `{@html \`${html}\` }`
		}
	},
	remarkPlugins: [remarkUnwrapImages, [remarkToc, { tight: true }]],
	rehypePlugins: [rehypeSlug]
}


/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],

	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

	kit: {
		adapter: adapter(),
		alias: {
			// "$datagrid/*": "./src/lib/datagrid/*",
			// "$datagrid-enhanced/*": "./src/lib/datagrid-enhanced/*",
		  },
	}
};

export default config;