// Tiny expression evaluator for simple numeric formulas/conditions used in hands-on activities.
// Supports:
// - numbers, variables (letters/underscore), parentheses
// - operators: + - * /, comparisons: < <= > >= == !=
// - boolean: && ||
//
// NOTE: This is not a general-purpose parser. It's intentionally constrained and used only
// with app-controlled strings (from our simulation configs).

type Vars = Record<string, number>;

const isIdentifierChar = (c: string) => /[a-zA-Z0-9_]/.test(c);

function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (c === ' ' || c === '\n' || c === '\t') {
      i++;
      continue;
    }
    const two = expr.slice(i, i + 2);
    const three = expr.slice(i, i + 3);
    // Multi-char operators first
    if (['>=', '<=', '==', '!=', '&&', '||'].includes(two)) {
      tokens.push(two);
      i += 2;
      continue;
    }
    if (c === '(' || c === ')' || c === '+' || c === '-' || c === '*' || c === '/' || c === '<' || c === '>') {
      tokens.push(c);
      i++;
      continue;
    }
    // Number
    if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < expr.length && /[0-9.]/.test(expr[j])) j++;
      tokens.push(expr.slice(i, j));
      i = j;
      continue;
    }
    // Identifier
    if (/[a-zA-Z_]/.test(c)) {
      let j = i + 1;
      while (j < expr.length && isIdentifierChar(expr[j])) j++;
      tokens.push(expr.slice(i, j));
      i = j;
      continue;
    }
    // Unknown char: skip to avoid crashing
    i++;
  }
  return tokens;
}

// Pratt parser
type Node =
  | { type: 'num'; value: number }
  | { type: 'var'; name: string }
  | { type: 'unary'; op: string; right: Node }
  | { type: 'bin'; op: string; left: Node; right: Node };

const PRECEDENCE: Record<string, number> = {
  '||': 1,
  '&&': 2,
  '==': 3,
  '!=': 3,
  '<': 4,
  '<=': 4,
  '>': 4,
  '>=': 4,
  '+': 5,
  '-': 5,
  '*': 6,
  '/': 6,
};

function parseExpression(tokens: string[], minPrec = 0): { node: Node; idx: number } {
  let idx = 0;

  const parsePrimary = (): Node => {
    const t = tokens[idx];
    if (t === undefined) return { type: 'num', value: 0 };
    if (t === '(') {
      idx++;
      const inner = parseExpression(tokens.slice(idx), 0);
      idx += inner.idx;
      if (tokens[idx] === ')') idx++;
      return inner.node;
    }
    if (t === '+' || t === '-') {
      idx++;
      const right = parsePrimary();
      return { type: 'unary', op: t, right };
    }
    if (/^[0-9.]+$/.test(t)) {
      idx++;
      return { type: 'num', value: Number(t) };
    }
    // identifier
    idx++;
    return { type: 'var', name: t };
  };

  let left = parsePrimary();

  while (true) {
    const op = tokens[idx];
    const prec = op ? PRECEDENCE[op] : undefined;
    if (!op || prec === undefined || prec < minPrec) break;

    idx++; // consume op
    const rhs = parseExpression(tokens.slice(idx), prec + 1);
    idx += rhs.idx;
    left = { type: 'bin', op, left, right: rhs.node };
  }

  return { node: left, idx };
}

function evalNode(node: Node, vars: Vars): number {
  switch (node.type) {
    case 'num':
      return node.value;
    case 'var':
      return Number.isFinite(vars[node.name]) ? vars[node.name] : 0;
    case 'unary': {
      const r = evalNode(node.right, vars);
      return node.op === '-' ? -r : r;
    }
    case 'bin': {
      const a = evalNode(node.left, vars);
      const b = evalNode(node.right, vars);
      switch (node.op) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return b === 0 ? 0 : a / b;
        case '<':
          return a < b ? 1 : 0;
        case '<=':
          return a <= b ? 1 : 0;
        case '>':
          return a > b ? 1 : 0;
        case '>=':
          return a >= b ? 1 : 0;
        case '==':
          return a === b ? 1 : 0;
        case '!=':
          return a !== b ? 1 : 0;
        case '&&':
          return a !== 0 && b !== 0 ? 1 : 0;
        case '||':
          return a !== 0 || b !== 0 ? 1 : 0;
        default:
          return 0;
      }
    }
    default:
      return 0;
  }
}

export function evalFormula(expr: string, vars: Vars): number {
  const tokens = tokenize(expr);
  const parsed = parseExpression(tokens, 0);
  return evalNode(parsed.node, vars);
}

export function evalCondition(expr: string, vars: Vars): boolean {
  return evalFormula(expr, vars) !== 0;
}

