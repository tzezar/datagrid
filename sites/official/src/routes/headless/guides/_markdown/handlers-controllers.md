---
title: Handlers / Services
---

<script>
	import { exports } from './exports.ts';
</script>

# {title}

**Handlers and Services** form a thin abstraction layer connecting the core data grid logic with more accessible handlers. The built-in services handle essential operations, making your life easier (and your code cleaner!).

A handler acts as the glue between features and processors. For example, toggling a sorting column updates its state and triggers data processing—all handled seamlessly.

Think of it like the **repository pattern** and **controllers** in backend development. A repository (feature) operates only on its state (database), while a handler is like an **execute command**, tying logic together. Your component invocation? That’s your **controller** in action.

## Extending Handlers Like a Pro

If you’re planning to add custom handlers or extend existing logic, it’s highly recommended to create a small abstraction layer rather than modifying the built-in handlers directly. Instead, call the original handlers or override only what’s necessary. 

Why? Because the **core will continue receiving bug fixes and updates**. A wrapper ensures you can upgrade the data grid effortlessly without breaking your custom logic. Future-proofing at its finest!

---

By keeping things modular, you get the best of both worlds—**customization and stability**. 



## Built-in Services

The following services come out of the box:

- **Column Control** – Manage column states and behaviors.
- **Editing Service** – Handle inline editing and data updates.
- **Event Service** – Emit and manage events efficiently.
- **Filtering Service** – Apply filters dynamically.
- **Global Search Service** – Enable full-table search capabilities.
- **Grouping Service** – Organize data into structured groups.
- **Pagination Service** – Handle page navigation and limits.
- **Row Service** – Manage row-specific operations.
- **Sorting Service** – Apply and manage sorting logic.

## API Reference

For a complete list of available services and their usage details, refer to the **API Reference** documentation.

