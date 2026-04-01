export type MaicBoardElement =
  | {
      kind: 'line';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      stroke?: string;
      strokeWidth?: number;
    }
  | {
      kind: 'rect';
      x: number;
      y: number;
      w: number;
      h: number;
      stroke?: string;
      fill?: string;
      strokeWidth?: number;
    }
  | {
      kind: 'ellipse';
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      stroke?: string;
      fill?: string;
      strokeWidth?: number;
    }
  | {
      kind: 'text';
      x: number;
      y: number;
      text: string;
      fill?: string;
      size?: number;
    }
  | {
      kind: 'polyline';
      points: number[];
      stroke?: string;
      strokeWidth?: number;
      fill?: string;
    };

export interface MaicBoardSpec {
  version?: number;
  width?: number;
  height?: number;
  elements?: MaicBoardElement[];
}

export function parseTeacherWhiteboards(raw: string): {
  displayText: string;
  boards: MaicBoardSpec[];
} {
  if (!raw?.trim()) return { displayText: '', boards: [] };
  const boards: MaicBoardSpec[] = [];
  const re = /<whiteboard>\s*([\s\S]*?)\s*<\/whiteboard>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const inner = m[1]?.trim();
    if (!inner) continue;
    try {
      const obj = JSON.parse(inner) as unknown;
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        boards.push(obj as MaicBoardSpec);
      }
    } catch {
      /* skip invalid JSON */
    }
  }
  let displayText = raw
    .replace(/<whiteboard>\s*([\s\S]*?)\s*<\/whiteboard>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!displayText && boards.length > 0) {
    displayText = "Here's a diagram on the board.";
  }
  return { displayText, boards };
}

/** Hide finished board JSON while tokens stream (avoid flashing raw tags). */
export function previewTeacherStream(raw: string): string {
  return raw
    .replace(/<whiteboard>\s*[\s\S]*?<\/whiteboard>/gi, '\n- diagram on board -\n')
    .replace(/\n{3,}/g, '\n\n');
}

export function safeParseBoardJson(json: string): MaicBoardSpec | null {
  try {
    const obj = JSON.parse(json) as unknown;
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return obj as MaicBoardSpec;
    }
  } catch {
    /* ignore */
  }
  return null;
}

