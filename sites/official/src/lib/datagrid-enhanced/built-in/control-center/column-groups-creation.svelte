<script lang='ts'>
    import { Button } from '$lib/components/ui/button/index.js';
    import { Checkbox } from '$lib/components/ui/checkbox/index.js';
    import Input from '$lib/components/ui/input/input.svelte';
    import type { TzezarsDatagrid } from '../../core/index.svelte';
    import { isGroupColumn } from '$lib/datagrid/core/helpers/column-guards';

    type Props = {
        datagrid: TzezarsDatagrid<any>;
    }

    let { datagrid }: Props = $props();

	let selectedColumns: Record<string, boolean> = $state({});
	let newGroupName = $state('');
</script>


<div class="flex flex-col gap-2 p-2">
    <div class="">
        <Input
            type="text"
            bind:value={newGroupName}
            placeholder="Group Name"
            class="group-name-input"
        />
    </div>

    <div class=" flex flex-col gap-2">
        {#each datagrid.columns as column}
            {#if !isGroupColumn(column)}
                <div class="flex flex-row items-center gap-2">
                    <Checkbox
                        id={column.columnId}
                        checked={selectedColumns[column.columnId]}
                        onCheckedChange={(checked) => (selectedColumns[column.columnId] = checked)}
                    />
                    <label for={column.columnId}>
                        {column.header}
                    </label>
                </div>
            {/if}
        {/each}
    </div>

    <div class="group-menu-footer">
        <Button
            class="w-full"
            disabled={!newGroupName || !Object.values(selectedColumns).some((v) => v)}
            onclick={() => {
                datagrid.handlers.columnGrouping.createGroup({
                    newGroupName,
                    selectedColumns
                });

                selectedColumns = {};
                newGroupName = '';
            }}
        >
            Create Group
        </Button>
    </div>
</div>