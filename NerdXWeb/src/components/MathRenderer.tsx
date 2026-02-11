/**
 * MathRenderer - Renders Markdown-ish text with LaTeX math using KaTeX.
 * Matches mobile MathRenderer behavior for O-Level Mathematics notes.
 * Normalizes naked LaTeX (e.g. \frac{1}{2}, \cap) so it renders as math.
 */
import { useEffect, useRef, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';
import { normalizeLatexForRender } from '../utils/latexForMathRenderer';

const MATH_PLACEHOLDER = '__MATH__';

function processContent(content: string): string {
  if (!content) return '';

  // Wrap naked LaTeX in $ $ so KaTeX can render it (e.g. \frac{1}{2}, P \cap Q)
  const normalized = normalizeLatexForRender(content);

  const mathBlocks: string[] = [];
  const tableBlocks: string[] = [];
  const blockquoteBlocks: string[] = [];

  let processed = normalized;

  // Extract display math ($$...$$ or \[...\])
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push(math.trim());
    return `${MATH_PLACEHOLDER}${idx}D${MATH_PLACEHOLDER}`;
  });
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push(math.trim());
    return `${MATH_PLACEHOLDER}${idx}D${MATH_PLACEHOLDER}`;
  });

  // Extract inline math ($...$ or \(...\))
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push(math.trim());
    return `${MATH_PLACEHOLDER}${idx}I${MATH_PLACEHOLDER}`;
  });
  processed = processed.replace(/\$([^$\n]+)\$/g, (_, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push(math);
    return `${MATH_PLACEHOLDER}${idx}I${MATH_PLACEHOLDER}`;
  });

  // Extract markdown tables BEFORE escaping HTML
  // Match tables: lines starting with |, with at least a header row and separator row
  const tableRegex = /(\|[^\n]+\|\r?\n)(\|[-:\s|]+\|\r?\n)((?:\|[^\n]+\|\r?\n?)+)/g;
  processed = processed.replace(tableRegex, (match) => {
    const idx = tableBlocks.length;
    tableBlocks.push(match.trim());
    return `__TABLE__${idx}__TABLE__`;
  });

  // Extract blockquotes (> syntax)
  const blockquoteRegex = /(?:^|\n)(&gt;|\>) ([^\n]+)/g;

  // Escape HTML
  processed = processed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore math blocks
  mathBlocks.forEach((math, idx) => {
    const displayPattern = `${MATH_PLACEHOLDER}${idx}D${MATH_PLACEHOLDER}`;
    const inlinePattern = `${MATH_PLACEHOLDER}${idx}I${MATH_PLACEHOLDER}`;
    const fixed = math.replace(/\\\\/g, '\\');
    if (processed.includes(displayPattern)) {
      processed = processed.replace(displayPattern, `$$${fixed}$$`);
    } else {
      processed = processed.replace(inlinePattern, `$${fixed}$`);
    }
  });

  // Restore and render tables
  tableBlocks.forEach((table, idx) => {
    const tableHtml = renderMarkdownTable(table);
    processed = processed.replace(`__TABLE__${idx}__TABLE__`, tableHtml);
  });

  // Handle blockquotes (> text)
  processed = processed.replace(/(?:^|\n)(?:&gt;|>) ([^\n]+)/g, '</p><blockquote class="md-blockquote">$1</blockquote><p>');

  // Markdown formatting
  processed = processed
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n### ([^\n]+)/g, '</p><h4>$1</h4><p>')
    .replace(/\n## ([^\n]+)/g, '</p><h3>$1</h3><p>')
    .replace(/\n# ([^\n]+)/g, '</p><h2>$1</h2><p>')
    .replace(/\n- /g, '</p><p class="md-list-item">• ')
    .replace(/\n(\d+)\. /g, '</p><p class="md-list-item">$1. ')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  return `<p>${processed}</p>`;
}

/**
 * Renders a markdown table string to HTML
 */
function renderMarkdownTable(tableStr: string): string {
  const lines = tableStr.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return tableStr;

  // Parse header row
  const headerCells = lines[0]
    .split('|')
    .slice(1, -1) // Remove empty first/last from | split
    .map(cell => cell.trim());

  // Skip separator row (lines[1])
  // Parse body rows
  const bodyRows = lines.slice(2).map(line => {
    return line
      .split('|')
      .slice(1, -1)
      .map(cell => {
        // Process inline markdown within cells
        let cellContent = cell.trim();
        cellContent = cellContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        cellContent = cellContent.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        cellContent = cellContent.replace(/`([^`]+)`/g, '<code>$1</code>');
        return cellContent;
      });
  });

  // Build HTML table
  let html = '<div class="md-table-wrapper"><table class="md-table">';
  html += '<thead><tr>';
  headerCells.forEach(cell => {
    let cellContent = cell;
    cellContent = cellContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html += `<th>${cellContent}</th>`;
  });
  html += '</tr></thead>';
  html += '<tbody>';
  bodyRows.forEach(row => {
    html += '<tr>';
    row.forEach(cell => {
      html += `<td>${cell}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';

  return html;
}

interface MathRendererProps {
  content: string;
  fontSize?: number;
  className?: string;
}

export function MathRenderer({ content, fontSize = 16, className = '' }: MathRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const html = useMemo(() => processContent(content || ''), [content]);

  useEffect(() => {
    if (!ref.current) return;
    renderMathInElement(ref.current, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className={`math-renderer ${className}`}
      style={{ fontSize }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
