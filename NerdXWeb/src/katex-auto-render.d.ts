declare module 'katex/dist/contrib/auto-render.mjs' {
  interface AutoRenderOptions {
    delimiters?: Array<{ left: string; right: string; display: boolean }>;
    throwOnError?: boolean;
  }
  function renderMathInElement(element: HTMLElement, options?: AutoRenderOptions): void;
  export default renderMathInElement;
}
