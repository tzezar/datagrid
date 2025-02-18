---
title: Headless Overview
---


# {title}

The first official release iteration of Tzezar's Datagrid was built from the ground up for Svelte 5 by Sebastian "Tzezar" Drozd. Unlike the Beta version, all datagrid logic (the Core or Headless part) has been separated from the UI layer. This architectural decision was made to prioritize speed, flexibility, and maintainability. The separation allows developers to implement custom UI components while leveraging the robust core functionality.

## Why Choose Tzezar's Datagrid?

- Fully headless architecture
- Built specifically for Svelte 5
- High performance with large datasets
- Extensive customization options
- Strong TypeScript support
- Modular plugin system
- Active maintenance and community support

## TypeScript Support

The Datagrid is written in TypeScript, providing excellent type safety and developer experience. While JavaScript usage is possible, TypeScript is strongly recommended due to:

- Comprehensive type definitions for all features
- Improved code completion and IntelliSense
- Better error detection during development
- Easier maintenance and refactoring
- Enhanced documentation through types

## Headless Core Architecture

Tzezar's Datagrid Core follows the headless UI pattern, separating logic from presentation. This means:

- No predefined DOM elements or styles
- Complete control over the UI implementation
- Framework-agnostic core logic
- Better performance through reduced overhead
- Easier testing and maintenance

## Core Features

The core version includes a comprehensive set of built-in features that cover most data grid use cases:

### Row Operations
- Row expanding with customizable detail views
- Efficient pagination with various page size options
- Multiple row selection with checkboxes or click events
- Row pinning to top or bottom
- Multi-column sorting with custom comparators

### Column Management
- Faceted filtering with multiple filter types
- Advanced filtering with custom filter functions
- Hierarchical column grouping
- Column reordering API
- Column pinning (left/right)
- Resizable columns with minimum/maximum constraints
- Toggle column visibility
- Global search across all or specific columns
- Dynamic grouping with custom aggregation

### Best Practices

When implementing Tzezar's Datagrid, consider these recommendations:

1. Create a wrapper component to encapsulate the core logic
2. Maintain consistent update patterns for core version upgrades
3. Follow the recommended state management patterns

## Optional Plugins

Enhance your datagrid functionality with these optional plugins:

### UI Enhancement Plugins
- Smooth animations for all interactions
- Click-to-copy cell contents
- Column groups visibility controls
- Fullscreen mode
- Custom overlay system
- Status indicators
- Striped rows styling

### Functionality Plugins
- Advanced export capabilities (CSV, Excel, PDF)
- Custom pagination controls
- State persistence
- Virtual scrolling integration

## Virtualization

While virtualization isn't built into the core, it's essential for handling large datasets efficiently. After extensive testing of various solutions, [orefalo/svelte-virtuallists](https://github.com/orefalo/svelte-virtuallists)


- Smooth scrolling performance
- Dynamic height support
- Simple integration API
- Reliable event handling
- Minimal memory footprint

