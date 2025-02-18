<script lang="ts">
	import { mode } from 'mode-watcher';

	import logoBlack from '$lib/assets/img/tzezar-logo-black.png';
	import logoWhite from '$lib/assets/img/tzezar-logo-white.png';

	let schema = $derived($mode || 'dark');
</script>

<a href="/" class="">
	<div
		class="bg-primary-foreground sticky top-0 flex w-full items-center justify-center gap-4 lg:py-2"
	>
		<div class="flex flex-row items-center justify-center align-middle">
			{#if schema == 'dark'}
				<img src={logoWhite} alt="Logo" class="h-[32px] w-[32px]" />
			{:else}
				<img src={logoBlack} alt="Logo" class="h-[32px] w-[32px]" />
			{/if}
		</div>
		<div>
			<h1 class="text-lg font-semibold">Tzezar's Datagrid</h1>
		</div>
	</div>
</a>
