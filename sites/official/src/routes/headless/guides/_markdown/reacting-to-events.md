---
title: Reacting to events
---

<script>
	import {exports} from './exports.ts'
</script>

# {title}

The **EventService** class provides a lightweight event-handling mechanism, enabling the registration of event listeners, event emission, and listener removal.

## Why Use Events?

Sometimes, it is necessary to respond to internal logic changes or specific user interactions, such as column sorting, row pinning, or selection changes.

To handle such cases, events provide a flexible and scalable solution. The core system includes a set of built-in events, but if additional events are required, they can be easily implemented by emitting custom events at the appropriate points in the codebase.

## Listening to Events

You can listen to built-in events using the `on` method:

<exports.components.codeBlock lang='ts' code={exports.code.reactingToEvents.onExample} />

## Emitting Custom Events

You can define and emit your own events using the emit method:

<exports.components.codeBlock lang='ts' code={exports.code.reactingToEvents.emitExample} />

## Removing Event Listeners

To prevent memory leaks or unnecessary event handling, it can be useful to remove event listeners when they are no longer needed:

<exports.components.codeBlock lang='ts' code={exports.code.reactingToEvents.offExample} />>





## Built-in Events

The system provides a wide range of built-in events that can be leveraged for various UI and logic updates:

- **onColumnSort**

  Triggered when a column is sorted.

- **onRowPin**

  Fires when a row is pinned.

- **onRowUnpin**

  Fires when a row is unpinned.

- **onRowSelect**

  Triggered when a row is selected.

- **onRowDeselect**

  Fires when a row is deselected.

- **onRowSelectionLimitExceeded**

  Fired when the selection limit is exceeded.

- **onRowExpand**

  Fires when a row is expanded.

- **onRowCollapse**

  Fires when a row is collapsed.

- **onRowExpansionLimitExceeded**

  Triggered when the row expansion limit is reached.

- **onPageChange**

  Fires when the page changes.

- **onPageSizeChange**

  Triggered when the page size changes.

- **onGroupExpand**

  Fires when a group is expanded.

- **onGroupCollapse**

  Fires when a group is collapsed.

- **onGroupExpansionLimitExceeded**

  Triggered when the group expansion limit is exceeded.

- **onActiveGroupsLimitExceeded**

  Fires when the active groups limit is reached.

- **onGroupingChange**

  Triggered when the grouping configuration changes.

- **onSearchQueryChange**

  Fires when the search query changes.

- **onFilterChange**

  Triggered when a filter is applied or modified.

- **onColumnResize**

  Fires when a column is resized.

- **onColumnVisibilityChange**

  Triggered when a column's visibility changes.

- **onColumnGroupCreation**

  Fires when a column group is created.

- **onColumnGroupDeletion**

  Triggered when a column group is removed.

- **onColumnPinningChange**

  Fires when a column is pinned or unpinned.

- **onColumnReorder**

  Triggered when columns are reordered.

- **onCellEdit**

  Fires when a cell is edited.

## API Reference

For an up-to-date list of available events, refer to the API Reference.
