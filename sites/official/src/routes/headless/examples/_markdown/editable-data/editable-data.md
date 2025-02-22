---
title: Editable data
---

<script>
import EditableDataDatagrid from './editable-data-datagrid.svelte';

import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<EditableDataDatagrid data={[...data]} />


