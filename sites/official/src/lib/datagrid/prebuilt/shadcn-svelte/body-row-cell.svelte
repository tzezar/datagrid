<script lang="ts">
	import type { Datagrid } from "$lib/datagrid/core/index.svelte";
	import type { CustomCellComponentWithProps, GridBasicRow, LeafColumn } from "$lib/datagrid/core/types";
	import { getCellContent } from "$lib/datagrid/core/utils.svelte";


	let { datagrid, column, row }: { datagrid: Datagrid<any>; column: LeafColumn<any>; row: GridBasicRow<any> } =
		$props();

		function isCellComponent(value: any): value is CustomCellComponentWithProps {
        return value && typeof value === 'object' && 'component' in value && 'props' in value;
    }

</script>

<div
    class="grid-body-cell"
    data-pinned={column.state.pinning.position !== 'none' ? column.state.pinning.position : null}
    style:--width={column.state.size.width + 'px'}
    style:--min-width={column.state.size.minWidth + 'px'}
    style:--max-width={column.state.size.maxWidth + 'px'}
    style:--pin-left-offset={column.state.pinning.offset + 'px'}
    style:--pin-right-offset={column.state.pinning.offset + 'px'}
>
    {#if column.cell}
        {@const cellContent = column.cell({ datagrid, column, row })}
        {#if typeof cellContent === 'string'}
            {@html cellContent}
        {:else if isCellComponent(cellContent)}
			<cellContent.component {...cellContent.props} {datagrid} />
        {/if}
    {:else}
        {@html getCellContent(column, row.original)}
    {/if}
</div>
