---
title: Headless Overview
---

# {title}

The first official release of Tzezar's Datagrid was developed from the ground up for Svelte 5 by [Sebastian "Tzezar" Drozd](https://github.com/tzezar). Unlike the Beta version, this release introduces a **separation of concerns** between the datagrid logic (Core or Headless part) and the UI. This architectural change was made to prioritize **speed**, **flexibility**, and **maintainability**. By separating the core functionality, developers now have the ability to create custom UI components while still taking full advantage of the powerful and optimized datagrid logic.

## Why Choose Tzezar's Datagrid?

- **Full control** of your code — no hidden behavior
- A **headless architecture** for ultimate flexibility
- **Optimized for Svelte 5**, with top-tier performance
- Handles **large datasets** effortlessly
- Highly **customizable** to fit your needs
- Built with **TypeScript** for enhanced safety and productivity
- **Active community** and **ongoing support**
- **Rich feature set** right out of the box

## TypeScript Support

Tzezar’s Datagrid is written in TypeScript, which provides you with excellent type safety, better tooling, and a smoother development experience. While JavaScript is supported, **TypeScript** is strongly recommended for the following reasons:

- **Comprehensive type definitions** for all features
- **Better IntelliSense** and **code completion**
- **Early error detection** to catch issues early in development
- **Easier refactoring** and maintenance
- **Types as live documentation**, ensuring clarity across the codebase

## Headless Core Architecture

The **headless architecture** of Tzezar's Datagrid is designed to separate the logic from the UI. This gives you the freedom to fully control the user interface while benefiting from optimized grid functionality. Key advantages include:

- No predefined DOM elements or styles — you design the UI
- **Reduced overhead**, leading to better performance
- **Total flexibility** in UI design, while still maintaining the core functionality

> **Tip:** Consider creating a wrapper component around the core logic to easily manage updates, bug fixes, and feature enhancements without losing your customizations.

## Core Features

The core version of Tzezar’s Datagrid offers a comprehensive set of features that cover a wide range of data grid use cases:

### Row Operations
- **Row expanding** with customizable detail views
- Efficient **pagination** with flexible page sizes
- **Multi-row selection**
- **Pin rows** to the top or bottom
- **Multi-column sorting** with custom comparators

### Column Management
- **Faceted filtering** with multiple filter types
- **Advanced filtering** with custom filter functions
- **Hierarchical column grouping**
- **Column reordering** via API
- **Pin columns** (left or right)
- **Resizable columns** with customizable constraints
- **Toggle column visibility**
- **Global search** across all or specific columns
- **Dynamic grouping** with custom aggregation
- **Group rows** by columns

### Best Practices

Here are a few best practices for implementing Tzezar's Datagrid:

1. **Create a Wrapper Component:**  
   Since you're working directly with the source code (not an npm package), this gives you complete control over the implementation. However, updates, bug fixes, and new features could overwrite custom changes. A wrapper component helps avoid this issue and keeps your customizations safe during updates.

2. **Follow Recommended State Management Patterns:**  
   Adhering to best practices for state management ensures smooth and maintainable integrations. This also helps avoid issues down the line as your application scales.

## Optional Plugins

Enhance your Tzezar Datagrid with these optional plugins that provide added functionality and an improved user experience:

### UI Enhancement Plugins
- **Smooth animations** for all interactions
- **Click-to-copy** functionality for cell contents
- **Column group visibility** controls
- **Fullscreen mode** for a better user experience
- Custom **overlay system** for additional features
- **Status indicators** to show grid activity
- **Striped rows** styling for improved readability

### Functionality Plugins
- **Advanced export** options (CSV, Excel, PDF)
- **Custom pagination controls**
- **State persistence** for saving grid settings
- **Virtual scrolling** for improved performance with large datasets

## Virtualization

Although virtualization isn’t built into the core, it’s crucial for handling large datasets efficiently. After testing several solutions, we recommend using [orefalo/svelte-virtuallists](https://github.com/orefalo/svelte-virtuallists) for smooth scrolling performance and easy integration.

Benefits of using virtualization:
- **Smooth scrolling** with large datasets
- **Dynamic height support** for rows
- Simple **integration API**
- Reliable **event handling**
- **Minimal memory footprint** for better performance
