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

  // Markdown
  processed = processed
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n## ([^\n]+)/g, '</p><h3>$1</h3><p>')
    .replace(/\n# ([^\n]+)/g, '</p><h2>$1</h2><p>')
    .replace(/\n- /g, '</p><p>• ')
    .replace(/\n(\d+)\. /g, '</p><p>$1. ')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  return `<p>${processed}</p>`;
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
