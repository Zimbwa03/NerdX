import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Lightbulb,
  PenLine,
  Sigma,
  Eye,
} from 'lucide-react';
import { MathRenderer } from '../../components/MathRenderer';
import { aLevelPureMathTopics } from '../../data/aLevelPureMath/topics';
import { getALevelPureMathNotes } from '../../data/aLevelPureMath/notes';
import type { MathTopicNotes } from '../../data/mathNotes/types';
import './ALevelPureMathNotesPage.css';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveTopicName(slug: string): string {
  const normalized = slug.toLowerCase();
  const fromName = aLevelPureMathTopics.find((topic) => toSlug(topic.name) === normalized);
  if (fromName) return fromName.name;

  const fromId = aLevelPureMathTopics.find((topic) => toSlug(topic.id) === normalized || topic.id === normalized);
  if (fromId) return fromId.name;

  return slug.replace(/-/g, ' ');
}

function PolynomialDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>End Behaviour Map</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Polynomial end behaviour diagram">
          <line x1="20" y1="90" x2="320" y2="90" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <path d="M 20 140 C 90 30, 250 30, 320 140" className="curve one" />
          <path d="M 20 40 C 100 150, 240 150, 320 40" className="curve two" />
        </svg>
        <p>Even degree: both tails same direction. Positive leading term up-up, negative down-down.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Multiplicity Behaviour</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Root multiplicity behaviour">
          <line x1="20" y1="100" x2="320" y2="100" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <path d="M 20 130 C 70 130, 90 80, 120 80 C 150 80, 170 120, 200 120 C 230 120, 250 70, 320 70" className="curve three" />
          <circle cx="120" cy="80" r="4" className="root-mark" />
          <circle cx="240" cy="100" r="4" className="root-mark" />
        </svg>
        <p>Simple roots cross the axis. Even multiplicity roots touch and turn.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Synthetic Division Flow</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>2</td><td>|</td><td>2</td><td>-3</td><td>5</td><td>-7</td><td>6</td></tr>
            <tr><td></td><td>|</td><td></td><td>4</td><td>2</td><td>14</td><td>14</td></tr>
            <tr><td></td><td>|</td><td>2</td><td>1</td><td>7</td><td>7</td><td>20</td></tr>
          </tbody>
        </table>
        <p>Read bottom row as quotient coefficients, last value as remainder.</p>
      </div>
    </div>
  );
}

function RationalFunctionsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Asymptote Map</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Rational function asymptotes and branches">
          <line x1="20" y1="90" x2="320" y2="90" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <line x1="220" y1="20" x2="220" y2="160" className="asymptote" />
          <line x1="20" y1="55" x2="320" y2="55" className="asymptote" />
          <path d="M 24 132 C 90 126, 170 96, 208 64" className="curve four" />
          <path d="M 232 150 C 246 96, 286 74, 320 64" className="curve four" />
        </svg>
        <p>Dashed lines show vertical and horizontal asymptotes. Branches approach but do not cross them.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Partial Fractions Templates</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Distinct</td><td><MathRenderer content="$\\frac{A}{x-a}+\\frac{B}{x-b}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Repeated</td><td><MathRenderer content="$\\frac{A}{x-a}+\\frac{B}{(x-a)^2}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Quadratic</td><td><MathRenderer content="$\\frac{Ax+B}{x^2+px+q}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Mixed</td><td>Combine all required forms</td></tr>
          </tbody>
        </table>
        <p>Select structure first, then solve coefficients by substitution and comparison.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Rational Inequality Sign Chart</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Sign chart across critical points">
          <line x1="28" y1="92" x2="312" y2="92" />
          <circle cx="110" cy="92" r="4" className="root-mark" />
          <circle cx="220" cy="92" r="4" className="root-mark hollow" />
          <text x="78" y="120" className="diagram-text">+</text>
          <text x="162" y="120" className="diagram-text">-</text>
          <text x="262" y="120" className="diagram-text">+</text>
          <text x="97" y="82" className="diagram-label">x = 1</text>
          <text x="202" y="82" className="diagram-label">x = -2</text>
        </svg>
        <p>Include zeros and undefined points, then test intervals to solve inequalities safely.</p>
      </div>
    </div>
  );
}

function IndicesSurdsLogsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Exponential vs Log Inverse</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Exponential and logarithmic inverse curves">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="40" y1="20" x2="40" y2="160" />
          <line x1="40" y1="145" x2="300" y2="40" className="diag-mirror" />
          <path d="M 44 138 C 90 132, 130 118, 170 92 C 208 68, 244 50, 300 34" className="curve five" />
          <path d="M 44 40 C 96 54, 154 82, 204 112 C 248 130, 278 136, 316 138" className="curve six" />
        </svg>
        <MathRenderer content="The curves mirror each other around $y=x$, showing inverse behaviour of $a^x$ and $\\log_a x$." fontSize={12} className="alevel-inline-math alevel-diagram-caption" />
      </div>

      <div className="alevel-diagram-card">
        <h4>Surd Rationalisation Flow</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Conjugate rationalisation flow chart">
          <rect x="18" y="20" width="142" height="34" rx="8" className="diagram-rect" />
          <rect x="180" y="20" width="142" height="34" rx="8" className="diagram-rect" />
          <rect x="98" y="112" width="142" height="34" rx="8" className="diagram-rect" />
          <line x1="160" y1="37" x2="180" y2="37" className="diagram-arrow" />
          <line x1="250" y1="54" x2="170" y2="112" className="diagram-arrow" />
          <line x1="90" y1="54" x2="150" y2="112" className="diagram-arrow" />
          <text x="30" y="41" className="diagram-label">a + sqrt(b) in denominator</text>
          <text x="192" y="41" className="diagram-label">Multiply by a - sqrt(b)</text>
          <text x="111" y="133" className="diagram-label">Denominator: a^2 - b (rational)</text>
        </svg>
        <p>Use conjugates to remove surds from denominators while preserving value.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Log Law Network</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Product</td><td><MathRenderer content="$\\log_a(xy)=\\log_a x+\\log_a y$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Quotient</td><td><MathRenderer content="$\\log_a(x/y)=\\log_a x-\\log_a y$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Power</td><td><MathRenderer content="$\\log_a(x^k)=k\\log_a x$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Change base</td><td><MathRenderer content="$\\log_a b=\\frac{\\log_c b}{\\log_c a}$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Convert everything to one base before evaluation or comparison.</p>
      </div>
    </div>
  );
}

function QuadraticFunctionsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Parabola Family and Vertex Shift</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Parabola family with translated vertices">
          <line x1="20" y1="92" x2="320" y2="92" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <path d="M 40 150 C 95 48, 125 48, 170 150" className="curve seven" />
          <path d="M 178 35 C 216 114, 260 114, 300 35" className="curve eight" />
          <circle cx="106" cy="64" r="4" className="vertex-mark" />
          <circle cx="240" cy="112" r="4" className="vertex-mark alt" />
        </svg>
        <MathRenderer content="Vertex form shifts parabola position while coefficient $a$ controls opening and stretch." fontSize={12} className="alevel-inline-math alevel-diagram-caption" />
      </div>

      <div className="alevel-diagram-card">
        <h4>Discriminant Map</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Discriminant cases and root count">
          <line x1="28" y1="95" x2="312" y2="95" />
          <path d="M 38 145 C 86 55, 124 55, 168 145" className="curve seven" />
          <path d="M 180 95 C 210 55, 230 55, 260 95" className="curve nine" />
          <path d="M 270 130 C 294 88, 306 88, 320 130" className="curve ten" />
          <text x="44" y="160" className="diagram-label">Delta &gt; 0</text>
          <text x="182" y="160" className="diagram-label">Delta = 0</text>
          <text x="268" y="160" className="diagram-label">Delta &lt; 0</text>
        </svg>
        <p>Delta determines whether the graph intersects twice, touches once, or misses the x-axis.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Quadratic Sign Regions</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Sign chart for quadratic inequality">
          <line x1="28" y1="92" x2="312" y2="92" />
          <circle cx="120" cy="92" r="4" className="root-mark" />
          <circle cx="220" cy="92" r="4" className="root-mark" />
          <text x="70" y="122" className="diagram-text">+</text>
          <text x="168" y="122" className="diagram-text">-</text>
          <text x="266" y="122" className="diagram-text">+</text>
          <text x="109" y="82" className="diagram-label">x = r1</text>
          <text x="209" y="82" className="diagram-label">x = r2</text>
        </svg>
        <p>For upward parabolas, sign is positive outside roots and negative between them.</p>
      </div>
    </div>
  );
}

function FunctionsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Function Mapping Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Mapping matrix between domain and codomain">
          <rect x="28" y="24" width="92" height="130" rx="10" className="diagram-rect" />
          <rect x="220" y="24" width="92" height="130" rx="10" className="diagram-rect" />
          <circle cx="74" cy="54" r="4" className="vertex-mark" />
          <circle cx="74" cy="89" r="4" className="vertex-mark" />
          <circle cx="74" cy="124" r="4" className="vertex-mark" />
          <circle cx="266" cy="63" r="4" className="vertex-mark alt" />
          <circle cx="266" cy="104" r="4" className="vertex-mark alt" />
          <line x1="78" y1="54" x2="262" y2="63" className="diagram-arrow" />
          <line x1="78" y1="89" x2="262" y2="63" className="diagram-arrow" />
          <line x1="78" y1="124" x2="262" y2="104" className="diagram-arrow" />
          <text x="46" y="42" className="diagram-label">Domain</text>
          <text x="236" y="42" className="diagram-label">Codomain</text>
        </svg>
        <p>Every input row maps to exactly one output column. Many-to-one mappings are valid.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Inverse Reflection (y = x)</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Function and inverse reflection across y equals x">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="40" y1="20" x2="40" y2="160" />
          <line x1="40" y1="145" x2="295" y2="35" className="diag-mirror" />
          <path d="M 48 130 C 92 114, 120 84, 152 52" className="curve eleven" />
          <path d="M 55 58 C 88 92, 123 116, 166 132" className="curve twelve" />
        </svg>
        <MathRenderer content="Graph of $f^{-1}$ is the mirror image of $f$ in the line $y=x$." fontSize={12} className="alevel-inline-math alevel-diagram-caption" />
      </div>

      <div className="alevel-diagram-card">
        <h4>Transformation Parameter Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>a</td><td>vertical scale / x-axis reflection</td></tr>
            <tr><td>b</td><td>horizontal scale 1/|b| / y-axis reflection</td></tr>
            <tr><td>c</td><td>horizontal shift (x-c)</td></tr>
            <tr><td>d</td><td>vertical shift +d</td></tr>
            <tr><td>Form</td><td>y = a f(b(x-c)) + d</td></tr>
          </tbody>
        </table>
        <p>Read inside first (x changes), then outside (y changes).</p>
      </div>
    </div>
  );
}

function CoordinateGeometryDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Line Relation Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Parallel and perpendicular line relations">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="38" y1="20" x2="38" y2="160" />
          <path d="M 36 130 L 290 52" className="curve thirteen" />
          <path d="M 36 112 L 290 34" className="curve thirteen" />
          <path d="M 90 156 L 208 24" className="curve fourteen" />
          <text x="216" y="26" className="diagram-label">m1 * m2 = -1</text>
          <text x="210" y="66" className="diagram-label">m1 = m2</text>
        </svg>
        <p>Two equal gradients give parallel lines; negative reciprocal gradients give perpendicular lines.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Circle-Tangent-Radius Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Circle with radius and tangent at contact point">
          <line x1="24" y1="145" x2="320" y2="145" />
          <line x1="170" y1="18" x2="170" y2="160" />
          <circle cx="170" cy="92" r="54" className="curve fourteen" />
          <line x1="170" y1="92" x2="216" y2="64" className="diagram-arrow" />
          <line x1="196" y1="30" x2="244" y2="112" className="curve fifteen" />
          <circle cx="216" cy="64" r="4" className="root-mark" />
          <text x="224" y="61" className="diagram-label">Tangent</text>
          <text x="120" y="98" className="diagram-label">Radius</text>
        </svg>
        <p>At the contact point, radius and tangent are perpendicular.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Distance and Intercept Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Line</td><td>ax + by + c = 0</td></tr>
            <tr><td>Point</td><td>(x0, y0)</td></tr>
            <tr><td>Distance</td><td>|ax0 + by0 + c| / sqrt(a^2 + b^2)</td></tr>
            <tr><td>x-int</td><td>-c/a</td></tr>
            <tr><td>y-int</td><td>-c/b</td></tr>
          </tbody>
        </table>
        <p>Keep these five entries together to solve most straight-line exam tasks rapidly.</p>
      </div>
    </div>
  );
}

function SequencesSeriesDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>AP vs GP Growth Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Arithmetic versus geometric growth curves">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="38" y1="20" x2="38" y2="160" />
          <path d="M 42 134 L 88 122 L 136 110 L 184 98 L 232 86 L 280 74" className="curve sixteen" />
          <path d="M 42 134 C 82 131, 118 124, 152 112 C 192 94, 228 70, 280 30" className="curve seventeen" />
          <text x="228" y="76" className="diagram-label">AP</text>
          <text x="284" y="34" className="diagram-label">GP</text>
        </svg>
        <p>AP rises by fixed steps, while GP bends upward due to multiplicative growth.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Sigma Decomposition Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Break</td><td><MathRenderer content="$\\sum(au_r+bv_r)=a\\sum u_r+b\\sum v_r$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Linear</td><td><MathRenderer content="$\\sum_{r=1}^{n} r=\\frac{n(n+1)}{2}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Squares</td><td><MathRenderer content="$\\sum_{r=1}^{n} r^2=\\frac{n(n+1)(2n+1)}{6}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Cubes</td><td><MathRenderer content="$\\sum_{r=1}^{n} r^3=\\left(\\frac{n(n+1)}{2}\\right)^2$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Convert complex sums into known sigma blocks first, then simplify.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Recurrence Convergence Map</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Convergence rules for first-order recurrence">
          <rect x="24" y="24" width="294" height="130" rx="10" className="diagram-rect" />
          <text x="42" y="52" className="diagram-label">u(n+1) = a*u(n) + b</text>
          <text x="42" y="80" className="diagram-label">|a| &lt; 1  =&gt; converges to b/(1-a)</text>
          <text x="42" y="106" className="diagram-label">|a| &gt; 1  =&gt; diverges</text>
          <text x="42" y="132" className="diagram-label">a = -1 =&gt; alternating behavior</text>
        </svg>
        <p>Fixed-point and coefficient size determine long-term sequence behavior.</p>
      </div>
    </div>
  );
}

function BinomialTheoremDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Pascal Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Pascal triangle layout">
          <text x="160" y="30" className="diagram-label">1</text>
          <text x="142" y="52" className="diagram-label">1</text>
          <text x="180" y="52" className="diagram-label">1</text>
          <text x="124" y="74" className="diagram-label">1</text>
          <text x="160" y="74" className="diagram-label">2</text>
          <text x="198" y="74" className="diagram-label">1</text>
          <text x="106" y="96" className="diagram-label">1</text>
          <text x="142" y="96" className="diagram-label">3</text>
          <text x="178" y="96" className="diagram-label">3</text>
          <text x="214" y="96" className="diagram-label">1</text>
          <text x="88" y="118" className="diagram-label">1</text>
          <text x="124" y="118" className="diagram-label">4</text>
          <text x="160" y="118" className="diagram-label">6</text>
          <text x="196" y="118" className="diagram-label">4</text>
          <text x="232" y="118" className="diagram-label">1</text>
        </svg>
        <p>Each interior value is the sum of the two values above it.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>General Term Power Tracker</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Form</td><td><MathRenderer content="$T_{r+1}=\\binom{n}{r}a^{n-r}b^r$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>x-power</td><td>derive from factor powers</td></tr>
            <tr><td>Target</td><td>set power = required exponent</td></tr>
            <tr><td>Check</td><td>r must be integer in [0,n]</td></tr>
          </tbody>
        </table>
        <p>Power tracking avoids expansion of all terms when only one coefficient is needed.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Non-Integer Validity Band</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Interval of validity for binomial series">
          <line x1="30" y1="94" x2="312" y2="94" />
          <circle cx="90" cy="94" r="5" className="root-mark hollow" />
          <circle cx="250" cy="94" r="5" className="root-mark hollow" />
          <text x="82" y="84" className="diagram-label">-1</text>
          <text x="245" y="84" className="diagram-label">1</text>
          <line x1="96" y1="94" x2="244" y2="94" className="curve eighteen" />
          <text x="120" y="122" className="diagram-label">valid interval: |x| &lt; 1</text>
        </svg>
        <p>For non-integer powers, convergence requires the expansion variable to stay inside the open interval.</p>
      </div>
    </div>
  );
}

function TrigonometryDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Unit Circle Sign Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Unit circle with quadrant sign guide">
          <line x1="24" y1="92" x2="316" y2="92" />
          <line x1="170" y1="20" x2="170" y2="164" />
          <circle cx="170" cy="92" r="56" className="curve nineteen" />
          <text x="210" y="58" className="diagram-label">QI (+,+)</text>
          <text x="110" y="58" className="diagram-label">QII (+,-)</text>
          <text x="104" y="132" className="diagram-label">QIII (-,-)</text>
          <text x="208" y="132" className="diagram-label">QIV (-,+)</text>
        </svg>
        <p>Use quadrant signs after getting reference angle values from standard angles.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Sine-Cosine Wave Overlay</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Sine and cosine wave overlay">
          <line x1="20" y1="92" x2="320" y2="92" />
          <path d="M 20 92 C 45 38, 70 38, 95 92 C 120 146, 145 146, 170 92 C 195 38, 220 38, 245 92 C 270 146, 295 146, 320 92" className="curve twenty" />
          <path d="M 20 42 C 45 42, 70 72, 95 92 C 120 112, 145 142, 170 142 C 195 142, 220 112, 245 92 C 270 72, 295 42, 320 42" className="curve twentyone" />
          <text x="26" y="36" className="diagram-label">cos x</text>
          <text x="26" y="156" className="diagram-label">sin x</text>
        </svg>
        <p>Overlay helps compare phase shift and shared periodicity of trig functions.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>R-Alpha Conversion Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Expression</td><td><MathRenderer content="$a\\sin x+b\\cos x$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Form</td><td><MathRenderer content="$R\\sin(x+\\alpha)$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Amplitude</td><td><MathRenderer content="$R=\\sqrt{a^2+b^2}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Matching</td><td><MathRenderer content="$R\\cos\\alpha=a,\\ R\\sin\\alpha=b$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Convert first, then solve trig equations using one sinusoid instead of two terms.</p>
      </div>
    </div>
  );
}

function FurtherTrigonometryDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Identity Transformation Network</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Network of trig identity transformations">
          <rect x="20" y="24" width="96" height="34" rx="8" className="diagram-rect" />
          <rect x="124" y="24" width="96" height="34" rx="8" className="diagram-rect" />
          <rect x="228" y="24" width="96" height="34" rx="8" className="diagram-rect" />
          <rect x="72" y="112" width="96" height="34" rx="8" className="diagram-rect" />
          <rect x="176" y="112" width="96" height="34" rx="8" className="diagram-rect" />
          <line x1="116" y1="41" x2="124" y2="41" className="diagram-arrow" />
          <line x1="220" y1="41" x2="228" y2="41" className="diagram-arrow" />
          <line x1="274" y1="58" x2="220" y2="112" className="diagram-arrow" />
          <line x1="62" y1="58" x2="118" y2="112" className="diagram-arrow" />
          <text x="34" y="44" className="diagram-label">sum forms</text>
          <text x="134" y="44" className="diagram-label">double-angle</text>
          <text x="238" y="44" className="diagram-label">product forms</text>
          <text x="84" y="132" className="diagram-label">factorize</text>
          <text x="196" y="132" className="diagram-label">solve</text>
        </svg>
        <p>Use transformations as a structured network to convert hard forms into solvable forms.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Principal Range Map</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td><MathRenderer content="$\\sin^{-1}x$" fontSize={12} className="alevel-inline-math" /></td><td><MathRenderer content="$\\left[-\\frac\\pi2,\\frac\\pi2\\right]$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td><MathRenderer content="$\\cos^{-1}x$" fontSize={12} className="alevel-inline-math" /></td><td><MathRenderer content="$[0,\\pi]$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td><MathRenderer content="$\\tan^{-1}x$" fontSize={12} className="alevel-inline-math" /></td><td><MathRenderer content="$\\left(-\\frac\\pi2,\\frac\\pi2\\right)$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Principal ranges determine the correct inverse-trigonometric output angle.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Advanced Equation Interval Strip</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Interval strip with accepted trig roots">
          <line x1="30" y1="92" x2="310" y2="92" />
          <circle cx="50" cy="92" r="4" className="root-mark" />
          <circle cx="112" cy="92" r="4" className="root-mark" />
          <circle cx="174" cy="92" r="4" className="root-mark" />
          <circle cx="236" cy="92" r="4" className="root-mark" />
          <circle cx="298" cy="92" r="4" className="root-mark" />
          <path d="M 50 116 C 84 62, 142 62, 174 116 C 208 62, 266 62, 298 116" className="curve twentyfive" />
          <text x="38" y="82" className="diagram-label">0</text>
          <text x="100" y="82" className="diagram-label">pi/3</text>
          <text x="166" y="82" className="diagram-label">pi</text>
          <text x="224" y="82" className="diagram-label">5pi/3</text>
          <text x="286" y="82" className="diagram-label">2pi</text>
        </svg>
        <p>Plot candidate roots on the interval first, then keep only those satisfying the original equation.</p>
      </div>
    </div>
  );
}

function HyperbolicFunctionsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>sinh-cosh Shape Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Hyperbolic sine and cosine curves">
          <line x1="20" y1="90" x2="320" y2="90" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <path d="M 30 142 C 86 128, 130 108, 170 90 C 210 72, 254 52, 310 38" className="curve twentysix" />
          <path d="M 30 38 C 90 84, 132 96, 170 96 C 208 96, 250 84, 310 38" className="curve twentyseven" />
          <text x="286" y="34" className="diagram-label">cosh x</text>
          <text x="286" y="52" className="diagram-label">sinh x</text>
        </svg>
        <MathRenderer content="$\\cosh x$ is even with minimum at 1, while $\\sinh x$ is odd and crosses the origin." fontSize={12} className="alevel-inline-math alevel-diagram-caption" />
      </div>

      <div className="alevel-diagram-card">
        <h4>Identity and Calculus Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Identity</td><td><MathRenderer content="$\\cosh^2x-\\sinh^2x=1$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Derivative</td><td><MathRenderer content="$\\frac{d}{dx}(\\sinh x)=\\cosh x$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Derivative</td><td><MathRenderer content="$\\frac{d}{dx}(\\cosh x)=\\sinh x$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Integral</td><td><MathRenderer content="$\\int\\sinh x\\,dx=\\cosh x+C$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Hyperbolic calculus behaves like a paired system with swapped derivatives.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Inverse Hyperbolic Domain Map</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Principal domains for inverse hyperbolic functions">
          <line x1="26" y1="58" x2="314" y2="58" />
          <line x1="26" y1="96" x2="314" y2="96" />
          <line x1="26" y1="134" x2="314" y2="134" />
          <text x="34" y="50" className="diagram-label">asinh x: all real x</text>
          <text x="34" y="88" className="diagram-label">acosh x: x &gt;= 1</text>
          <text x="34" y="126" className="diagram-label">atanh x: |x| &lt; 1</text>
          <circle cx="124" cy="96" r="4" className="root-mark" />
          <circle cx="92" cy="134" r="4" className="root-mark hollow" />
          <circle cx="156" cy="134" r="4" className="root-mark hollow" />
          <text x="118" y="112" className="diagram-label">1</text>
          <text x="84" y="150" className="diagram-label">-1</text>
          <text x="152" y="150" className="diagram-label">1</text>
        </svg>
        <p>Domain restrictions are essential when solving equations with inverse hyperbolic functions.</p>
      </div>
    </div>
  );
}

function FurtherDifferentiationDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Parametric Tangent-Normal Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Parametric curve with tangent and normal frame">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="46" y1="20" x2="46" y2="160" />
          <path d="M 52 136 C 92 128, 132 96, 176 82 C 222 66, 268 74, 310 108" className="curve twentyeight" />
          <line x1="134" y1="118" x2="252" y2="48" className="curve twentynine" />
          <line x1="206" y1="30" x2="142" y2="150" className="curve thirty" />
          <circle cx="186" cy="84" r="4" className="vertex-mark" />
          <text x="252" y="46" className="diagram-label">tangent</text>
          <text x="140" y="152" className="diagram-label">normal</text>
          <text x="190" y="74" className="diagram-label">P(t)</text>
        </svg>
        <MathRenderer content="$\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$ gives tangent slope, and normal slope is $-\\frac{1}{m_t}$." fontSize={12} className="alevel-inline-math alevel-diagram-caption" />
      </div>

      <div className="alevel-diagram-card">
        <h4>Curvature and Series Control</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Second parametric derivative</td><td><MathRenderer content="$\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}(dy/dx)}{dx/dt}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Maclaurin</td><td><MathRenderer content="$f(x)=\\sum\\limits_{n=0}^{\\infty}\\frac{f^{(n)}(0)}{n!}x^n$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Small-angle</td><td><MathRenderer content="$\\sin x\\approx x,\\ \\cos x\\approx 1-\\frac{x^2}{2}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>LHopital trigger</td><td><MathRenderer content="$\\frac{0}{0}$ or $\\frac{\\infty}{\\infty}$ only" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>This matrix connects derivatives, local approximations, and limit tools in one workflow.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Method Decision Flow</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Decision flow for limits and approximations">
          <rect x="18" y="24" width="98" height="30" rx="8" className="diagram-rect" />
          <rect x="128" y="24" width="98" height="30" rx="8" className="diagram-rect" />
          <rect x="238" y="24" width="84" height="30" rx="8" className="diagram-rect" />
          <rect x="74" y="112" width="92" height="30" rx="8" className="diagram-rect" />
          <rect x="184" y="112" width="118" height="30" rx="8" className="diagram-rect" />
          <line x1="116" y1="39" x2="128" y2="39" className="diagram-arrow" />
          <line x1="226" y1="39" x2="238" y2="39" className="diagram-arrow" />
          <line x1="270" y1="54" x2="234" y2="112" className="diagram-arrow" />
          <line x1="66" y1="54" x2="118" y2="112" className="diagram-arrow" />
          <text x="26" y="44" className="diagram-label">substitute</text>
          <text x="142" y="44" className="diagram-label">indeterminate?</text>
          <text x="248" y="44" className="diagram-label">LHopital</text>
          <text x="92" y="132" className="diagram-label">series</text>
          <text x="196" y="132" className="diagram-label">final exact form</text>
        </svg>
        <p>Choose method by form first, then compute with consistent notation and checks.</p>
      </div>
    </div>
  );
}

function DifferentiationDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Derivative Rule Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Power</td><td><MathRenderer content="$\\frac{d}{dx}(x^n)=nx^{n-1}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Product</td><td><MathRenderer content="$(uv)'=u'v+uv'$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Quotient</td><td><MathRenderer content="$\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Chain</td><td><MathRenderer content="$\\frac{d}{dx}f(g(x))=f'(g(x))g'(x)$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Choose the structure first, then apply the matching rule cleanly.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Tangent-Normal Geometry</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Curve with tangent and normal at point of contact">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <path d="M 30 136 C 86 130, 128 102, 162 84 C 202 62, 248 54, 312 58" className="curve twentytwo" />
          <line x1="120" y1="118" x2="262" y2="38" className="curve twentythree" />
          <line x1="190" y1="20" x2="130" y2="150" className="curve twentyfour" />
          <circle cx="178" cy="86" r="4" className="vertex-mark" />
          <text x="260" y="40" className="diagram-label">tangent</text>
          <text x="116" y="150" className="diagram-label">normal</text>
        </svg>
        <p>Tangent uses $f'(a)$ while normal uses the negative reciprocal slope.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Stationary Point Classifier</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Second derivative test map">
          <rect x="24" y="24" width="294" height="130" rx="10" className="diagram-rect" />
          <text x="42" y="56" className="diagram-label">f'(x)=0  =&gt; stationary point</text>
          <text x="42" y="84" className="diagram-label">f''(x) &gt; 0 =&gt; local minimum</text>
          <text x="42" y="110" className="diagram-label">f''(x) &lt; 0 =&gt; local maximum</text>
          <text x="42" y="136" className="diagram-label">f''(x)=0  =&gt; further check needed</text>
        </svg>
        <p>Second derivative test gives fast local classification after solving $f'(x)=0$.</p>
      </div>
    </div>
  );
}

function ApplicationsOfDifferentiationDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Optimization Pipeline</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Optimization flow from model to conclusion">
          <rect x="18" y="24" width="92" height="30" rx="8" className="diagram-rect" />
          <rect x="124" y="24" width="92" height="30" rx="8" className="diagram-rect" />
          <rect x="230" y="24" width="92" height="30" rx="8" className="diagram-rect" />
          <rect x="72" y="112" width="92" height="30" rx="8" className="diagram-rect" />
          <rect x="178" y="112" width="92" height="30" rx="8" className="diagram-rect" />
          <line x1="110" y1="39" x2="124" y2="39" className="diagram-arrow" />
          <line x1="216" y1="39" x2="230" y2="39" className="diagram-arrow" />
          <line x1="276" y1="54" x2="220" y2="112" className="diagram-arrow" />
          <line x1="64" y1="54" x2="116" y2="112" className="diagram-arrow" />
          <text x="36" y="43" className="diagram-label">Model</text>
          <text x="148" y="43" className="diagram-label">f'(x)=0</text>
          <text x="250" y="43" className="diagram-label">Test</text>
          <text x="90" y="131" className="diagram-label">Domain</text>
          <text x="198" y="131" className="diagram-label">Conclusion</text>
        </svg>
        <p>Applied optimization is a full process, not only solving $f'(x)=0$.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Profit Peak Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Profit curve with peak and marginal zero">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="40" y1="20" x2="40" y2="160" />
          <path d="M 52 134 C 110 62, 180 44, 286 136" className="curve twentythree" />
          <line x1="164" y1="30" x2="164" y2="145" className="asymptote" />
          <circle cx="164" cy="60" r="4" className="vertex-mark" />
          <text x="170" y="56" className="diagram-label">P max</text>
          <text x="138" y="156" className="diagram-label">P'(x)=0</text>
        </svg>
        <p>Peak profit occurs where marginal profit is zero and curvature confirms a maximum.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Rates Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Displacement</td><td><MathRenderer content="$s(t)$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Velocity</td><td><MathRenderer content="$v(t)=\\frac{ds}{dt}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Acceleration</td><td><MathRenderer content="$a(t)=\\frac{d^2s}{dt^2}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Interpretation</td><td>Sign and units matter</td></tr>
          </tbody>
        </table>
        <p>Context questions require both derivative values and clear physical meaning.</p>
      </div>
    </div>
  );
}

function IntegrationDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Method Selection Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Power form</td><td><MathRenderer content="$\\int x^n\\,dx$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Inner-derivative pair</td><td>Substitution</td></tr>
            <tr><td>Product mix</td><td>Integration by parts</td></tr>
            <tr><td>Fixed limits</td><td><MathRenderer content="$F(b)-F(a)$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Choose method by structure before integrating to avoid unnecessary algebra.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Area Between Curves</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Area between two curves with limits">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="44" y1="20" x2="44" y2="160" />
          <path d="M 44 132 C 88 104, 140 78, 202 62 C 244 52, 282 58, 320 76" className="curve twentytwo" />
          <path d="M 44 128 C 90 126, 142 118, 200 104 C 252 94, 286 96, 320 104" className="curve twentyfour" />
          <line x1="122" y1="58" x2="122" y2="145" className="asymptote" />
          <line x1="252" y1="52" x2="252" y2="145" className="asymptote" />
          <text x="110" y="156" className="diagram-label">x=a</text>
          <text x="242" y="156" className="diagram-label">x=b</text>
        </svg>
        <p>Compute area with top-minus-bottom over the exact intersection limits.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Substitution Flow</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Integration substitution workflow">
          <rect x="22" y="30" width="90" height="34" rx="8" className="diagram-rect" />
          <rect x="126" y="30" width="90" height="34" rx="8" className="diagram-rect" />
          <rect x="230" y="30" width="90" height="34" rx="8" className="diagram-rect" />
          <rect x="126" y="114" width="90" height="34" rx="8" className="diagram-rect" />
          <line x1="112" y1="47" x2="126" y2="47" className="diagram-arrow" />
          <line x1="216" y1="47" x2="230" y2="47" className="diagram-arrow" />
          <line x1="274" y1="64" x2="172" y2="114" className="diagram-arrow" />
          <text x="42" y="50" className="diagram-label">set u</text>
          <text x="140" y="50" className="diagram-label">du map</text>
          <text x="244" y="50" className="diagram-label">integrate</text>
          <text x="144" y="134" className="diagram-label">back-substitute</text>
        </svg>
        <p>Clean substitution keeps steps ordered and reduces chain-rule reversal mistakes.</p>
      </div>
    </div>
  );
}

function FurtherIntegrationTechniquesDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Advanced Method Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Rational proper</td><td>Partial fractions</td></tr>
            <tr><td>Product structure</td><td>By parts / tabular</td></tr>
            <tr><td>Radical form</td><td>Trig substitution</td></tr>
            <tr><td>High power family</td><td>Reduction formula</td></tr>
            <tr><td>Infinite / singular</td><td>Improper limit test</td></tr>
          </tbody>
        </table>
        <MathRenderer content="Choose method from structure first, then compute with exact algebra and controlled simplification." fontSize={12} className="alevel-inline-math alevel-diagram-caption" />
      </div>

      <div className="alevel-diagram-card">
        <h4>Trapezium vs Simpson Overlay</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Comparison of trapezium and Simpson approximations on a curve">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="44" y1="20" x2="44" y2="160" />
          <path d="M 44 136 C 96 112, 146 82, 204 62 C 250 48, 286 52, 320 66" className="curve thirtyone" />
          <path d="M 44 136 L 96 112 L 146 86 L 204 66 L 258 56 L 320 66" className="curve thirtytwo" />
          <path d="M 44 136 Q 96 110 146 86 Q 204 62 258 56 Q 292 58 320 66" className="curve thirtythree" />
          <text x="250" y="48" className="diagram-label">true curve</text>
          <text x="248" y="84" className="diagram-label">trapezium</text>
          <text x="248" y="102" className="diagram-label">Simpson</text>
        </svg>
        <p>For smooth curvature, Simpson typically tracks the true area more closely than trapezium.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Improper Integral Convergence Flow</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Flowchart for deciding convergence of improper integrals">
          <rect x="18" y="24" width="96" height="30" rx="8" className="diagram-rect" />
          <rect x="126" y="24" width="96" height="30" rx="8" className="diagram-rect" />
          <rect x="234" y="24" width="88" height="30" rx="8" className="diagram-rect" />
          <rect x="74" y="112" width="104" height="30" rx="8" className="diagram-rect" />
          <rect x="192" y="112" width="118" height="30" rx="8" className="diagram-rect" />
          <line x1="114" y1="39" x2="126" y2="39" className="diagram-arrow" />
          <line x1="222" y1="39" x2="234" y2="39" className="diagram-arrow" />
          <line x1="276" y1="54" x2="246" y2="112" className="diagram-arrow" />
          <line x1="66" y1="54" x2="126" y2="112" className="diagram-arrow" />
          <text x="28" y="43" className="diagram-label">write limit</text>
          <text x="142" y="43" className="diagram-label">evaluate</text>
          <text x="244" y="43" className="diagram-label">finite?</text>
          <text x="88" y="132" className="diagram-label">diverges</text>
          <text x="204" y="132" className="diagram-label">converges value</text>
        </svg>
        <p>Improper integration must end with a formal convergence decision, not only a computed expression.</p>
      </div>
    </div>
  );
}

function DifferentialEquationsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Characteristic Root Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Distinct real</td><td><MathRenderer content="$y=Ae^{m_1x}+Be^{m_2x}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Repeated real</td><td><MathRenderer content="$y=(A+Bx)e^{mx}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Complex roots</td><td><MathRenderer content="$y=e^{px}(A\\cos qx+B\\sin qx)$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Full model</td><td><MathRenderer content="$y=y_{CF}+y_{PI}$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Use the root type of the characteristic equation to select the exact complementary form.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Growth-Decay Family</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Exponential growth and decay comparison curves">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="44" y1="20" x2="44" y2="160" />
          <path d="M 44 138 C 104 122, 164 96, 232 64 C 268 48, 292 40, 320 34" className="curve thirtyfour" />
          <path d="M 44 52 C 98 66, 152 84, 214 106 C 262 124, 292 134, 320 140" className="curve thirtyfive" />
          <path d="M 44 98 C 108 98, 176 98, 248 98 C 280 98, 300 98, 320 98" className="curve thirtysix" />
          <text x="278" y="34" className="diagram-label">k &gt; 0</text>
          <text x="278" y="140" className="diagram-label">k &lt; 0</text>
          <text x="268" y="94" className="diagram-label">k = 0</text>
        </svg>
        <p>In $\\frac{dN}{dt}=kN$, the sign of $k$ controls growth, decay, or equilibrium behavior.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>SHM and Damping View</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Simple harmonic and damped oscillation comparison">
          <line x1="20" y1="92" x2="320" y2="92" />
          <path d="M 30 92 C 52 44, 76 140, 100 92 C 124 44, 148 140, 172 92 C 196 44, 220 140, 244 92 C 268 44, 292 140, 314 92" className="curve thirtyseven" />
          <path d="M 30 92 C 52 58, 76 126, 100 92 C 124 64, 148 120, 172 92 C 196 70, 220 114, 244 92 C 268 76, 292 108, 314 92" className="curve thirtyeight" />
          <line x1="30" y1="62" x2="314" y2="82" className="asymptote" />
          <line x1="30" y1="122" x2="314" y2="102" className="asymptote" />
          <text x="228" y="46" className="diagram-label">undamped</text>
          <text x="228" y="66" className="diagram-label">damped</text>
        </svg>
        <p>Second-order models show persistent oscillation in SHM and amplitude shrinkage under damping.</p>
      </div>
    </div>
  );
}

function ComplexNumbersDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Argand Locus Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Argand locus with circle and bisector">
          <line x1="20" y1="92" x2="320" y2="92" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <circle cx="226" cy="62" r="34" className="curve thirtynine" />
          <line x1="48" y1="24" x2="292" y2="160" className="curve forty" />
          <circle cx="226" cy="62" r="3.5" className="vertex-mark" />
          <circle cx="126" cy="92" r="3.5" className="root-mark" />
          <circle cx="214" cy="92" r="3.5" className="root-mark" />
          <text x="232" y="58" className="diagram-label">z0</text>
          <text x="236" y="102" className="diagram-label">|z-z0|=r</text>
          <text x="74" y="36" className="diagram-label">|z-a|=|z-b|</text>
        </svg>
        <p>Complex equations become geometry on the Argand plane: circles, rays, and bisectors.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Roots of Unity Circle</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Unit circle with roots of unity">
          <line x1="20" y1="92" x2="320" y2="92" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <circle cx="170" cy="92" r="56" className="curve fortyone" />
          <circle cx="226" cy="92" r="3.5" className="root-mark" />
          <circle cx="198" cy="44" r="3.5" className="root-mark" />
          <circle cx="142" cy="44" r="3.5" className="root-mark" />
          <circle cx="114" cy="92" r="3.5" className="root-mark" />
          <circle cx="142" cy="140" r="3.5" className="root-mark" />
          <circle cx="198" cy="140" r="3.5" className="root-mark" />
          <text x="230" y="88" className="diagram-label">1</text>
          <text x="104" y="88" className="diagram-label">-1</text>
          <text x="176" y="30" className="diagram-label">i</text>
          <text x="176" y="154" className="diagram-label">-i</text>
        </svg>
        <MathRenderer content="$z_k=r^{1/n}e^{i(\\theta+2\\pi k)/n}$ places roots uniformly by angle steps of $2\\pi/n$." fontSize={12} className="alevel-inline-math alevel-diagram-caption" />
      </div>

      <div className="alevel-diagram-card">
        <h4>Form-Selection Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Cartesian</td><td><MathRenderer content="$a+bi$" fontSize={12} className="alevel-inline-math" /></td><td>Add/subtract</td></tr>
            <tr><td>Polar</td><td><MathRenderer content="$r(\\cos\\theta+i\\sin\\theta)$" fontSize={12} className="alevel-inline-math" /></td><td>Powers/roots</td></tr>
            <tr><td>Exponential</td><td><MathRenderer content="$re^{i\\theta}$" fontSize={12} className="alevel-inline-math" /></td><td>Fast angle algebra</td></tr>
            <tr><td>Conjugate</td><td><MathRenderer content="$\\bar z$" fontSize={12} className="alevel-inline-math" /></td><td>Division and symmetry</td></tr>
          </tbody>
        </table>
        <p>Choose representation by operation type to reduce mistakes and simplify calculations.</p>
      </div>
    </div>
  );
}

function MatricesDeterminantsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>System to Solution Matrix</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Matrix solution flow AX equals B to X equals inverse AB">
          <rect x="22" y="26" width="88" height="34" rx="8" className="diagram-rect" />
          <rect x="126" y="26" width="88" height="34" rx="8" className="diagram-rect" />
          <rect x="230" y="26" width="88" height="34" rx="8" className="diagram-rect" />
          <rect x="126" y="114" width="88" height="34" rx="8" className="diagram-rect" />
          <line x1="110" y1="43" x2="126" y2="43" className="diagram-arrow" />
          <line x1="214" y1="43" x2="230" y2="43" className="diagram-arrow" />
          <line x1="274" y1="60" x2="170" y2="114" className="diagram-arrow" />
          <text x="42" y="48" className="diagram-label">AX=B</text>
          <text x="144" y="48" className="diagram-label">det A?</text>
          <text x="244" y="48" className="diagram-label">A^-1</text>
          <text x="148" y="134" className="diagram-label">X=A^-1B</text>
        </svg>
        <p>Solve linear systems through matrix structure and determinant-based invertibility checks.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Eigen Direction Sketch</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Eigenvector direction preserved under transformation">
          <line x1="20" y1="145" x2="320" y2="145" />
          <line x1="50" y1="20" x2="50" y2="160" />
          <path d="M 74 136 L 182 64" className="curve fortytwo" />
          <path d="M 74 136 L 242 28" className="curve fortythree" />
          <circle cx="74" cy="136" r="4" className="vertex-mark" />
          <circle cx="182" cy="64" r="4" className="root-mark" />
          <circle cx="242" cy="28" r="4" className="root-mark" />
          <text x="186" y="58" className="diagram-label">v</text>
          <text x="246" y="24" className="diagram-label">lambda v</text>
        </svg>
        <p>Eigenvectors keep direction under transformation while only scale changes by eigenvalue.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Transformation Composition</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>First map</td><td><MathRenderer content="$T_1$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Second map</td><td><MathRenderer content="$T_2$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Total map</td><td><MathRenderer content="$T_2T_1$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Order</td><td>Right to left on vectors</td></tr>
          </tbody>
        </table>
        <p>Composite transformations must respect operation order to avoid coordinate errors.</p>
      </div>
    </div>
  );
}

function Vectors3DDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Line-Plane Geometry</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="3D line intersecting a plane schematic">
          <polygon points="52,128 168,78 290,108 174,156" className="curve fortyfour" />
          <line x1="42" y1="32" x2="250" y2="146" className="curve fortyfive" />
          <line x1="170" y1="52" x2="204" y2="96" className="curve fortysix" />
          <circle cx="182" cy="88" r="4" className="vertex-mark" />
          <text x="256" y="146" className="diagram-label">line</text>
          <text x="186" y="154" className="diagram-label">plane</text>
          <text x="210" y="94" className="diagram-label">n</text>
        </svg>
        <p>Represent lines with direction vectors and planes with normals for clean intersection analysis.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Dot and Cross Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Dot</td><td><MathRenderer content="$a\\cdot b=|a||b|\\cos\\theta$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Cross magnitude</td><td><MathRenderer content="$|a\\times b|=|a||b|\\sin\\theta$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Area</td><td>Parallelogram from cross product</td></tr>
            <tr><td>Volume</td><td><MathRenderer content="$|a\\cdot(b\\times c)|$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Dot and cross products form the core metric and geometric tools in 3D vector work.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Distance to Plane</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Point to plane perpendicular distance">
          <polygon points="48,130 168,82 288,110 168,158" className="curve fortyfour" />
          <circle cx="238" cy="46" r="4" className="root-mark" />
          <line x1="238" y1="46" x2="200" y2="106" className="curve fortythree" />
          <line x1="200" y1="106" x2="218" y2="114" className="curve fortyfive" />
          <text x="244" y="42" className="diagram-label">P</text>
          <text x="206" y="102" className="diagram-label">foot</text>
          <text x="218" y="94" className="diagram-label">d</text>
        </svg>
        <p>Perpendicular projection gives the shortest point-to-plane distance.</p>
      </div>
    </div>
  );
}

function SummationSeriesDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Telescoping Cancellation</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Telescoping series cancellation ladder">
          <text x="26" y="44" className="diagram-label">u1 - u2 + u2 - u3 + u3 - u4 + ...</text>
          <line x1="36" y1="60" x2="308" y2="60" className="asymptote" />
          <line x1="72" y1="66" x2="106" y2="108" className="curve fortytwo" />
          <line x1="112" y1="66" x2="146" y2="108" className="curve fortytwo" />
          <line x1="152" y1="66" x2="186" y2="108" className="curve fortytwo" />
          <line x1="192" y1="66" x2="226" y2="108" className="curve fortytwo" />
          <text x="44" y="128" className="diagram-label">sum = u1 - u(n+1)</text>
        </svg>
        <p>Internal terms cancel in sequence, leaving only boundary terms.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Infinite Geometric Area</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Geometric area interpretation of convergent infinite series">
          <rect x="30" y="28" width="120" height="120" className="diagram-rect" />
          <rect x="150" y="28" width="60" height="60" className="curve fortythree" />
          <rect x="210" y="28" width="30" height="30" className="curve fortyfive" />
          <rect x="240" y="28" width="15" height="15" className="curve fortysix" />
          <text x="36" y="164" className="diagram-label">1 + r + r^2 + ...</text>
          <text x="186" y="164" className="diagram-label">|r| &lt; 1</text>
        </svg>
        <p>Convergent geometric series can be visualized as finite total area.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Sigma Rule Matrix</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Linearity</td><td><MathRenderer content="$\\sum(af+bg)=a\\sum f+b\\sum g$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>First n</td><td><MathRenderer content="$\\sum k=\\frac{n(n+1)}{2}$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Squares</td><td><MathRenderer content="$\\sum k^2=\\frac{n(n+1)(2n+1)}{6}$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Break complicated sums into known formula blocks first.</p>
      </div>
    </div>
  );
}

function NumericalMethodsDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Newton Step Geometry</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Newton Raphson tangent update step">
          <line x1="20" y1="145" x2="320" y2="145" />
          <path d="M 30 132 C 96 82, 152 62, 220 92 C 262 110, 286 116, 320 118" className="curve fortyseven" />
          <line x1="122" y1="84" x2="246" y2="150" className="curve fortythree" />
          <line x1="122" y1="84" x2="122" y2="145" className="asymptote" />
          <line x1="204" y1="145" x2="204" y2="84" className="asymptote" />
          <text x="108" y="160" className="diagram-label">x_n</text>
          <text x="188" y="160" className="diagram-label">x_n+1</text>
        </svg>
        <p>Tangent intersection drives Newton updates toward the root when the initial guess is suitable.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Iteration Cobweb</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Cobweb iteration convergence sketch">
          <line x1="34" y1="28" x2="292" y2="148" className="asymptote" />
          <path d="M 34 136 C 84 120, 134 96, 184 74 C 224 58, 260 50, 292 46" className="curve fortyfive" />
          <path d="M 72 120 L 72 88 L 112 88 L 112 72 L 142 72 L 142 62 L 162 62" className="curve fortyeight" />
          <text x="38" y="22" className="diagram-label">y=x</text>
          <text x="246" y="40" className="diagram-label">y=g(x)</text>
        </svg>
        <p>Cobweb steps show whether fixed-point iteration converges or diverges.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Integration Accuracy Overlay</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Trapezium versus Simpson approximation comparison">
          <line x1="20" y1="145" x2="320" y2="145" />
          <path d="M 44 136 C 96 112, 150 82, 214 64 C 254 56, 286 58, 320 72" className="curve thirtyone" />
          <path d="M 44 136 L 98 112 L 150 88 L 214 66 L 268 58 L 320 72" className="curve thirtytwo" />
          <path d="M 44 136 Q 98 110 150 88 Q 214 64 268 58 Q 294 60 320 72" className="curve thirtythree" />
        </svg>
        <p>Simpson usually captures curvature better than trapezium on the same grid.</p>
      </div>
    </div>
  );
}

function ProofInductionDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Induction Ladder</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Induction base and step ladder">
          <line x1="86" y1="26" x2="86" y2="152" className="asymptote" />
          <line x1="254" y1="26" x2="254" y2="152" className="asymptote" />
          <line x1="86" y1="136" x2="254" y2="136" className="curve fortytwo" />
          <line x1="86" y1="108" x2="254" y2="108" className="curve fortytwo" />
          <line x1="86" y1="80" x2="254" y2="80" className="curve fortytwo" />
          <line x1="86" y1="52" x2="254" y2="52" className="curve fortytwo" />
          <text x="106" y="146" className="diagram-label">base n=1</text>
          <text x="116" y="118" className="diagram-label">k =&gt; k+1</text>
          <text x="116" y="62" className="diagram-label">all n</text>
        </svg>
        <p>Valid base plus valid transition guarantees the statement for all later natural numbers.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Proof Method Decision</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Decision flow among direct contradiction and counterexample">
          <rect x="20" y="24" width="96" height="30" rx="8" className="diagram-rect" />
          <rect x="124" y="24" width="96" height="30" rx="8" className="diagram-rect" />
          <rect x="228" y="24" width="92" height="30" rx="8" className="diagram-rect" />
          <rect x="56" y="112" width="96" height="30" rx="8" className="diagram-rect" />
          <rect x="188" y="112" width="120" height="30" rx="8" className="diagram-rect" />
          <line x1="116" y1="39" x2="124" y2="39" className="diagram-arrow" />
          <line x1="220" y1="39" x2="228" y2="39" className="diagram-arrow" />
          <line x1="66" y1="54" x2="104" y2="112" className="diagram-arrow" />
          <line x1="274" y1="54" x2="246" y2="112" className="diagram-arrow" />
          <text x="28" y="43" className="diagram-label">claim</text>
          <text x="138" y="43" className="diagram-label">type?</text>
          <text x="240" y="43" className="diagram-label">strategy</text>
          <text x="74" y="132" className="diagram-label">counterexample</text>
          <text x="196" y="132" className="diagram-label">direct/contradiction</text>
        </svg>
        <p>Selecting the right proof method early reduces algebraic dead-ends.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Divisibility Structure</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Even</td><td><MathRenderer content="$n=2k$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>Odd</td><td><MathRenderer content="$n=2k+1$" fontSize={12} className="alevel-inline-math" /></td></tr>
            <tr><td>mod 3</td><td><MathRenderer content="$n=3k+r$" fontSize={12} className="alevel-inline-math" /></td></tr>
          </tbody>
        </table>
        <p>Parameterized integer forms are the foundation of many direct and contradiction proofs.</p>
      </div>
    </div>
  );
}

function AdditionalPureMathDiagramSet() {
  return (
    <div className="alevel-diagram-grid">
      <div className="alevel-diagram-card">
        <h4>Polar Curve Frame</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Polar curve sketch with radial angle marker">
          <line x1="20" y1="92" x2="320" y2="92" />
          <line x1="170" y1="20" x2="170" y2="160" />
          <path d="M 170 92 C 196 48, 246 44, 280 82 C 298 102, 286 128, 252 140 C 214 154, 182 126, 170 92" className="curve fortyseven" />
          <line x1="170" y1="92" x2="250" y2="72" className="curve fortythree" />
          <text x="252" y="70" className="diagram-label">r</text>
          <text x="192" y="86" className="diagram-label">theta</text>
        </svg>
        <p>Polar analysis uses radius-angle structure to control area and symmetry behavior.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Parametric Flow</h4>
        <svg viewBox="0 0 340 180" role="img" aria-label="Parametric derivative and second derivative flow">
          <rect x="18" y="24" width="96" height="30" rx="8" className="diagram-rect" />
          <rect x="124" y="24" width="96" height="30" rx="8" className="diagram-rect" />
          <rect x="230" y="24" width="92" height="30" rx="8" className="diagram-rect" />
          <rect x="124" y="112" width="136" height="30" rx="8" className="diagram-rect" />
          <line x1="114" y1="39" x2="124" y2="39" className="diagram-arrow" />
          <line x1="220" y1="39" x2="230" y2="39" className="diagram-arrow" />
          <line x1="276" y1="54" x2="194" y2="112" className="diagram-arrow" />
          <text x="34" y="43" className="diagram-label">x(t), y(t)</text>
          <text x="136" y="43" className="diagram-label">dy/dx</text>
          <text x="242" y="43" className="diagram-label">curvature</text>
          <text x="136" y="132" className="diagram-label">d^2y/dx^2 matrix</text>
        </svg>
        <p>Parametric calculus separates derivative construction from coordinate interpretation.</p>
      </div>

      <div className="alevel-diagram-card">
        <h4>Final Exam Integration Map</h4>
        <table className="alevel-division-table">
          <tbody>
            <tr><td>Algebra</td><td>Simplify and constrain</td></tr>
            <tr><td>Calculus</td><td>Differentiate/integrate</td></tr>
            <tr><td>Geometry</td><td>Interpret curve behavior</td></tr>
            <tr><td>Proof</td><td>Justify claims</td></tr>
          </tbody>
        </table>
        <p>Additional pure mathematics chapters connect multiple methods in single exam problems.</p>
      </div>
    </div>
  );
}

function topicMeta(topicName: string) {
  return aLevelPureMathTopics.find((topic) => topic.name === topicName) ?? null;
}

