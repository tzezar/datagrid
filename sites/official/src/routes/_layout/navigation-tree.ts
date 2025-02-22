import { Github, HandHeart, HelpCircle, HelpingHand } from "lucide-svelte";

export const navigationTree = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg'
    },

    navQuickStart: [
        {
            title: 'Overview',
            url: '/headless/quick-start/overview',
        },
        {
            title: 'Installation',
            url: '/headless/quick-start/installation',
        },
        {
            title: 'Getting Started',
            url: '/headless/quick-start/getting-started',
        },
    ],

    navMain: [
        {
            title: "Guides",
            url: "/headless/guides",
            isActive: true,
            items: [
                {
                    title: 'Features overview',
                    url: '/headless/guides/feature-overview',
                    disabled: true
                },

                {
                    title: 'Column creation',
                    url: '/headless/guides/column-creation',
                    disabled: true
                },
                {
                    title: 'Events',
                    url: '/headless/guides/events',
                    disabled: true
                },
                {
                    title: 'Data caching',
                    url: '/headless/guides/data-caching',
                    disabled: true
                },
                {
                    title: 'Lifecycle hooks',
                    url: '/headless/guides/lifecycle-hooks',
                    disabled: true
                },

                {
                    title: 'Data flow',
                    url: '/headless/guides/data-flow',
                    disabled: true
                },
                {
                    title: 'Controllers',
                    url: '/headless/guides/controllers',
                    disabled: true
                },
            ],
        },
        {
            title: "Examples",
            url: "/headless/examples",
            isActive: true,
            items: [
                {
                    title: 'Basic',
                    url: '/headless/examples/basic',
                },
                {
                    title: 'Column Filters',
                    url: '/headless/examples/column-filters',
                },
                {
                    title: 'Column Filters Faceted',
                    url: '/headless/examples/column-filters-faceted',
                },
                {
                    title: 'Column Ordering',
                    url: '/headless/examples/column-ordering',
                },
                {
                    title: 'Column Pinning',
                    url: '/headless/examples/column-pinning',
                },
                {
                    title: 'Column Pinning Detached',
                    url: '/headless/examples/column-pinning-detached',
                },
                {
                    title: 'Column Sizing',
                    url: '/headless/examples/column-sizing',
                },
                {
                    title: 'Column Visibility',
                    url: '/headless/examples/column-visibility',
                },
                {
                    title: 'Editable Data',
                    url: '/headless/examples/editable-data',
                },
                {
                    title: 'Grouping',
                    url: '/headless/examples/grouping',
                },
                {
                    title: 'Header Groups',
                    url: '/headless/examples/header-groups',
                },
                {
                    title: 'Pagination',
                    url: '/headless/examples/pagination',
                },
                {
                    title: 'Pagination On Backend',
                    url: '/headless/examples/pagination-on-backend',
                },
                {
                    title: 'Row Expanding',
                    url: '/headless/examples/row-expanding',
                },
                {
                    title: 'Row Pinning',
                    url: '/headless/examples/row-pinning',
                },
                {
                    title: 'Row Selection',
                    url: '/headless/examples/row-selection',
                },
                {
                    title: 'Sorting',
                    url: '/headless/examples/sorting',
                },
                {
                    title: 'Virtualized',
                    url: '/headless/examples/virtualized',
                },
            ],
        },
        {
            title: 'API Reference',
            url: 'https://datagrid-api-reference.tzezar.pl/',
            isActive: true
        },

    ],
    navSecondary: [

        {
            title: 'GitHub',
            url: 'https://github.com/tzezar/datagrid',
            icon: Github
        },
        {
            title: 'Supporters',
            url: '/supporters',
            icon: HandHeart
        },
        // {
        // 	title: 'Feedback',
        // 	url: 'https://github.com/tzezar',
        // 	icon: Send
        // }
    ],

    navEnhanced: [

        {
            title: 'Overview',
            url: '/enhanced/overview',
        },
        {
            title: 'Installation',
            url: '/enhanced/installation',
        },
        {
            title: 'Interactive Demo',
            url: '/enhanced/interactive-demo',
        },
    ]


};