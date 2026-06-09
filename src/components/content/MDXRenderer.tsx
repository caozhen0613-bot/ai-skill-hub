import React from 'react';
import { codeToHtml } from 'shiki';

// 简单的 MDX 渲染器（使用 markdown 转换为 html）
interface MDXRendererProps {
  content: string;
}

export async function MDXRenderer({ content }: MDXRendererProps) {
  // 转换简单的 markdown 为 html
  let html = content;
  
  // 处理代码块
  html = await processCodeBlocks(html);
  
  // 处理标题
  html = processHeadings(html);
  
  // 处理段落
  html = processParagraphs(html);
  
  // 处理链接
  html = processLinks(html);
  
  // 处理列表
  html = processLists(html);
  
  // 处理加粗和斜体
  html = processEmphasis(html);

  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}

// 处理代码块
async function processCodeBlocks(text: string): Promise<string> {
  const codeBlockRegex = /```([\s\S]*?)```/g;
  let result = text;
  
  const matches = Array.from(text.matchAll(codeBlockRegex));
  for (const match of matches.reverse()) {
    const [fullMatch, codeContent] = match;
    
    let language = 'plaintext';
    let code = codeContent.trim();
    
    // 提取语言标识
    const firstLineEnd = code.indexOf('\n');
    if (firstLineEnd !== -1) {
      const firstLine = code.substring(0, firstLineEnd).trim();
      if (firstLine && !firstLine.includes(' ')) {
        language = firstLine;
        code = code.substring(firstLineEnd + 1);
      }
    }
    
    try {
      const highlighted = await codeToHtml(code, {
        lang: language as any,
        theme: 'github-dark',
      });
      result = result.replace(fullMatch, highlighted);
    } catch (error) {
      // 如果高亮失败，使用简单的 pre/code 标签
      result = result.replace(fullMatch, `<pre><code>${escapeHtml(code)}</code></pre>`);
    }
  }
  
  return result;
}

// 处理标题
function processHeadings(text: string): string {
  let result = text;
  
  // 处理 # 标题
  result = result.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level} class="text-2xl font-bold mt-8 mb-4">${content}</h${level}>`;
  });
  
  return result;
}

// 处理段落
function processParagraphs(text: string): string {
  // 把不在标签内的文本包装成 p
  let result = text;
  
  result = result.replace(/^(?!<[hpuol])(.*)$/gm, (match, content) => {
    if (content.trim()) {
      return `<p class="mb-4 text-gray-700 dark:text-gray-300">${content}</p>`;
    }
    return match;
  });
  
  return result;
}

// 处理链接
function processLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
}

// 处理列表
function processLists(text: string): string {
  // 处理无序列表
  let result = text.replace(/^- (.*)$/gm, '<li class="ml-4 mb-1">$1</li>');
  result = result.replace(/(<li[\s\S]*?<\/li>)\s*(?=<li)/g, (match) => `<ul class="list-disc mb-4">${match}</ul>`);
  
  return result;
}

// 处理强调
function processEmphasis(text: string): string {
  let result = text;
  // 加粗
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  // 斜体
  result = result.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  return result;
}

// HTML 转义
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
