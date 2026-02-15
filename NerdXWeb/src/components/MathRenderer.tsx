/**
 * MathRenderer - Renders Markdown-ish text with LaTeX math using KaTeX.
 * Matches mobile MathRenderer behavior for O-Level Mathematics notes.
 * Normalizes naked LaTeX (e.g. \frac{1}{2}, \cap) so it renders as math.
 *
 * Uses katex.renderToString() directly during HTML generation for reliable
 * rendering that doesn't depend on DOM side-effects or re-render timing.
 */
import { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { normalizeLatexForRender } from '../utils/latexForMathRenderer';

const MATH_PLACEHOLDER = '__MATH__';

function renderKatex(math: string, displayMode: boolean): string {
  try {
    return katex.renderToString(math, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
    });
  } catch {
    // If KaTeX fails, return the raw math wrapped in a span
    return `<span class="katex-error">${math}</span>`;
  }
}

function processContent(content: string): string {
  if (!content) return '';

  // Wrap naked LaTeX in $ $ so KaTeX can render it (e.g. \frac{1}{2}, P \cap Q)
  const normalized = normalizeLatexForRender(content);

  const mathBlocks: { math: string; display: boolean }[] = [];
  const tableBlocks: string[] = [];

  let processed = normalized;

  // Extract display math ($$...$$ or \[...\])
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push({ math: math.trim(), display: true });
    return `${MATH_PLACEHOLDER}${idx}${MATH_PLACEHOLDER}`;
  });
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push({ math: math.trim(), display: true });
    return `${MATH_PLACEHOLDER}${idx}${MATH_PLACEHOLDER}`;
  });

  // Extract inline math ($...$ or \(...\))
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push({ math: math.trim(), display: false });
    return `${MATH_PLACEHOLDER}${idx}${MATH_PLACEHOLDER}`;
  });
  processed = processed.replace(/\$([^$\n]+)\$/g, (_, math) => {
    const idx = mathBlocks.length;
    mathBlocks.push({ math, display: false });
    return `${MATH_PLACEHOLDER}${idx}${MATH_PLACEHOLDER}`;
  });

  // Extract markdown tables BEFORE escaping HTML
  const tableRegex = /(\|[^\n]+\|\r?\n)(\|[-:\s|]+\|\r?\n)((?:\|[^\n]+\|\r?\n?)+)/g;
  processed = processed.replace(tableRegex, (match) => {
    const idx = tableBlocks.length;
    tableBlocks.push(match.trim());
    return `__TABLE__${idx}__TABLE__`;
  });

  // Escape HTML
  processed = processed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Handle blockquotes (> text) before other formatting
  processed = processed.replace(/(?:^|\n)(?:&gt;|>) ([^\n]+)/g, '</p><blockquote class="md-blockquote">$1</blockquote><p>');

  // Markdown formatting (placeholders survive this - they're plain alphanumeric)
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

  // Restore math blocks AFTER markdown — render directly to KaTeX HTML
  // (This avoids KaTeX's complex HTML being corrupted by markdown regexes)
  mathBlocks.forEach((block, idx) => {
    const placeholder = `${MATH_PLACEHOLDER}${idx}${MATH_PLACEHOLDER}`;
    const fixed = block.math.replace(/\\\\/g, '\\');
    const rendered = renderKatex(fixed, block.display);
    processed = processed.replace(placeholder, rendered);
  });

  // Restore and render tables
  tableBlocks.forEach((table, idx) => {
    const tableHtml = renderMarkdownTable(table);
    processed = processed.replace(`__TABLE__${idx}__TABLE__`, tableHtml);
  });

  return `<p>${processed}</p>`;
}

/**
 * Renders a markdown table string to HTML
 */
function renderMarkdownTable(tableStr: string): string {
  const lines = tableStr.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return tableStr;

  const headerCells = lines[0]
    .split('|')
    .slice(1, -1)
    .map(cell => cell.trim());

  const bodyRows = lines.slice(2).map(line => {
    return line
      .split('|')
      .slice(1, -1)
      .map(cell => {
        let cellContent = cell.trim();
        cellContent = cellContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        cellContent = cellContent.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        cellContent = cellContent.replace(/`([^`]+)`/g, '<code>$1</code>');
        return cellContent;
      });
  });

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
  const html = useMemo(() => processContent(content || ''), [content]);

  return (
    <div
      className={`math-renderer ${className}`}
      style={{ fontSize }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
