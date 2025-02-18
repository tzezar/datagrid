---
title: Installation
---

<script>
</script>

# {title}

## Prerequisites
Ensure that you have the following set up before proceeding:
- A working [Svelte](https://svelte.dev/) project

## Automatic installation

The easiest way to install is using our CLI tool.

### Using the CLI

```bash
npx tzezars-datagrid@latest init
```

During installation, you'll be prompted to answer few configuration questions:

```bash
✔ Which project would you like to work with? core
✔ Where do you want to install the component? ./src/lib/datagrid
✔ Do you want to install dependencies? Yes
```

### Installation Complete

> Note: If dependency installation fails (a known random issue), you can install packages manually. Please report any issues on our GitHub repository.

## Manual installation

### Component Installation

Get the datagrid component by copying the code from our [GitHub repository](https://github.com/tzezar/datagrid/tree/main/packages/cli/datagrid).

### Required Dependencies

For global search functionality:

```bash
npm i fuse.js
```

For data export features:

```bash
npm i papaparse xlsx fast-xml-parser
```
1. `papaparse` - CSV export
2. `xlsx` - Excel export
3. `fast-xml-partser` - XML export


### Optional:

The fast-sort package provides better sorting algorithms compared to our default implementation which uses the Schwartzian Transform. Choose this if you need enhanced sorting performance.

```bash
npm i fast-sort
```

For virtual scrolling support my recommendation is:

```bash
npm i svelte-virtuallists
```
