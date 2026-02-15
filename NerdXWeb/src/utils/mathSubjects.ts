/**
 * Shared utilities for detecting math/STEM subjects and LaTeX content.
 * Used across Quiz, Exam, and Notes pages to decide whether to render
 * content with MathRenderer (KaTeX) instead of plain text.
 */

/** Subjects whose question/solution content may contain LaTeX and should always be rendered with MathRenderer. */
const MATH_RENDER_SUBJECTS = new Set([
  'mathematics',
  'pure_math',
  'a_level_pure_math',
  'a_level_statistics',
  'combined_science',
  'biology',
  'chemistry',
  'physics',
  'a_level_biology',
  'a_level_chemistry',
  'a_level_physics',
  'accounting',
  'computer_science',
  'a_level_computer_science',
]);

/**
 * Returns true if the subject typically contains LaTeX formulas and should
 * be rendered with MathRenderer/KaTeX.
 */
export function isMathRenderSubject(subjectId: string | undefined | null): boolean {
  if (!subjectId) return false;
  return MATH_RENDER_SUBJECTS.has(subjectId);
}

/**
 * Detects whether a string contains LaTeX markup that should be rendered with KaTeX.
 * Comprehensive pattern covering math operators, Greek letters, arrows, delimiters, etc.
 */
export function hasLatex(text: string | undefined | null): boolean {
  if (!text || typeof text !== 'string') return false;
  return /\\\(|\\\[|\$|\\frac|\\sqrt|\\sum|\\int|\\prod|\\lim|\\overrightarrow|\\vec|\\dot|\\binom|\\begin|\\end|\\text|\\mathbf|\\mathbb|\\mathrm|\\operatorname|\\cap|\\cup|\\in|\\notin|\\subseteq|\\subset|\\supset|\\supseteq|\\mid|\\emptyset|\\infty|\\alpha|\\beta|\\gamma|\\delta|\\epsilon|\\varepsilon|\\zeta|\\eta|\\theta|\\vartheta|\\iota|\\kappa|\\lambda|\\mu|\\nu|\\xi|\\pi|\\rho|\\sigma|\\tau|\\upsilon|\\phi|\\varphi|\\chi|\\psi|\\omega|\\Gamma|\\Delta|\\Theta|\\Lambda|\\Xi|\\Pi|\\Sigma|\\Phi|\\Psi|\\Omega|\\sin|\\cos|\\tan|\\sec|\\csc|\\cot|\\log|\\ln|\\exp|\\min|\\max|\\sup|\\inf|\\det|\\gcd|\\mod|\\bmod|\\pmod|\\leq|\\geq|\\neq|\\approx|\\equiv|\\sim|\\simeq|\\cong|\\propto|\\pm|\\mp|\\times|\\div|\\cdot|\\ast|\\star|\\circ|\\bullet|\\oplus|\\otimes|\\rightarrow|\\leftarrow|\\Rightarrow|\\Leftarrow|\\leftrightarrow|\\Leftrightarrow|\\uparrow|\\downarrow|\\mapsto|\\therefore|\\because|\\forall|\\exists|\\neg|\\land|\\lor|\\partial|\\nabla|\\angle|\\triangle|\\square|\\perp|\\parallel|\\cline|\\hline|\\overline|\\underline|\\widehat|\\widetilde|\\bar|\\hat|\\tilde|\\acute|\\grave|\\check|\\breve/.test(text);
}
