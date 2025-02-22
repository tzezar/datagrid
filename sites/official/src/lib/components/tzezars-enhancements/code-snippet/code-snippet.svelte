<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { CopyButton } from '../copy-button';
	import { cn } from '$lib/utils';

	const codeSnippetVariants = tv({
		base: 'relative w-full max-w-full rounded-md border bg-background py-2.5 pl-3 pr-12',
		variants: {
			variant: {
				default: 'border-border',
				secondary: 'border-border bg-accent',
				destructive: 'border-destructive bg-destructive',
				primary: 'border-primary bg-primary text-primary-foreground'
			}
		}
	});

	type CodeSnippetVariant = VariantProps<typeof codeSnippetVariants>['variant'];

	type Props = {
		variant?: CodeSnippetVariant;
		content: string | string[];
		class?: string;
		onCopy?: () => void;
	};

	let { content, variant = 'default', onCopy, class: _class }: Props = $props();
</script>

<div class={cn(codeSnippetVariants({ variant, className: _class }))}>
	{#if Array.isArray(content)}
		{#each content as line}
			{@render CodeLine(line)}
		{/each}
	{:else}
		{@render CodeLine(content)}
	{/if}

	<CopyButton
		class="absolute right-2 top-1/2 size-7 -translate-y-1/2 transition-opacity ease-in-out hover:bg-transparent hover:text-opacity-80"
		textToCopy={typeof content === 'string' ? content : content.join('\n')}
		{onCopy}
	/>
</div>

{#snippet CodeLine(line: string)}
	<pre class={cn('overflow-y-auto whitespace-nowrap text-left font-mono text-sm')}>
		{line}
	</pre>
{/snippet}
