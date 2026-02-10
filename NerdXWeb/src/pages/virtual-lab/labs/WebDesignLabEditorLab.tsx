import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Layout, Sparkles } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import type { WebLanguage } from '../../../types/webDesignLabTypes';
import { WEB_DESIGN_TEMPLATES } from '../../../data/virtualLab/webDesignLab/templates';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Web Design Lab Page</title>
</head>
<body>
  <h1>Welcome to Web Design Lab</h1>
  <p>Edit this HTML to see the changes in the preview.</p>
</body>
</html>
`;

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  margin: 24px;
  background: #f5f7fb;
  color: #1c1c1c;
}

h1 {
  color: #1565c0;
}
`;

const DEFAULT_JS = `// Optional: add interactivity
console.log('Web Design Lab ready');
`;

function injectBeforeClosingTag(source: string, closingTag: string, injection: string): string {
  const idx = source.toLowerCase().lastIndexOf(closingTag.toLowerCase());
  if (idx === -1) return source + '\n' + injection;
  return source.slice(0, idx) + injection + '\n' + source.slice(idx);
}

function buildSrcDoc(html: string, css: string, js: string): string {
  let doc = html && html.trim().length ? html : DEFAULT_HTML;
  const style = css && css.trim().length ? `<style>\n${css}\n</style>` : '';
  const script = js && js.trim().length ? `<script>\n${js}\n</script>` : '';

  if (style) {
    doc = injectBeforeClosingTag(doc, '</head>', style);
  }
  if (script) {
    doc = injectBeforeClosingTag(doc, '</body>', script);
  }

  if (!doc.toLowerCase().includes('<base')) {
    doc = injectBeforeClosingTag(doc, '</head>', '<base target="_blank" />');
  }

  return doc;
}

export function WebDesignLabEditorLab({ simulation }: { simulation: SimulationMetadata }) {
  const [activeLang, setActiveLang] = useState<WebLanguage>('html');
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [quizOpen, setQuizOpen] = useState(false);

  const srcDoc = useMemo(() => buildSrcDoc(html, css, js), [css, html, js]);

  const activeValue = activeLang === 'html' ? html : activeLang === 'css' ? css : js;
  const setActiveValue = (value: string) => {
    if (activeLang === 'html') setHtml(value);
    else if (activeLang === 'css') setCss(value);
    else setJs(value);
  };

  return (
    <div className="subject-page-v2 virtual-lab-sim-page vl-editor-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #00897B, #004D40)' }}>
            <Layout size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid wide">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Templates</div>
            <div className="vl-card-subtitle">Load a syllabus-aligned page, then customise it.</div>
            <div className="vl-template-list">
              {WEB_DESIGN_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="vl-template-btn"
                  onClick={() => {
                    setHtml(t.code);
                    if (t.css !== undefined) setCss(t.css);
                    if (t.js !== undefined) setJs(t.js);
                  }}
                >
                  <div className="vl-template-title">{t.title}</div>
                  <div className="vl-template-desc">{t.description}</div>
                </button>
              ))}
            </div>

            <div className="vl-row">
              <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)}>
                <Sparkles size={16} /> Knowledge check
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Learning Objectives</div>
            <ul className="vl-bullets">
              {simulation.learningObjectives.map((o) => (
                <li key={o.id}>{o.text}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-editor-toolbar">
              <div className="vl-tab-row" role="tablist" aria-label="Editor language">
                {(['html', 'css', 'js'] as WebLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={`vl-tab ${activeLang === lang ? 'active' : ''}`}
                    onClick={() => setActiveLang(lang)}
                    role="tab"
                    aria-selected={activeLang === lang}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="vl-editor-textarea"
              value={activeValue}
              onChange={(e) => setActiveValue(e.target.value)}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Preview</div>
            <div className="vl-card-subtitle">
              <Eye size={14} /> Live preview (sandboxed iframe)
            </div>
            <iframe className="vl-web-preview" sandbox="allow-scripts allow-forms allow-modals allow-popups" srcDoc={srcDoc} title="Web Design Lab Preview" />
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}
