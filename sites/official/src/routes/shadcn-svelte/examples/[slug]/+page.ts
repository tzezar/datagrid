import { error } from '@sveltejs/kit'

export async function load({ params }) {
	try {
		const post = await import(`../_md/${params.slug}/documentation.md`)
		
		return {
			content: post.default,
			meta: post.metadata
		}
	} catch (e: any) {
		error(404, `Could not find ${params.slug}`)
	}
}