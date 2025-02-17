import { promises as fs } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import type { Post, SidebarItem, TocItem } from '$lib/types';





// Custom remark plugin to transform .md links
function remarkTransformLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (node.url && node.url.endsWith('.md')) {
        node.url = node.url.replace(/\.md$/, '');
      }
      // if (node.url && node.url.startsWith('../')) {
      // }
    });
  };
}

function extractToc() {
  return (tree, file) => {
    const toc = [];
    visit(tree, 'heading', (node) => {
      const depth = node.depth;
      const text = node.children
        .filter((child) => child.type === 'text')
        .map((child) => child.value)
        .join('');

      const id = text.toLowerCase().replace(/\s+/g, '-'); // Generate an ID
      toc.push({ text, depth, id });
    });
    file.data.toc = toc; // Store in file data
  };
}

function headingTree() {
  return (node, file) => {
    file.data.headings = getHeadings(node);
  };
}

function getHeadings(root) {
  const nodes = {};
  const output = [];
  const indexMap = {};
  visit(root, "heading", (node) => {
    addID(node, nodes);
    transformNode(node, output, indexMap);
  });

  return output;
}

/*
 * Add an "id" attribute to the heading elements based on their content
 */
function addID(node, nodes) {
  const id = node.children.map((c) => c.value).join("");
  nodes[id] = (nodes[id] || 0) + 1;
  node.data = node.data || {
    hProperties: {
      id: `${id}${nodes[id] > 1 ? ` ${nodes[id] - 1}` : ""}`
        .replace(/[^a-zA-Z\d\s-]/g, "")
        .split(" ")
        .join("-")
        .toLowerCase(),
    },
  };
}

import { toString } from "mdast-util-to-string";

function transformNode(node, output, indexMap) {
  const transformedNode = {
    value: toString(node),
    depth: node.depth,
    data: node.data,
    children: [],
  };

  if (node.depth === 2) {
    output.push(transformedNode);
    indexMap[node.depth] = transformedNode;
  } else {
    const parent = indexMap[node.depth - 1];
    if (parent) {
      parent.children.push(transformedNode);
      indexMap[node.depth] = transformedNode;
    }
  }
}

// Process markdown content using remark/rehype
async function processMarkdown(content) {
  const processedContent = await unified()
    .use(remarkParse)           // Parse markdown into mdast
    .use(remarkTransformLinks)  // Transform links
    // .use(extractToc)        // Extract TOC separately
    .use(headingTree)
    // .use(remarkToc, { heading: 'Table of Contents', maxDepth: 0, tight: true} )
    .use(remarkRehype)         // Convert to hast
    .use(rehypeStringify)      // Convert to HTML string
    .use(rehypeSlug)
    .process(content);



  return {
    html: String(processedContent),  // Markdown converted to HTML
    toc: processedContent.data.headings as TocItem[],  // Extracted TOC
  };
}

// Function to get all markdown files recursively
async function getMarkdownFiles(dir) {
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
  return files.flat().filter(Boolean);
}




export async function load() {
  const docsPath = join(process.cwd(), 'src/docs');
  const files = await getMarkdownFiles(docsPath);

  const sidebar: SidebarItem[] = [];
  const pages: Record<string, Post> = {};

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { data, content: markdown } = matter(content);

    // Process markdown and extract TOC
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
        const newItem = {
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

    // if (data.title === "classes/ColumnProcessor" || slug === "classes/ColumnProcessor") {
    //   console.log(toc)
    // }

    pages[slug] = {
      title: data.title || slug,
      content: html,
      metadata: data,
      toc, // Store TOC separately
    };
  }

  return {
    sidebar,
    pages,
  };
}
