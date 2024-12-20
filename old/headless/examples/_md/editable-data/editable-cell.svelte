<script lang="ts">
    import type { Row } from '$lib/tzezars-datagrid/processors/data-processor.svelte';
    import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';
    import type { Column } from '$lib/tzezars-datagrid/processors/column-processor.svelte';

    let { row, grid, column }: { 
        row: Row<any>; 
        grid: Datagrid<any, any>;
        column: Column<any>;
    } = $props();

    // Utility function to get a nested value
    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, key) => acc && acc[key], obj);
    };

    // Utility function to set a nested value with type conversion
    const setNestedValue = (obj: any, path: string, value: any, type: string) => {
        const keys = path.split('.');
        const lastKey = keys.pop()!;
        const target = keys.reduce((acc, key) => acc[key] ??= {}, obj);
        
        // Convert value based on type
        let convertedValue: any;
        switch (type) {
            case 'number':
                convertedValue = value === '' ? null : Number(value);
                // Check if the conversion resulted in a valid number
                if (isNaN(convertedValue)) {
                    console.warn(`Invalid number value: ${value}`);
                    return;
                }
                break;
            case 'string':
                convertedValue = String(value);
                break;
            default:
                convertedValue = value;
        }
        
        target[lastKey] = convertedValue;
    };

    // Get the data type from column metadata
    const getColumnType = (): string => {
        return column._meta?.type || 'string';
    };

    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const originalRow = grid.original.data.find(
            r => r.id === row.original.id
        );
        
        if (!originalRow) return;
        
        // Use the setNestedValue function with type information
        setNestedValue(originalRow, column.columnId, target.value, getColumnType());
        
        grid.reload(() => {});
    };

    // Get input type based on column type
    const getInputType = (): string => {
        const type = getColumnType();
        switch (type) {
            case 'number':
                return 'number';
            default:
                return 'text';
        }
    };

    // Format display value based on type
    const getDisplayValue = (): string => {
        const value = getNestedValue(row.original, column.columnId);
        if (value === null || value === undefined) return '';
        return String(value);
    };
</script>

<input 
    type={getInputType()}
    value={getDisplayValue()}
    onchange={handleChange}
    class="w-full h-full p-2"
/>