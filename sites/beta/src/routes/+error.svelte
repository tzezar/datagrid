<script>
	import Button from '$lib/components/ui/button/button.svelte';
</script>
<main class="flex h-full items-center justify-items-center">
	<div class="w-full grow text-center">
		<p class="text-base font-semibold">404</p>
		<h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
		<p class="mt-6 text-base leading-7 text-muted-foreground">
			Sorry, we couldn’t find the page you’re looking for.
		</p>
		<div class="mt-10 flex items-center justify-center gap-x-6">
			<a href="/" class="">
				<Button>Go back home</Button>
			</a>
			<a href="/" class="text-sm font-semibold">
				<Button variant="outline">
					Contact support
					<span aria-hidden="true" class="pl-2">&rarr;</span>
				</Button>
			</a>
		</div>
	</div>
</main>