export function ALevelPureMathNoteDetailPage() {
  const { topic: topicParam } = useParams<{ topic: string }>();
  const slug = decodeURIComponent(topicParam ?? '').trim();
  const resolvedTopicName = resolveTopicName(slug);

  const notes: MathTopicNotes | null = useMemo(() => getALevelPureMathNotes(resolvedTopicName), [resolvedTopicName]);
  const meta = useMemo(() => topicMeta(notes?.topic ?? resolvedTopicName), [notes?.topic, resolvedTopicName]);

  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (!notes) {
    return (
      <div className="math-notes-page alevel-pure-notes-detail">
        <header className="math-notes-header-bar">
          <Link to="/app/pure-math/notes" className="back-link">
            <ArrowLeft size={20} /> Back to notes
          </Link>
          <h1 className="math-notes-header-title">A-Level Pure Math Notes</h1>
        </header>
        <div className="math-notes-card">
          <div className="math-notes-card-body">
            Notes for this topic are not available yet.
          </div>
        </div>
      </div>
    );
  }

  const showPolynomialDiagrams = notes.topic === 'Polynomials';
  const showRationalFunctionDiagrams = notes.topic === 'Rational Functions';
  const showIndicesSurdsLogsDiagrams = notes.topic === 'Indices, Surds and Logarithms';
  const showQuadraticFunctionsDiagrams = notes.topic === 'Quadratic Functions';
  const showFunctionsDiagrams = notes.topic === 'Functions';
  const showCoordinateGeometryDiagrams = notes.topic === 'Coordinate Geometry';
  const showSequencesSeriesDiagrams = notes.topic === 'Sequences and Series';
  const showBinomialTheoremDiagrams = notes.topic === 'Binomial Theorem';
  const showTrigonometryDiagrams = notes.topic === 'Trigonometry';
  const showFurtherTrigonometryDiagrams = notes.topic === 'Further Trigonometry';
  const showHyperbolicFunctionsDiagrams = notes.topic === 'Hyperbolic Functions';
  const showFurtherDifferentiationDiagrams = notes.topic === 'Further Differentiation';
  const showFurtherIntegrationTechniquesDiagrams = notes.topic === 'Further Integration Techniques';
  const showDifferentialEquationsDiagrams = notes.topic === 'Differential Equations';
  const showComplexNumbersDiagrams = notes.topic === 'Complex Numbers';
  const showMatricesDiagrams = notes.topic === 'Matrices and Determinants';
  const showVectors3DDiagrams = notes.topic === 'Vectors in 3D';
  const showSummationSeriesDiagrams = notes.topic === 'Summation of Series';
  const showNumericalMethodsDiagrams = notes.topic === 'Numerical Methods';
  const showProofDiagrams = notes.topic === 'Proof and Mathematical Induction';
  const showAdditionalPureMathDiagrams = notes.topic === 'Additional Pure Math Topics';
  const showDifferentiationDiagrams = notes.topic === 'Differentiation';
  const showApplicationsOfDifferentiationDiagrams = notes.topic === 'Applications of Differentiation';
  const showIntegrationDiagrams = notes.topic === 'Integration';

  return (
    <div className="math-notes-page alevel-pure-notes-detail">
      <header className="math-notes-header-bar alevel-notes-detail-header">
        <Link to="/app/pure-math/notes" className="back-link">
          <ArrowLeft size={20} /> Back to A-Level notes
        </Link>
        <span className="math-notes-header-subtitle">A-Level Pure Mathematics - Book Notes</span>
        <h1 className="math-notes-header-title">{notes.topic}</h1>
        {meta ? (
          <div className="alevel-topic-meta-strip">
            <span>{meta.difficulty}</span>
            <span>{meta.paperRelevance}</span>
            <span>{meta.learningObjectives.length} objectives</span>
          </div>
        ) : null}
      </header>

      <div className="math-notes-content">
        <div className="math-notes-card math-notes-summary-card">
          <div className="math-notes-card-header">
            <Info size={24} className="math-notes-card-icon math-notes-icon-info" />
            <h2 className="math-notes-card-title">Chapter Summary</h2>
          </div>
          <div className="math-notes-card-body">
            <MathRenderer content={notes.summary} fontSize={16} />
          </div>
        </div>

        {notes.sections.map((section, index) => (
          <div key={`${section.title}-${index}`} className="math-notes-card math-notes-section-card">
            <button type="button" className="math-notes-section-head" onClick={() => toggle(index)}>
              <h2 className="math-notes-card-title">
                <span className="alevel-section-index">{index + 1}.</span> {section.title}
              </h2>
              {expanded.has(index) ? <ChevronUp size={24} className="math-notes-chevron" /> : <ChevronDown size={24} className="math-notes-chevron" />}
            </button>

            {expanded.has(index) ? (
              <div className="math-notes-card-body">
                <MathRenderer content={section.content} fontSize={16} />
                {section.worked_examples?.map((example, exampleIndex) => (
                  <div key={`${section.title}-example-${exampleIndex}`} className="math-notes-example-box">
                    <div className="math-notes-example-header">
                      <PenLine size={20} className="math-notes-example-icon" />
                      <span className="math-notes-example-title">Worked Example {exampleIndex + 1}</span>
                    </div>
                    <MathRenderer content={example.question} fontSize={16} />
                    <div className="math-notes-steps">
                      {example.steps.map((step, stepIndex) => (
                        <div key={`${section.title}-step-${stepIndex}`} className="math-notes-step-row">
                          <span className="math-notes-step-num">{stepIndex + 1}</span>
                          <div className="math-notes-step-content">
                            <MathRenderer content={step} fontSize={15} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="math-notes-example-answer">
                      <span className="math-notes-answer-label">Final Answer:</span>
                      <MathRenderer content={example.final_answer} fontSize={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        <div className="math-notes-card alevel-visual-card">
          <div className="math-notes-card-header">
            <Eye size={24} className="math-notes-card-icon math-notes-icon-info" />
            <h2 className="math-notes-card-title">Visual Diagrams</h2>
          </div>
          <div className="math-notes-card-body">
            {showPolynomialDiagrams ? <PolynomialDiagramSet /> : null}
            {showRationalFunctionDiagrams ? <RationalFunctionsDiagramSet /> : null}
            {showIndicesSurdsLogsDiagrams ? <IndicesSurdsLogsDiagramSet /> : null}
            {showQuadraticFunctionsDiagrams ? <QuadraticFunctionsDiagramSet /> : null}
            {showFunctionsDiagrams ? <FunctionsDiagramSet /> : null}
            {showCoordinateGeometryDiagrams ? <CoordinateGeometryDiagramSet /> : null}
            {showSequencesSeriesDiagrams ? <SequencesSeriesDiagramSet /> : null}
            {showBinomialTheoremDiagrams ? <BinomialTheoremDiagramSet /> : null}
            {showTrigonometryDiagrams ? <TrigonometryDiagramSet /> : null}
            {showFurtherTrigonometryDiagrams ? <FurtherTrigonometryDiagramSet /> : null}
            {showHyperbolicFunctionsDiagrams ? <HyperbolicFunctionsDiagramSet /> : null}
            {showFurtherDifferentiationDiagrams ? <FurtherDifferentiationDiagramSet /> : null}
            {showFurtherIntegrationTechniquesDiagrams ? <FurtherIntegrationTechniquesDiagramSet /> : null}
            {showDifferentialEquationsDiagrams ? <DifferentialEquationsDiagramSet /> : null}
            {showComplexNumbersDiagrams ? <ComplexNumbersDiagramSet /> : null}
            {showMatricesDiagrams ? <MatricesDeterminantsDiagramSet /> : null}
            {showVectors3DDiagrams ? <Vectors3DDiagramSet /> : null}
            {showSummationSeriesDiagrams ? <SummationSeriesDiagramSet /> : null}
            {showNumericalMethodsDiagrams ? <NumericalMethodsDiagramSet /> : null}
            {showProofDiagrams ? <ProofInductionDiagramSet /> : null}
            {showAdditionalPureMathDiagrams ? <AdditionalPureMathDiagramSet /> : null}
            {showDifferentiationDiagrams ? <DifferentiationDiagramSet /> : null}
            {showApplicationsOfDifferentiationDiagrams ? <ApplicationsOfDifferentiationDiagramSet /> : null}
            {showIntegrationDiagrams ? <IntegrationDiagramSet /> : null}
            {notes.visual_descriptions?.length ? (
              <ul className="math-notes-points-list alevel-visual-list">
                {notes.visual_descriptions.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <MathRenderer content={item} fontSize={15} className="alevel-inline-math" />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No visual description has been added for this topic yet.</p>
            )}
          </div>
        </div>

        {notes.key_points?.length > 0 ? (
          <div className="math-notes-card math-notes-keypoints-card">
            <div className="math-notes-card-header">
              <CheckCircle size={24} className="math-notes-card-icon math-notes-icon-success" />
              <h2 className="math-notes-card-title">Key Points</h2>
            </div>
            <div className="math-notes-card-body">
              <ul className="math-notes-points-list">
                {notes.key_points.map((point, index) => (
                  <li key={`${point}-${index}`}>
                    <MathRenderer content={point} fontSize={15} className="alevel-inline-math" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {notes.exam_tips?.length > 0 ? (
          <div className="math-notes-card math-notes-examtips-card">
            <div className="math-notes-card-header">
              <Lightbulb size={24} className="math-notes-card-icon math-notes-icon-warning" />
              <h2 className="math-notes-card-title">Exam Tips</h2>
            </div>
            <div className="math-notes-card-body">
              <ul className="math-notes-tips-list">
                {notes.exam_tips.map((tip, index) => (
                  <li key={`${tip}-${index}`}>
                    <MathRenderer content={tip} fontSize={15} className="alevel-inline-math" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="math-notes-card alevel-next-topic-card">
          <div className="math-notes-card-header">
            <Sigma size={22} className="math-notes-card-icon" />
            <h2 className="math-notes-card-title">Continue Building</h2>
          </div>
          <div className="math-notes-card-body">
            <p>Move chapter by chapter from Topic 1 through Topic 24. Each topic supports topical generation and structured exam practice.</p>
            <Link to="/app/pure-math/notes" className="alevel-back-to-index-link">Return to chapter index</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

