
export type INavigationEntry = {
    title: string,
    href: string,
}

export type INavigationGroup = {
    title: string,
    href?: string,
    children: INavigationItem[]
}

export type INavigationItem = INavigationEntry | INavigationGroup

export const links: INavigationItem[] = [
    {
        title: 'Homepage',
        href: '/'
    },
    {
        title: 'Supporters',
        href: '/supporters'
    },
    {
        title: 'Headless',
        children: [

            {

                title: 'Quick Start',
                children: [
                    {
                        title: 'Overview',
                        href: '/headless/quick-start/overview'
                    },
                    {
                        title: 'Installation',
                        href: '/headless/quick-start/installation'
                    },
                    {
                        title: 'Getting Started',
                        href: '/headless/quick-start/getting-started'
                    }
                ]
            },

            {
                title: 'Examples',
                children: [
                    {
                        title: 'Basic',
                        href: '/headless/examples/basic'
                    },

                    {
                        title: 'Column Filters',
                        href: '/headless/examples/column-filters'
                    },
                    {
                        title: 'Column Filters (Faceted)',
                        href: '/headless/examples/column-filters-faceted'
                    },
                    {
                        title: 'Column Ordering',
                        href: '/headless/examples/column-ordering'
                    },
                    {
                        title: 'Column Pinning',
                        href: '/headless/examples/column-pinning'
                    },
                    {
                        title: 'Column Pinning (Detached)',
                        href: '/headless/examples/column-pinning-detached'
                    },
                    {
                        title: 'Column Sizing',
                        href: '/headless/examples/column-sizing'
                    },
                    {
                        title: 'Column Visibility',
                        href: '/headless/examples/column-visibility'
                    },
                    {
                        title: 'Grouping',
                        href: '/headless/examples/grouping'
                    },
                    {
                        title: 'Header Groups',
                        href: '/headless/examples/header-groups'
                    },
                    {
                        title: 'Pagination',
                        href: '/headless/examples/pagination'
                    },
                    {
                        title: 'Pagination (On Backend)',
                        href: '/headless/examples/pagination-on-backend'
                    },
                    {
                        title: 'Row Expanding',
                        href: '/headless/examples/row-expanding'
                    },
                    {
                        title: 'Row Pinning',
                        href: '/headless/examples/row-pinning'
                    },
                    {
                        title: 'Row Selection',
                        href: '/headless/examples/row-selection'
                    },
                    {
                        title: 'Sorting',
                        href: '/headless/examples/sorting'
                    },
                    {
                        title: 'Virtualized',
                        href: '/headless/examples/virtualized'
                    },
                    {
                        title: 'Editable Data',
                        href: '/headless/examples/editable-data'
                    },

                ]
            },
            {
                title: 'API Reference',
                href: '/headless/api-reference'
            },
        ]
    },
    {
        title: 'Enhanced',
        children: [
            {
                title: 'Overview',
                href: '/enhanced/overview'
            },
            {
                title: 'Installation',
                href: '/enhanced/installation'
            },
            {
                title: 'Interactive Demo',
                href: '/enhanced/interactive-demo'
            }
        ]
    }
];


