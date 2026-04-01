import { ClipboardList, Film, Mic2, Users } from 'lucide-react';

const rows = [
  {
    Icon: Film,
    circle: 'bg-emerald-500/15 text-classroom-brand',
    title: 'Projected Slides',
    body: 'AI-generated slides for your topic, one segment at a time. Visually structured like a real lesson.',
  },
  {
    Icon: Mic2,
    circle: 'bg-classroom-accent-voice/15 text-classroom-accent-voice',
    title: 'Live Voice Highlighting',
    body: 'The AI teacher speaks each slide out loud. Words highlight in real time as they are spoken.',
  },
  {
    Icon: Users,
    circle: 'bg-blue-500/15 text-blue-400',
    title: 'AI Classmates',
    body: 'Chido (your AI classmate) asks questions alongside you, keeping the lesson interactive.',
  },
  {
    Icon: ClipboardList,
    circle: 'bg-classroom-accent-ai/15 text-classroom-accent-ai',
    title: 'Quiz & Grading',
    body: 'ZIMSEC-style quiz at the end. AI grades your answers with detailed feedback.',
  },
];

export function SessionPreviewCard() {
  return (
    <section
      id="maic-session-preview"
      className="scroll-mt-6 rounded-[20px] border border-classroom-border bg-classroom-surface p-6 font-dm"
    >
      <h2 className="font-sora text-[15px] font-semibold text-classroom-text-primary">
        What happens in your session
      </h2>
      <p className="mt-1 text-xs text-classroom-text-secondary">A full structured ZIMSEC lesson, powered by AI</p>
      <ul className="mt-2 divide-y divide-classroom-border">
        {rows.map(({ Icon, circle, title, body }, i) => (
          <li key={title} className={`flex gap-3 py-3.5 ${i === 0 ? 'pt-0' : ''}`}>
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${circle}`}
              aria-hidden
            >
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-classroom-text-primary">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-classroom-text-secondary">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
