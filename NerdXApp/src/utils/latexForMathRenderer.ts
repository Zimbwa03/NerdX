/**
 * Normalize LaTeX in question/solution text so KaTeX can render it in MathRenderer.
 * Wraps "naked" LaTeX (e.g. \frac{1}{2}, \sqrt{3}, P \cap Q) in $...$ so KaTeX treats it as math.
 */
export function normalizeLatexForRender(text: string): string {
  if (!text || typeof text !== 'string') return '';

  const segments: { type: 'text' | 'inline' | 'display'; value: string }[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    const dd = remaining.indexOf('$$');
    const d = remaining.indexOf('$');
    const parenL = remaining.indexOf('\\(');
    const bracketL = remaining.indexOf('\\[');

    let next = -1;
    let segType: 'text' | 'inline' | 'display' = 'text';
    let endDelim = '';

    if (dd >= 0 && (d < 0 || dd <= d)) {
      next = dd;
      segType = 'display';
      endDelim = '$$';
    } else if (d >= 0) {
      next = d;
      segType = 'inline';
      endDelim = '$';
    } else if (parenL >= 0) {
      next = parenL;
      segType = 'inline';
      endDelim = '\\)';
    } else if (bracketL >= 0) {
      next = bracketL;
      segType = 'display';
      endDelim = '\\]';
    }

    if (next > 0) {
      segments.push({ type: 'text', value: remaining.slice(0, next) });
    }
    if (next < 0) {
      segments.push({ type: 'text', value: remaining });
      break;
    }

    const start = next + (segType === 'display' && remaining.startsWith('$$') ? 2 : 1);
    const endIdx = remaining.indexOf(endDelim, start);
    if (endIdx < 0) {
      segments.push({ type: 'text', value: remaining.slice(0, start) });
      remaining = remaining.slice(start);
      continue;
    }
    const mathContent = remaining.slice(start, endIdx);
    segments.push({ type: segType, value: segType === 'display' ? `$$${mathContent}$$` : `$${mathContent}$` });
    remaining = remaining.slice(endIdx + endDelim.length);
  }

  const wrapNaked = (s: string): string => {
    let out = s;
    const patterns: { re: RegExp; display?: boolean }[] = [
      { re: /\\(frac)\{([^{}]+)\}\{([^{}]+)\}/g },
      { re: /\\(sqrt)(\[[^\]]*\])?\{([^{}]+)\}/g },
      { re: /\\(overrightarrow)\{([^{}]+)\}/g },
      { re: /\\(vec)\{([^{}]+)\}/g },
      { re: /\\(text)\{([^{}]*)\}/g },
      { re: /\\(dot)\{([^{}]+)\}/g },
      { re: /\\(binom)\{([^{}]+)\}\{([^{}]+)\}/g },
      { re: /\\(begin)\{(pmatrix)\}([\s\S]*?)\\(end)\{(pmatrix)\}/g, display: true },
    ];
    patterns.forEach(({ re, display }) => {
      out = out.replace(re, (match) => (display ? `$$${match}$$` : `$${match}$`));
    });
    out = out.replace(/\\(subseteq|subset|alpha|beta|gamma|delta|theta|lambda|pi|sigma|phi|omega|infty|leq|geq|neq|approx|pm|cdot|times|div|in|cup|cap|mid|sin|cos|tan|log|ln|quad|qquad|notin|emptyset|mathbf|mathbb|bar|Rightarrow|rightarrow)(?![a-zA-Z{])/g, '$$&$');
    return out;
  };

  return segments.map((seg) => (seg.type === 'text' ? wrapNaked(seg.value) : seg.value)).join('');
}
