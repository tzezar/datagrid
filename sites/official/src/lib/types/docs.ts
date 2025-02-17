export type Metadata = {
	title: string;
	description: string;
};

export type FrontMatter = {
	title: string;
	description: string;
	component: boolean;
	source: string;
	external?: {
		project: string;
		url: string;
	};
	bits?: string;
};

export type DocFile = {
	default: import("svelte").ComponentType;
	metadata: FrontMatter;
};

export type DocResolver = () => Promise<DocFile>;

export type TableOfContentsItem = {
	title: string;
	url: string;
	items?: TableOfContentsItem[];
};

export type TableOfContents = {
	items: TableOfContentsItem[];
};