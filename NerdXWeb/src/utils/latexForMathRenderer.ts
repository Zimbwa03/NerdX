/**
 * Normalize LaTeX in question/solution text so KaTeX can render it.
 * Wraps "naked" LaTeX (e.g. \frac{1}{2}, \sqrt{3}, P \cap Q) in $...$ so
 * the MathRenderer treats it as math. Content already inside $ $ or $$ $$ is left as-is.
 *
 * Covers Mathematics, Sciences, Accounting, and A-Level STEM subjects.
 */
export function normalizeLatexForRender(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // Split by math delimiters so we only wrap LaTeX in plain-text segments
  const segments: { type: 'text' | 'inline' | 'display'; value: string }[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    const dd = remaining.indexOf('$$');
    const d = remaining.indexOf('$');
    const parenL = remaining.indexOf('\\(');
    const bracketL = remaining.indexOf('\\[');

    // Prefer $$ then $ then \( then \[
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

    // ---- Compound commands with braces (common in quiz output) ----
    const patterns: { re: RegExp; display?: boolean }[] = [
      { re: /\\frac\{([^{}]+)\}\{([^{}]+)\}/g },
      { re: /\\dfrac\{([^{}]+)\}\{([^{}]+)\}/g },
      { re: /\\tfrac\{([^{}]+)\}\{([^{}]+)\}/g },
      { re: /\\sqrt(\[[^\]]*\])?\{([^{}]+)\}/g },
      { re: /\\overrightarrow\{([^{}]+)\}/g },
      { re: /\\overleftarrow\{([^{}]+)\}/g },
      { re: /\\overline\{([^{}]+)\}/g },
      { re: /\\underline\{([^{}]+)\}/g },
      { re: /\\widehat\{([^{}]+)\}/g },
      { re: /\\widetilde\{([^{}]+)\}/g },
      { re: /\\bar\{([^{}]+)\}/g },
      { re: /\\hat\{([^{}]+)\}/g },
      { re: /\\tilde\{([^{}]+)\}/g },
      { re: /\\vec\{([^{}]+)\}/g },
      { re: /\\dot\{([^{}]+)\}/g },
      { re: /\\ddot\{([^{}]+)\}/g },
      { re: /\\text\{([^{}]*)\}/g },
      { re: /\\textbf\{([^{}]*)\}/g },
      { re: /\\textit\{([^{}]*)\}/g },
      { re: /\\mathrm\{([^{}]*)\}/g },
      { re: /\\mathbf\{([^{}]*)\}/g },
      { re: /\\mathbb\{([^{}]*)\}/g },
      { re: /\\mathcal\{([^{}]*)\}/g },
      { re: /\\operatorname\{([^{}]*)\}/g },
      { re: /\\binom\{([^{}]+)\}\{([^{}]+)\}/g },
      { re: /\\boxed\{([^{}]+)\}/g },
      // Display-mode environments
      { re: /\\begin\{(pmatrix|bmatrix|vmatrix|matrix|cases|aligned|align|array|equation)\}([\s\S]*?)\\end\{\1\}/g, display: true },
    ];
    patterns.forEach(({ re, display }) => {
      out = out.replace(re, (match) => (display ? `$$${match}$$` : `$${match}$`));
    });

    // ---- Single-symbol commands (no braces) ----
    // Greek letters (lower & upper), operators, relations, arrows, logic, geometry, misc
    out = out.replace(
      /\\(alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|vartheta|iota|kappa|lambda|mu|nu|xi|pi|rho|varrho|sigma|tau|upsilon|phi|varphi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|infty|partial|nabla|emptyset|varnothing|aleph|ell|hbar|imath|jmath|Re|Im|wp|forall|exists|nexists|neg|lnot|land|lor|top|bot|angle|triangle|square|diamond|star|circ|bullet|oplus|ominus|otimes|oslash|odot|dagger|ddagger|vee|wedge|setminus|subset|supset|subseteq|supseteq|nsubseteq|nsupseteq|sqsubset|sqsupset|sqsubseteq|sqsupseteq|in|notin|ni|cap|cup|bigcap|bigcup|uplus|sqcap|sqcup|vdash|dashv|models|perp|mid|parallel|nmid|nparallel|sim|simeq|cong|ncong|approx|equiv|neq|ne|leq|le|geq|ge|ll|gg|prec|succ|preceq|succeq|propto|pm|mp|times|div|cdot|ast|star|circ|bullet|therefore|because|rightarrow|leftarrow|Rightarrow|Leftarrow|leftrightarrow|Leftrightarrow|longrightarrow|longleftarrow|Longrightarrow|Longleftarrow|uparrow|downarrow|Uparrow|Downarrow|nearrow|searrow|swarrow|nwarrow|mapsto|longmapsto|hookrightarrow|hookleftarrow|to|gets|iff|implies|sin|cos|tan|sec|csc|cot|arcsin|arccos|arctan|sinh|cosh|tanh|coth|log|ln|exp|lim|limsup|liminf|sup|inf|min|max|det|gcd|deg|dim|hom|ker|arg|Pr|mod|bmod|pmod|sum|prod|int|iint|iiint|oint|coprod|bigvee|bigwedge|bigoplus|bigotimes|quad|qquad|ldots|cdots|vdots|ddots|colon|backslash)(?![a-zA-Z{])/g,
      '$$&$'
    );

    return out;
  };

  return segments.map((seg) => (seg.type === 'text' ? wrapNaked(seg.value) : seg.value)).join('');
}
