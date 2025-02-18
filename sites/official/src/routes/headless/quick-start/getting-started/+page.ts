import type { Metadata } from '$lib/types/metadata'
import { error } from '@sveltejs/kit'

export async function load() {
	try {
		const post = await import(`./getting-started.md`)

		return {
			content: post.default,
			meta: post.metadata as Metadata
		}
	} catch (e) {
		console.log(e)
		error(404, `Unexpected error`)
	}
}
