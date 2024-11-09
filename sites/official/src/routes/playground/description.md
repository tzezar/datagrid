# Headless DataGrid

### Built with Svelte 5

This is a preview of the official release of the Tzezar DataGrid headless core. Combining data grid logic with the UI layer was not an effective approach. I rewrote the entire internal logic from scratch and believe I have created something quite useful and performant. It will soon be published along with documentation, created components using native HTML elements, and a version compatible with shadcn-svelte. On a decent PC, the grid can handle around 1,000,000 rows with acceptable performance, achieving approximately 700 ms for operations like sorting and grouping. The performance of fuzzy filtering depends on the provided data.

I believe the performance is exceptional, with outstanding results in certain areas when compared to libraries like @tanstack-table. I’d love to hear your thoughts!

## Features

- [x] Column ordering
- [x] Column pinning
  - Left and right
  - Multiple columns
- [x] Column sizing
  - Current, minimum, and maximum values
- [x] Column visibility
- [x] Column filtering
  - Various built-in operators
- [x] Global search
- [x] Fuzzy search
  - Client-side with Fuse.js
- [x] Column faceting
  - Generate minimum/maximum
  - unique values and counts from rows
- [x] Grouping
  - new feature, performant
- [x] Expansion
- Multiple modes
- [x] Pagination
  - instant
- [x] Row selection
  - Multiple modes
- [x] Sorting
  - superior speed compared to beta
- [x] Extremely fast multi-column sorting
- [x] Virtualization
  - Built-in virtualization
- [ ] Row pinning
- [ ] Aggregation

Most features are already implemented. I will clean up the code and interfaces, improve type safety, and make it available.

## Differences Compared to the BETA Version

### Headless

This will be a core focused on the most essential functionalities related to data and columns. Everything else will be moved to the DataGrid component. I introduced a new method of styling and formatting, along with improved handling of nested values. You will be able to accomplish most tasks during the column definition phase.

The functional approach didn’t yield the desired results, so during the rewrite, I opted for a more object-oriented approach. This has significantly simplified the code.

### Beta component version

Due to changes in column definitions, it will now be easier to create custom cells and styling directly within those definitions. However, I found the snippet version very handy and also quite powerful with a bit more effort. The component version of the DataGrid will allow you to choose between these two approaches, enabling you to select the one that best fits your use case or combine both as needed.
