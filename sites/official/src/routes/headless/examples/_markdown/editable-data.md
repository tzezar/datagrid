---
title: Editable data
---

<script>
import EditableDataDatagrid from '../_datagrids/editable-data/editable-data-datagrid.svelte';

import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<EditableDataDatagrid data={[...data]} />


