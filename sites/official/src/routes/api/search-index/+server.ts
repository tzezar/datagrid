import { json, type RequestHandler } from '@sveltejs/kit';
import { promises as fs } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import remarkToc from 'remark-toc';



interface SidebarItem {
  title: string;
  slug: string | null;
  children: SidebarItem[];
}

// Custom remark plugin to transform .md links
function remarkTransformLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (node.url && node.url.endsWith('.md')) {
        node.url = node.url.replace(/\.md$/, '');
      }
    });
  };
}

// Extract table of contents
function extractToc() {
  return (tree: any, file: any) => {
    const toc: TocItem[] = [];
    visit(tree, 'heading', (node) => {
      const depth = node.depth;
      const text = node.children
        .filter((child: any) => child.type === 'text')
        .map((child: any) => child.value)
        .join('');

      const id = text.toLowerCase().replace(/\s+/g, '-');
      toc.push({ text, depth, id });
    });
    file.data.toc = toc;
  };
}

// Process markdown content
async function processMarkdown(content: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkTransformLinks)
    .use(extractToc)
    .use(remarkToc, { heading: 'Table of Contents', tight: true })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);


  return {
    html: String(file),
    toc: file.data.toc as TocItem[],
  };
}

// Get markdown files recursively
async function getMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        return getMarkdownFiles(path);
      } else if (entry.name.endsWith('.md') || entry.name.endsWith('.svx')) {
        return path;
      }
      return null;
    })
  );
  return files.flat().filter(Boolean) as string[];
}

import removeMd from 'remove-markdown';
import type { Post, SearchData, TocItem } from '$lib/types';

export const GET: RequestHandler = async () => {
  try {
    // Initialize data structures
    const pages: Record<string, Post> = {};
    const sidebar: SidebarItem[] = [];
    const docsPath = 'src/docs'; // Define the base docs path

    // Get and process all markdown files
    const files = await getMarkdownFiles(docsPath);

    // Process each file
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const { data, content: markdown } = matter(content);

      const { html, toc } = await processMarkdown(markdown);

      const relativePath = file.replace(docsPath, '').replace(/\.(md|svx)$/, '');
      const slug = relativePath.replace(/\\/g, '/').replace(/^\//, '');

      // Build sidebar structure
      let current = sidebar;
      const parts = slug.split('/');

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        const existing = current.find((item) => item.title === part);

        if (!existing) {
          const newItem: SidebarItem = {
            title: part,
            slug: isLast ? slug : null,
            children: [],
          };
          current.push(newItem);
          current = newItem.children;
        } else {
          current = existing.children;
        }
      });

      // Store page data
      pages[slug] = {
        title: data.title || slug,
        content: html,
        metadata: data,
        toc,
      };
    }

    const jsonData: SearchData[] = Object.keys(pages).map(p=> {
      return {
        title: pages[p].title,
        content: removeMd(pages[p].content),
      }
    })
    // Return both pages and sidebar structure
    
    return json(jsonData)

  } catch (error) {
    console.error('Search index generation failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate search index' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};


// export const prerender = true