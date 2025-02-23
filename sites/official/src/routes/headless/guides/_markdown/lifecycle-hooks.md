---
title: Lifecycle Hooks
---

<script>
	import { exports } from './exports.ts';
</script>

# {title}

Lifecycle hooks allow you to modify data at critical stages of processing, both for columns and data itself.  
This is particularly useful as it enables you to adjust the data processing logic without modifying the core system.  

If you require a more customized solution, you might find it easier to implement and override specific processors.  

To see an implementation example, check out the **shadcn-svelte** datagrid component wrapper.

## Built-in Lifecycle Hooks  

The core system includes several lifecycle hooks that are triggered **before** and **after** key data operations, such as:


<exports.components.codeBlock lang='svelte' code={exports.code.lifecycleHooks.example1} />

## Why Use Lifecycle Hooks?

Lifecycle hooks are beneficial in cases such as:

- Adding or modifying columns dynamically
- Transforming original data before it is used
- Injecting custom logic without altering the core system

## API Reference

For detailed explanations and practical examples, refer to the API Reference section.
