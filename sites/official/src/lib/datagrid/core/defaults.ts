
export const DATAGRID_DEFAULTS = {
    PAGE_SIZE: 10,
    PAGE_SIZES: [10, 20, 50, 100],
} as const


export const DEFAULT_COLUMN_SIZE = {
    width: 200,
    minWidth: 60,
    maxWidth: 700,
    // grow: false
}

export const DEFAULT_FUSE_OPTIONS = {
    threshold: 0.3,     // Sensitivity threshold for fuzzy matching (lower is more strict)
    location: 0,        // Starting position for search in each string
    distance: 100,      // Maximum distance to consider for matching
    includeScore: true, // Include score in search results
    useExtendedSearch: true, // Enable extended search capabilities (supports wildcards)
    ignoreLocation: true,    // Ignore the starting position of the match
    findAllMatches: true,    // Find all matches rather than just the first one
}