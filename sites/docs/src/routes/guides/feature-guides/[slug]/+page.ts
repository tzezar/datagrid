import { error } from '@sveltejs/kit'

export async function load({ params }) {
	try {
        console.log(params.slug)
		const post = await import(`../../../../examples/${params.slug}/documentation.md`)

		return {
			content: post.default,
			meta: post.metadata
		}
	} catch (e) {
		error(404, `Could not find ${params.slug}`)
	}
}