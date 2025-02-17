


export type TocItem = {
    value: string,
    depth: number,
    data: {
        hProperties: {
            id: string
        }
    },
    children: TocItem[],
}

export type Post = {
    title: string;
    content: string;
    slug: string;
    toc: TocItem[];
}


export type SidebarItem = { title: string, slug: string | null, children: SidebarItem[] };

export type SearchData = {
    title: string,
    content: string,
}