import type { MaicLessonOutline } from '../../services/api/aiClassroomApi';
import type { MaicBoardSpec } from '../../types/maicBoard';

type ExportRow = {
  sender: string;
  content: string;
  kind?: 'text' | 'whiteboard';
  board?: MaicBoardSpec;
};

export function buildMaicLessonMarkdown(params: {
  subject: string;
  formLevel: string;
  topic: string;
  stage: string;
  sessionId: string | null;
  outline: MaicLessonOutline | null;
  rows: ExportRow[];
}): string {
  const { subject, formLevel, topic, stage, sessionId, outline, rows } = params;
  const lines: string[] = [];
  lines.push(`# AI Classroom — ${subject}`);
  lines.push('');
  lines.push(`- **Topic:** ${topic || subject}`);
  lines.push(`- **Level:** ${formLevel}`);
  lines.push(`- **Stage (at export):** ${stage.replace(/_/g, ' ')}`);
  if (sessionId) lines.push(`- **Session:** \`${sessionId}\``);
  lines.push('');
  lines.push(`_Exported from NerdX MAIC (Phase 3). Cross-check all facts with your syllabus._`);
  lines.push('');
  if (outline?.title || outline?.objectives?.length) {
    lines.push('## Outline');
    lines.push('');
    if (outline.title) lines.push(`**${outline.title}**`);
    lines.push('');
    if (outline.objectives?.length) {
      for (const o of outline.objectives) {
        lines.push(`- ${o}`);
      }
      lines.push('');
    }
  }
  lines.push('## Transcript');
  lines.push('');
  for (const r of rows) {
    const who =
      r.sender === 'teacher'
        ? r.kind === 'whiteboard'
          ? 'Mr. Moyo (board)'
          : 'Mr. Moyo'
        : r.sender === 'classmate'
          ? 'Chido'
          : 'You';
    if (r.kind === 'whiteboard') {
      lines.push(`### ${who}`);
      lines.push('');
      lines.push('*[Whiteboard diagram — open this lesson in NerdX to view the drawing.]*');
      lines.push('');
      if (r.board) {
        lines.push('```json');
        lines.push(JSON.stringify(r.board, null, 2));
        lines.push('```');
        lines.push('');
      }
      continue;
    }
    lines.push(`### ${who}`);
    lines.push('');
    lines.push(r.content.trim() || '—');
    lines.push('');
  }
  return lines.join('\n');
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
