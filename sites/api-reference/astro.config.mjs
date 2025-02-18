// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: "Tzezar's Datagrid Core API",
            head: [
                {
                    tag: 'script',
                    attrs: {
                      src: 'https://umami.tzezar.pl/script.js',
                      defer: true,
                      'data-website-id': 'cc2a63fa-9054-4b70-8ba9-d11462287426'
                    },
                  },
            ],

            social: {
                github: 'https://github.com/tzezar/datagrid',
            },
            sidebar: [
                {
                    label: 'Overview',
                    link: '/api/readme'
                },
                {
                    label: 'Classes',
                    autogenerate: { directory: 'api/classes' },
                    collapsed: true,
                },
                {
                    label: 'Functions',
                    autogenerate: { directory: 'api/functions' },
                    collapsed: true,
                },
                {
                    label: 'Variables',
                    autogenerate: { directory: 'api/variables' },
                    collapsed: true,
                },
                {
                    label: 'Interfaces',
                    autogenerate: { directory: 'api/interfaces' },
                    collapsed: true,
                },
                {
                    label: 'Type Aliases',
                    autogenerate: { directory: 'api/type-aliases' },
                    collapsed: true,
                },
                {
                    label: 'Go back to examples',
                    link: 'http://datagrid.tzezar.pl'
                },
            ],
            customCss: ['./src/tailwind.css'],
            plugins: [
                // Generate the documentation.
                starlightTypeDoc({


                    entryPoints: ['./datagrid/**/*.ts', './datagrid/**/*.svelte.ts'],
                    tsconfig: './tsconfig.json',
                    sidebar: {
                        label: 'API',
                    },
                    pagination: true,

                    typeDoc: {


                        plugin: ["typedoc-plugin-markdown", "typedoc-plugin-merge-modules"],
                        disableGit: false,
                        name: "Tzezar's Datagrid Core API",

                        cleanOutputDir: true,
                        fileExtension: ".md",
                        skipErrorChecking: true,
                        compilerOptions: {
                            "skipLibCheck": true,
                            "strictNullChecks": false
                        },
                        propertyMembersFormat: "table",
                        classPropertiesFormat: "table",
                        enumMembersFormat: "table",
                        interfacePropertiesFormat: "table",
                        typeDeclarationFormat: "table",
                        formatWithPrettier: true,

                        excludeInternal: true,
                        excludePrivate: true,
                        excludeProtected: true,
                        githubPages: false,
                        readme: "none",

                        // "useCodeBlocks": true,
                        useHTMLEncodedBrackets: false,
                    }
                }),
            ],
        }),
        tailwind({ applyBaseStyles: false }),
    ],

    adapter: node({
        mode: 'standalone',
    }),
});