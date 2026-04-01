import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2, Mic, Square, Volume2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  aiClassroomApi,
  type MaicHistorySession,
  type MaicLessonOutline,
  type MaicQuizQuestion,
  type MaicStartData,
} from '../../services/api/aiClassroomApi';
import {
  parseTeacherWhiteboards,
  previewTeacherStream,
  safeParseBoardJson,
  type MaicBoardSpec,
} from '../../types/maicBoard';
import { MaicWhiteboard } from './MaicWhiteboard';
import { buildMaicLessonMarkdown, downloadTextFile } from './exportMaicMarkdown';
import { AIClassroomSetupPage, type VoiceMode } from './setup';
import { buildFormLevel, parseFormLevel } from './setup/aiClassroomSetupUtils';
import { MathRenderer } from '../../components/MathRenderer';
import './AiClassroomPage.css';

type Sender = 'teacher' | 'classmate' | 'note_taker' | 'student';

interface ChatRow {
  id: string;
  sender: Sender;
  content: string;
  kind?: 'text' | 'whiteboard';
  board?: MaicBoardSpec;
  relatedSlideId?: string;
  relatedFocusIdx?: number;
}

interface LocationState {
  subject?: string;
  formLevel?: string;
  topic?: string;
}

interface ProjectedSlide {
  id: string;
  title: string;
  points: string[];
  focus: string[];
  board?: MaicBoardSpec;
  sourceRowId?: string;
  stage: string;
}

interface QueueItem {
  text: string;
  rowId: string;
  slideId?: string;
  focusIdx?: number;
}

const MAX_SLIDES = 36;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function cleanForSlide(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\$([^$\n]+)\$/g, '$1')
    .replace(/\\\(([\s\S]*?)\\\)/g, '$1')
    .replace(/\\\[([\s\S]*?)\\\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text: string): string[] {
  return normalize(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function slideFromText(
  text: string,
  stage: string,
  fallbackTopic: string,
  board?: MaicBoardSpec,
  sourceRowId?: string
): ProjectedSlide {
  const basePoints = text
    .split('\n')
    .map((l) => l.replace(/^[-*]+\s*/, '').trim())
    .map(cleanForSlide)
    .filter(Boolean);
  const points = (basePoints.length ? basePoints : splitSentences(text).map(cleanForSlide))
    .slice(0, 5)
    .map((p) => (p.length > 170 ? `${p.slice(0, 167).trim()}...` : p));
  const titleSeed = points[0] || fallbackTopic;
  const title = titleSeed.length > 84 ? `${titleSeed.slice(0, 81).trim()}...` : titleSeed;
  const focus = points
    .flatMap((p) =>
      p
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 5)
    )
    .filter((w, i, arr) => arr.indexOf(w) === i)
    .slice(0, 4);
  return {
    id: uid(),
    title: title || fallbackTopic,
    points: points.length ? points : ['Follow this segment and ask questions in chat.'],
    focus,
    board,
    sourceRowId,
    stage,
  };
}

function wordWeight(text: string): number {
  return Math.max(1, cleanForSlide(text).split(/\s+/).filter(Boolean).length);
}

function weightedIndexByProgress(parts: string[], progress: number): number {
  if (!parts.length) return 0;
  const p = Math.max(0, Math.min(0.999, progress));
  const weights = parts.map(wordWeight);
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = 0;
  for (let i = 0; i < weights.length; i += 1) {
    cursor += weights[i] ?? 1;
    if (p * total < cursor) return i;
  }
  return parts.length - 1;
}

function focusCueForSlide(slide: ProjectedSlide | null, idx: number): string {
  if (!slide || !slide.points.length) return '';
  const safeIdx = Math.max(0, Math.min(slide.points.length - 1, idx));
  const point = slide.points[safeIdx] || '';
  const pointLower = point.toLowerCase();
  const keyword =
    slide.focus.find((item) => pointLower.includes(item.toLowerCase())) ||
    slide.focus[safeIdx] ||
    slide.focus[0] ||
    '';
  return keyword ? `${keyword}: ${point}` : point;
}

function buildNarrationQueue(text: string, rowId: string, slide?: ProjectedSlide | null): QueueItem[] {
  const clean = normalize(text);
  if (!clean) return [];
  if (!slide || slide.points.length <= 1) {
    return [{ text: clean, rowId, slideId: slide?.id }];
  }

  const sentenceParts = splitSentences(clean).map(normalize).filter(Boolean);
  const fragments =
    sentenceParts.length >= slide.points.length ? sentenceParts : slide.points.map(normalize).filter(Boolean);

  if (fragments.length <= 1) {
    return [{ text: clean, rowId, slideId: slide.id }];
  }

  const buckets = slide.points.map(() => [] as string[]);
  fragments.forEach((fragment, idx) => {
    const progress = (idx + 0.15) / fragments.length;
    const bucketIdx = weightedIndexByProgress(slide.points, progress);
    buckets[bucketIdx]?.push(fragment);
  });

  const items = buckets
    .map((parts, idx) => ({
      text: normalize(parts.join(' ')),
      rowId,
      slideId: slide.id,
      focusIdx: idx,
    }))
    .filter((item) => item.text);

  return items.length ? items : [{ text: clean, rowId, slideId: slide.id }];
}

export function AiClassroomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();

  const preset = (location.state || {}) as LocationState;

  const [subject, setSubject] = useState(preset.subject || '');
  const [formSpec, setFormSpec] = useState(() => parseFormLevel(preset.formLevel || 'Form 3 (O-Level)'));
  const formLevel = useMemo(() => buildFormLevel(formSpec.form, formSpec.level), [formSpec]);
  const [topic, setTopic] = useState(preset.topic || '');
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('voice');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [outline, setOutline] = useState<MaicLessonOutline | null>(null);
  const [stage, setStage] = useState<string>('intro');
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [liveTeacher, setLiveTeacher] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startHint, setStartHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<MaicQuizQuestion[] | null>(null);
  const [quizDraft, setQuizDraft] = useState<Record<string, string>>({});
  const [composer, setComposer] = useState('');
  const [sending, setSending] = useState(false);
  const [historyItems, setHistoryItems] = useState<MaicHistorySession[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [resumingId, setResumingId] = useState<string | null>(null);
  const [autoReadTeacher, setAutoReadTeacher] = useState(true);
  const [autoFlow, setAutoFlow] = useState(true);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);
  const [activeNarrationRowId, setActiveNarrationRowId] = useState<string | null>(null);
  const [slides, setSlides] = useState<ProjectedSlide[]>([]);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [activeFocusIdx, setActiveFocusIdx] = useState(0);
  const [activeFocusCue, setActiveFocusCue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcribingAudio, setTranscribingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const slideMapRef = useRef<Record<string, string>>({});
  const queueRef = useRef<QueueItem[]>([]);
  const queueBusyRef = useRef(false);
  const speechTokenRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const activeSlideIdRef = useRef<string | null>(null);
  const activeFocusIdxRef = useRef(0);

  const stopSpeaking = useCallback((clearQueue = true) => {
    if (clearQueue) queueRef.current = [];
    speechTokenRef.current += 1;
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.src = '';
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setTtsLoadingId(null);
    setActiveNarrationRowId(null);
  }, []);

  useEffect(() => {
    activeSlideIdRef.current = activeSlideId;
    activeFocusIdxRef.current = activeFocusIdx;
  }, [activeSlideId, activeFocusIdx]);

  useEffect(() => {
    return () => {
      stopSpeaking(true);
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [stopSpeaking]);

  const applyCredits = useCallback(
    (n?: number) => {
      if (typeof n === 'number') updateUser({ credits: n });
    },
    [updateUser]
  );

  const pushRow = useCallback(
    (
      sender: Sender,
      content: string,
      extra?: {
        kind?: 'text' | 'whiteboard';
        board?: MaicBoardSpec;
        relatedSlideId?: string;
        relatedFocusIdx?: number;
      }
    ) => {
      const rowId = uid();
      setRows((prev) => [
        ...prev,
        {
          id: rowId,
          sender,
          content,
          kind: extra?.kind ?? 'text',
          board: extra?.board,
          relatedSlideId: extra?.relatedSlideId,
          relatedFocusIdx: extra?.relatedFocusIdx,
        },
      ]);
      return rowId;
    },
    []
  );

  const pushSlide = useCallback((slide: ProjectedSlide) => {
    setSlides((prev) => {
      const next = [...prev, slide];
      return next.length <= MAX_SLIDES ? next : next.slice(next.length - MAX_SLIDES);
    });
    setActiveSlideId(slide.id);
    setActiveFocusIdx(0);
    setActiveFocusCue(focusCueForSlide(slide, 0));
  }, []);

  const attachTeacherSlide = useCallback(
    (rowId: string, text: string, board?: MaicBoardSpec) => {
      const base = topic.trim() || subject.trim() || 'Lesson';
      const nextSlide = slideFromText(text, stage, base, board, rowId);
      slideMapRef.current[rowId] = nextSlide.id;
      pushSlide(nextSlide);
      return nextSlide.id;
    },
    [pushSlide, stage, subject, topic]
  );

  const seedSlidesFromOutline = useCallback(
    (lesson: MaicLessonOutline | null | undefined, stageValue: string) => {
      const base = topic.trim() || subject.trim() || 'Lesson';
      const objectives = Array.isArray(lesson?.objectives) ? lesson.objectives.slice(0, 5) : [];
      const text = objectives.length ? objectives.join('. ') : `Introduction to ${base}`;
      const s = slideFromText(text, stageValue, base);
      s.title = lesson?.title?.trim() || `${base} overview`;
      setSlides([s]);
      setActiveSlideId(s.id);
      setActiveFocusIdx(0);
      setActiveFocusCue(focusCueForSlide(s, 0));
    },
    [subject, topic]
  );

  const updateSpeechFocus = useCallback(
    (rowId: string, progress: number, forcedSlideId?: string, forcedFocusIdx?: number) => {
      const slideId = forcedSlideId || slideMapRef.current[rowId];
      if (!slideId) return;
      setActiveSlideId(slideId);
      const slide = slides.find((s) => s.id === slideId);
      if (!slide) return;
      const nextIdx =
        typeof forcedFocusIdx === 'number'
          ? Math.max(0, Math.min(slide.points.length - 1, forcedFocusIdx))
          : weightedIndexByProgress(slide.points, progress);
      setActiveFocusIdx(nextIdx);
      setActiveFocusCue(focusCueForSlide(slide, nextIdx));
    },
    [slides]
  );

  const playSpeech = useCallback(
    async (item: QueueItem) => {
      const clean = normalize(item.text).slice(0, 2500);
      if (!clean) return;
      const token = speechTokenRef.current;
      setTtsLoadingId(item.rowId);
      setActiveNarrationRowId(item.rowId);
      if (item.slideId) setActiveSlideId(item.slideId);
      updateSpeechFocus(item.rowId, 0, item.slideId, item.focusIdx);
      let playedServerAudio = false;
      try {
        const url = await aiClassroomApi.speakText(clean);
        if (token !== speechTokenRef.current) return;
        if (url) {
          await new Promise<void>((resolve, reject) => {
            const a = new Audio(url);
            audioRef.current = a;
            a.ontimeupdate = () => {
              if (a.duration > 0) {
                updateSpeechFocus(item.rowId, a.currentTime / a.duration, item.slideId, item.focusIdx);
              }
            };
            a.onended = () => {
              updateSpeechFocus(item.rowId, 1, item.slideId, item.focusIdx);
              audioRef.current = null;
              resolve();
            };
            a.onerror = () => reject(new Error('audio'));
            void a.play().catch(() => reject(new Error('play')));
          });
          playedServerAudio = true;
        }
      } catch {
        // browser fallback below
      }
      if (!playedServerAudio && typeof window !== 'undefined' && window.speechSynthesis) {
        await new Promise<void>((resolve) => {
          const utter = new SpeechSynthesisUtterance(clean);
          utter.rate = 0.95;
          const started = Date.now();
          const estimate = Math.max(2800, Math.round((clean.split(' ').length / 2.4) * 1000));
          const timer = window.setInterval(() => {
            updateSpeechFocus(
              item.rowId,
              (Date.now() - started) / estimate,
              item.slideId,
              item.focusIdx
            );
          }, 220);
          utter.onend = () => {
            window.clearInterval(timer);
            updateSpeechFocus(item.rowId, 1, item.slideId, item.focusIdx);
            resolve();
          };
          utter.onerror = () => {
            window.clearInterval(timer);
            resolve();
          };
          window.speechSynthesis.speak(utter);
        });
      }
      if (token === speechTokenRef.current) {
        setTtsLoadingId(null);
        setActiveNarrationRowId(null);
      }
    },
    [updateSpeechFocus]
  );

  const drainQueue = useCallback(async () => {
    if (queueBusyRef.current) return;
    queueBusyRef.current = true;
    try {
      while (queueRef.current.length > 0) {
        const item = queueRef.current.shift();
        if (!item) continue;
        await playSpeech(item);
      }
    } finally {
      queueBusyRef.current = false;
    }
  }, [playSpeech]);

  const enqueueSpeech = useCallback(
    (text: string, rowId: string, slideId?: string, interrupt = false) => {
      const clean = normalize(text);
      if (!clean) return;
      if (interrupt) stopSpeaking(true);
      const slide = slideId ? slides.find((s) => s.id === slideId) || null : null;
      queueRef.current.push(...buildNarrationQueue(clean, rowId, slide));
      void drainQueue();
    },
    [drainQueue, slides, stopSpeaking]
  );

  useEffect(() => {
    if (preset.subject && !subject) setSubject(preset.subject);
    if (preset.topic && !topic) setTopic(preset.topic);
  }, [preset.subject, preset.topic, subject, topic]);

  useEffect(() => {
    if (preset.formLevel) setFormSpec(parseFormLevel(preset.formLevel));
  }, [preset.formLevel]);

  useEffect(() => {
    if (sessionId) return;
    let cancelled = false;
    setHistoryLoading(true);
    void aiClassroomApi.listHistory().then(({ data, error: historyError }) => {
      if (cancelled) return;
      if (historyError) setError(historyError);
      setHistoryItems(data.slice(0, 20));
      setHistoryLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const applyStartedSession = useCallback(
    (startData: MaicStartData, creditsRemaining?: number) => {
      if (creditsRemaining !== undefined) applyCredits(creditsRemaining);
      slideMapRef.current = {};
      stopSpeaking(true);
      setSessionId(startData.session_id);
      const nextOutline = (startData.lesson_outline as MaicLessonOutline) || null;
      setOutline(nextOutline);
      const nextStage = startData.stage || 'intro';
      setStage(nextStage);
      setRows([]);
      setSlides([]);
      setActiveSlideId(null);
      setQuizQuestions(null);
      setLiveTeacher('');
      seedSlidesFromOutline(nextOutline, nextStage);
    },
    [applyCredits, seedSlidesFromOutline, stopSpeaking]
  );

  const completeSessionStart = useCallback(
    (startData: MaicStartData, creditsRemaining?: number) => {
      setAutoReadTeacher(voiceMode === 'voice');
      applyStartedSession(startData, creditsRemaining);
    },
    [voiceMode, applyStartedSession]
  );

  const handleStart = async () => {
    if (!subject.trim() || !formLevel.trim()) {
      setError('Subject and form level are required.');
      return;
    }
    setError(null);
    setStartHint('Preparing classroom session...');
    setStarting(true);
    try {
      const topicUse = topic.trim() || subject.trim();
      const queued = await aiClassroomApi.startSessionJob(subject.trim(), formLevel.trim(), topicUse);
      if (queued.error) {
        const routeMissing = queued.error.includes('AI Classroom API is not available on this backend');
        if (!routeMissing) {
          setError(queued.error);
          return;
        }
        const fallback = await aiClassroomApi.startSession(subject.trim(), formLevel.trim(), topicUse);
        if (fallback.error || !fallback.data?.session_id) {
          setError(fallback.error || queued.error || 'Could not start session.');
          return;
        }
        completeSessionStart(fallback.data, fallback.creditsRemaining);
        return;
      }
      if (queued.creditsRemaining !== undefined) applyCredits(queued.creditsRemaining);
      if (queued.data?.session_id) {
        completeSessionStart(queued.data, queued.creditsRemaining);
        return;
      }
      const jobId = queued.jobId;
      if (!jobId) {
        setError('Could not start session: server did not return a start job id.');
        return;
      }
      if (queued.message) setStartHint(queued.message);
      for (let i = 0; i < 50; i += 1) {
        await sleep(900);
        const status = await aiClassroomApi.getStartSessionJob(jobId);
        if (status.error) {
          setError(status.error);
          return;
        }
        if (status.creditsRemaining !== undefined) applyCredits(status.creditsRemaining);
        if (status.message) setStartHint(status.message);
        if (status.status === 'succeeded' && status.data?.session_id) {
          completeSessionStart(status.data, status.creditsRemaining);
          return;
        }
        if (status.status === 'failed') {
          setError(status.message || 'Could not start session.');
          return;
        }
      }
      setError('Timed out while preparing the classroom session. Please try again.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong starting the session.');
    } finally {
      setStarting(false);
      setStartHint(null);
    }
  };

  const handleExportMarkdown = useCallback(() => {
    const md = buildMaicLessonMarkdown({
      subject: subject.trim() || 'Subject',
      formLevel: formLevel.trim(),
      topic: (topic.trim() || subject.trim() || 'Topic').trim(),
      stage,
      sessionId,
      outline,
      rows,
    });
    const safe = (topic.trim() || subject.trim() || 'lesson')
      .replace(/[^\w-]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
    downloadTextFile(`nerdx-ai-classroom-${safe || 'lesson'}.md`, md);
  }, [subject, formLevel, topic, stage, sessionId, outline, rows]);

  const applyPlayback = useCallback(
    async (sessionUuid: string) => {
      setError(null);
      setResumingId(sessionUuid);
      try {
        const { data, error: playbackError } = await aiClassroomApi.fetchPlayback(sessionUuid);
        if (playbackError || !data) {
          setError(playbackError || 'Could not load session');
          return;
        }
        stopSpeaking(true);
        const s = data.session;
        setSessionId(String(s.id));
        setSubject(String(s.subject || ''));
        setFormSpec(parseFormLevel(String(s.form_level || 'Form 3 (O-Level)')));
        setTopic(String(s.topic || ''));
        setOutline((s.lesson_outline as MaicLessonOutline) || null);
        setStage(String(s.stage || 'intro'));
        setLiveTeacher('');
        const mapped: ChatRow[] = [];
        for (const msg of data.messages) {
          if (msg.message_type === 'whiteboard') {
            const board = safeParseBoardJson(msg.content);
            if (board) {
              mapped.push({
                id: String(msg.id || uid()),
                sender: 'teacher',
                content: '',
                kind: 'whiteboard',
                board,
              });
            }
            continue;
          }
          const rawContent = String(msg.content || '');
          const looksLikeNote = rawContent.startsWith('[NOTE_TAKER]');
          const snd = (looksLikeNote ? 'note_taker' : msg.sender) as Sender;
          if (snd === 'teacher' || snd === 'classmate' || snd === 'student' || snd === 'note_taker') {
            mapped.push({
              id: String(msg.id || uid()),
              sender: snd,
              content: looksLikeNote ? rawContent.replace(/^\[NOTE_TAKER\]\s*/, '') : rawContent,
              kind: 'text',
            });
          }
        }
        setRows(mapped);
        const rebuiltSlides: ProjectedSlide[] = [];
        slideMapRef.current = {};
        mapped.forEach((r) => {
          if (r.sender !== 'teacher' || r.kind !== 'text' || !r.content.trim()) return;
          const sld = slideFromText(r.content, String(s.stage || 'intro'), String(s.topic || s.subject || 'Lesson'));
          sld.sourceRowId = r.id;
          slideMapRef.current[r.id] = sld.id;
          rebuiltSlides.push(sld);
        });
        if (rebuiltSlides.length) {
          setSlides(rebuiltSlides);
          setActiveSlideId(rebuiltSlides[rebuiltSlides.length - 1]!.id);
          setActiveFocusIdx(0);
          setActiveFocusCue(focusCueForSlide(rebuiltSlides[rebuiltSlides.length - 1]!, 0));
        } else {
          seedSlidesFromOutline((s.lesson_outline as MaicLessonOutline) || null, String(s.stage || 'intro'));
        }
        if (s.stage === 'quiz_checkpoint' && s.quiz_snapshot) {
          const qs = s.quiz_snapshot as MaicQuizQuestion[];
          if (Array.isArray(qs) && qs.length > 0) {
            setQuizQuestions(qs);
            const init: Record<string, string> = {};
            qs.forEach((q) => {
              init[q.id] = '';
            });
            setQuizDraft(init);
          }
        } else {
          setQuizQuestions(null);
        }
      } finally {
        setResumingId(null);
      }
    },
    [seedSlidesFromOutline, stopSpeaking]
  );

  const runNextSegment = useCallback(async () => {
    if (!sessionId) return;
    setError(null);
    setStreaming(true);
    setLiveTeacher('');
    let acc = '';
    try {
      await aiClassroomApi.postStream(sessionId, {
        onStart: (cr) => {
          if (cr !== undefined) applyCredits(cr);
        },
        onTeacherToken: (t) => {
          acc += t;
          setLiveTeacher(previewTeacherStream(acc));
        },
        onTeacherSegmentEnd: () => {
          const { displayText, boards } = parseTeacherWhiteboards(acc);
          let rowId: string | null = null;
          let slideId: string | undefined;
          if (displayText) {
            rowId = pushRow('teacher', displayText);
            slideId = attachTeacherSlide(rowId, displayText, boards[0]);
          }
          boards.forEach((b) => pushRow('teacher', '', { kind: 'whiteboard', board: b }));
          if (autoReadTeacher && displayText.trim() && rowId) {
            enqueueSpeech(displayText, rowId, slideId);
          }
          setLiveTeacher('');
          acc = '';
        },
        onTeacherQuiz: (qs) => {
          setQuizQuestions(qs);
          const init: Record<string, string> = {};
          qs.forEach((q) => {
            init[q.id] = '';
          });
          setQuizDraft(init);
          pushRow('teacher', 'Quiz checkpoint - answer the questions below, then submit.');
        },
        onClassmateMessage: (c) => {
          if (c.trim()) {
            pushRow('classmate', c.trim(), {
              relatedSlideId: activeSlideIdRef.current || undefined,
              relatedFocusIdx: activeFocusIdxRef.current,
            });
          }
        },
        onNoteTakerMessage: (n) => {
          if (n.trim()) {
            pushRow('note_taker', n.trim(), {
              relatedSlideId: activeSlideIdRef.current || undefined,
              relatedFocusIdx: activeFocusIdxRef.current,
            });
          }
        },
        onStage: (s, cr) => {
          if (s) setStage(s);
          if (cr !== undefined) applyCredits(cr);
        },
        onError: (msg) => setError(msg),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Stream failed');
    } finally {
      setStreaming(false);
      setLiveTeacher('');
    }
  }, [sessionId, applyCredits, pushRow, attachTeacherSlide, autoReadTeacher, enqueueSpeech]);

  useEffect(() => {
    if (!autoFlow || !sessionId || streaming || quizQuestions || stage === 'complete' || error) return;
    const timer = window.setTimeout(() => {
      void runNextSegment();
    }, rows.length ? 1100 : 300);
    return () => window.clearTimeout(timer);
  }, [autoFlow, sessionId, streaming, quizQuestions, stage, error, rows.length, runNextSegment]);

  const handleSubmitQuiz = async () => {
    if (!sessionId || !quizQuestions) return;
    setError(null);
    setStreaming(true);
    try {
      const answers: Record<string, string | number> = { ...quizDraft };
      quizQuestions.forEach((q) => {
        if (q.type === 'mcq' && q.options?.length) {
          const raw = quizDraft[q.id];
          const idx = q.options.indexOf(raw);
          if (idx >= 0) answers[q.id] = idx;
        }
      });
      const res = await aiClassroomApi.submitQuiz(sessionId, answers);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.creditsRemaining !== undefined) applyCredits(res.creditsRemaining);
      const rowId = pushRow('teacher', `Quiz marked: ${res.score.toFixed(1)}/10\n\n${res.feedback || ''}`.trim());
      attachTeacherSlide(rowId, res.feedback || 'Quiz feedback');
      setQuizQuestions(null);
      if (res.stage) setStage(res.stage);
    } finally {
      setStreaming(false);
    }
  };

  const handleSendStudent = async () => {
    const text = composer.trim();
    if (!sessionId || !text) return;
    setSending(true);
    setError(null);
    pushRow('student', text);
    setComposer('');
    try {
      const res = await aiClassroomApi.sendMessage(sessionId, text);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.creditsRemaining !== undefined) applyCredits(res.creditsRemaining);
      if (res.response) {
        const rowId = pushRow('teacher', res.response);
        const slideId = attachTeacherSlide(rowId, res.response, res.whiteboards?.[0]);
        (res.whiteboards || []).forEach((b) => pushRow('teacher', '', { kind: 'whiteboard', board: b }));
        if (autoReadTeacher) enqueueSpeech(res.response, rowId, slideId);
      }
    } finally {
      setSending(false);
    }
  };

  const startRecording = async () => {
    if (sending || transcribingAudio) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Audio recording is not supported in this browser.');
      return;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data?.size) audioChunksRef.current.push(event.data);
      };
      recorder.start();
      setIsRecording(true);
    } catch {
      setError('Microphone access failed. Please allow microphone permission and try again.');
    }
  };

  const stopRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    setTranscribingAudio(true);
    try {
      await new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
        recorder.stop();
      });
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      audioChunksRef.current = [];
      if (!blob.size) {
        setError('No audio was captured. Please try again.');
        return;
      }
      const audioFile = new File([blob], `maic-${Date.now()}.webm`, { type: 'audio/webm' });
      const result = await aiClassroomApi.transcribeAudio(audioFile);
      if (result.success && result.text?.trim()) {
        setComposer((prev) => (prev.trim() ? `${prev}\n${result.text!.trim()}` : result.text!.trim()));
      } else {
        setError(result.message || 'Voice transcription failed.');
      }
    } catch {
      setError('Voice transcription failed. Please try again.');
    } finally {
      setIsRecording(false);
      setTranscribingAudio(false);
      mediaRecorderRef.current = null;
    }
  };

  const outlineBlock = useMemo(() => {
    if (!outline) return null;
    const objs = outline.objectives;
    return (
      <div className="ai-classroom-outline">
        <strong>{outline.title || 'Lesson outline'}</strong>
        {objs && objs.length > 0 ? (
          <ul>
            {objs.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }, [outline]);

  const activeSlide = useMemo(() => {
    if (!slides.length) return null;
    if (!activeSlideId) return slides[slides.length - 1] || null;
    return slides.find((s) => s.id === activeSlideId) || slides[slides.length - 1] || null;
  }, [slides, activeSlideId]);

  const latestClassmateRow = useMemo(
    () => [...rows].reverse().find((row) => row.sender === 'classmate' && row.kind !== 'whiteboard') || null,
    [rows]
  );

  const latestNoteRow = useMemo(
    () => [...rows].reverse().find((row) => row.sender === 'note_taker' && row.kind !== 'whiteboard') || null,
    [rows]
  );

  const noteBullets = useMemo(() => {
    const raw = latestNoteRow?.content || '';
    return raw
      .split('\n')
      .map((line) => line.replace(/^Quick notes:\s*/i, '').trim())
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [latestNoteRow]);

  useEffect(() => {
    if (!activeSlide) {
      setActiveFocusCue('');
      return;
    }
    setActiveFocusCue(focusCueForSlide(activeSlide, activeFocusIdx));
  }, [activeSlide, activeFocusIdx]);

  const canContinue = Boolean(sessionId) && !streaming && !quizQuestions && stage !== 'complete';
  const showComposer = Boolean(sessionId) && !quizQuestions && stage !== 'complete';

  return (
    <div className={`ai-classroom-page${!sessionId ? ' ai-classroom-page--setup' : ''}`}>
      {sessionId ? (
        <header className="ai-classroom-header">
          <div>
            <Link to="/app" className="ai-classroom-back">
              <ArrowLeft size={18} />
              Dashboard
            </Link>
            <div className="ai-classroom-title-block">
              <h1>AI Classroom</h1>
              <p className="ai-classroom-meta">
                Projected slides, live focus highlighting, speech input, and classmate group chat.
              </p>
            </div>
          </div>
          <div className="ai-classroom-header-actions">
            <label className="ai-classroom-toggle">
              <input
                type="checkbox"
                checked={autoReadTeacher}
                onChange={(e) => setAutoReadTeacher(e.target.checked)}
              />
              Continuous narration
            </label>
            <label className="ai-classroom-toggle">
              <input
                type="checkbox"
                checked={autoFlow}
                onChange={(e) => setAutoFlow(e.target.checked)}
              />
              Auto lesson flow
            </label>
            <button type="button" className="ai-classroom-tool-btn" onClick={() => stopSpeaking(true)}>
              Stop audio
            </button>
            <button type="button" className="ai-classroom-tool-btn" onClick={handleExportMarkdown}>
              <Download size={16} aria-hidden />
              Export .md
            </button>
            <div className="ai-classroom-stage-pill">{stage.replace(/_/g, ' ')}</div>
          </div>
        </header>
      ) : null}

      {!sessionId ? (
        <AIClassroomSetupPage
          credits={user?.credits ?? 0}
          subject={subject}
          onSubjectChange={setSubject}
          formNumber={formSpec.form}
          onFormNumberChange={(n) => setFormSpec((s) => ({ ...s, form: n }))}
          curriculumLevel={formSpec.level}
          onCurriculumLevelChange={(l) => setFormSpec((s) => ({ ...s, level: l }))}
          topic={topic}
          onTopicChange={setTopic}
          voiceMode={voiceMode}
          onVoiceModeChange={setVoiceMode}
          error={error}
          historyLoading={historyLoading}
          historyItems={historyItems}
          resumingId={resumingId}
          onResumeSession={(id) => void applyPlayback(id)}
          starting={starting}
          startHint={startHint}
          onStart={() => void handleStart()}
        />
      ) : (
        <>
          {outlineBlock}
          {error ? <div className="ai-classroom-error">{error}</div> : null}

          <section className="ai-classroom-projector">
            <div className="ai-classroom-projector-head">
              <div>
                <p className="ai-classroom-projector-tag">Projected slide</p>
                <h3>{activeSlide?.title || 'Slide projection starts as the teacher responds.'}</h3>
              </div>
              <div className="ai-classroom-projector-status">
                {activeNarrationRowId ? 'Teacher speaking' : streaming ? 'Building next segment' : 'Ready'}
              </div>
            </div>
            {activeSlide ? (
              <>
                <div className="ai-classroom-focus-banner" aria-live="polite">
                  <span className="ai-classroom-focus-banner-label">Teacher focus</span>
                  <span className="ai-classroom-focus-banner-text">
                    {activeFocusCue || focusCueForSlide(activeSlide, activeFocusIdx)}
                  </span>
                </div>
                <ol className="ai-classroom-slide-points">
                  {activeSlide.points.map((p, i) => (
                    <li
                      key={`${activeSlide.id}-${i}`}
                      className={i === activeFocusIdx ? 'is-active' : ''}
                    >
                      {p}
                    </li>
                  ))}
                </ol>
                {activeSlide.focus.length ? (
                  <div className="ai-classroom-focus-tags">
                    {activeSlide.focus.map((kw, i) => (
                      <span key={`${activeSlide.id}-${kw}`} className={i === activeFocusIdx ? 'is-active' : ''}>
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : null}
                {activeSlide.board ? (
                  <MaicWhiteboard
                    spec={activeSlide.board}
                    focused={Boolean(
                      activeNarrationRowId && activeSlide.sourceRowId === activeNarrationRowId
                    )}
                    focusHint={activeSlide.focus[activeFocusIdx] || activeSlide.focus[0] || null}
                  />
                ) : null}
              </>
            ) : null}
            {slides.length > 1 ? (
              <div className="ai-classroom-slide-strip">
                {slides.slice(-6).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`ai-classroom-slide-chip${activeSlide?.id === s.id ? ' is-active' : ''}`}
                    onClick={() => {
                      setActiveSlideId(s.id);
                      setActiveFocusIdx(0);
                      setActiveFocusCue(focusCueForSlide(s, 0));
                    }}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="ai-classroom-sync-panel">
            <div className="ai-classroom-sync-card ai-classroom-sync-card--focus">
              <div className="ai-classroom-sync-label">Classroom sync</div>
              <div className="ai-classroom-sync-title">
                {activeNarrationRowId ? 'Teacher is leading this point now' : 'Current projected focus'}
              </div>
              <p className="ai-classroom-sync-text">
                {activeFocusCue || activeSlide?.title || 'The projector will update as the lesson progresses.'}
              </p>
            </div>

            <button
              type="button"
              className="ai-classroom-sync-card ai-classroom-sync-card--classmate"
              onClick={() => {
                if (!latestClassmateRow?.relatedSlideId) return;
                setActiveSlideId(latestClassmateRow.relatedSlideId);
                setActiveFocusIdx(latestClassmateRow.relatedFocusIdx ?? 0);
              }}
              disabled={!latestClassmateRow?.relatedSlideId}
            >
              <div className="ai-classroom-sync-label">Classmate reaction</div>
              <div className="ai-classroom-sync-title">Chido is responding to this idea</div>
              <p className="ai-classroom-sync-text">
                {latestClassmateRow?.content || 'A classmate question will appear here during concept teaching.'}
              </p>
            </button>

            <button
              type="button"
              className="ai-classroom-sync-card ai-classroom-sync-card--notes"
              onClick={() => {
                if (!latestNoteRow?.relatedSlideId) return;
                setActiveSlideId(latestNoteRow.relatedSlideId);
                setActiveFocusIdx(latestNoteRow.relatedFocusIdx ?? 0);
              }}
              disabled={!latestNoteRow?.relatedSlideId}
            >
              <div className="ai-classroom-sync-label">Note-taker</div>
              <div className="ai-classroom-sync-title">Tari is writing the revision points</div>
              {noteBullets.length ? (
                <ul className="ai-classroom-sync-list">
                  {noteBullets.map((item, idx) => (
                    <li key={`${idx}-${item}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="ai-classroom-sync-text">
                  Structured notes will collect here as the teacher moves through each point.
                </p>
              )}
            </button>
          </section>

          <section className="ai-classroom-chat">
            <div className="ai-classroom-chat-head">
              <h3>Group chat</h3>
            </div>
            <div className="ai-classroom-messages">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className={`ai-classroom-bubble ai-classroom-bubble--${r.sender}${
                    r.kind === 'whiteboard' ? ' ai-classroom-bubble--board' : ''
                  }${activeNarrationRowId === r.id ? ' ai-classroom-bubble--speaking' : ''}`}
                >
                  <div className="ai-classroom-bubble-head">
                    <div className="ai-classroom-bubble-label">
                      {r.sender === 'teacher'
                        ? r.kind === 'whiteboard'
                          ? 'Mr. Moyo - board'
                          : 'Mr. Moyo'
                        : r.sender === 'classmate'
                          ? 'Chido (classmate)'
                          : r.sender === 'note_taker'
                            ? 'Tari (notes)'
                            : 'You'}
                    </div>
                    {r.sender === 'teacher' && r.kind !== 'whiteboard' && r.content.trim() ? (
                      <button
                        type="button"
                        className="ai-classroom-speak-btn"
                        aria-label="Read aloud"
                        disabled={ttsLoadingId === r.id}
                        onClick={() =>
                          enqueueSpeech(r.content, r.id, slideMapRef.current[r.id], true)
                        }
                      >
                        {ttsLoadingId === r.id ? (
                          <Loader2 size={14} className="spin" aria-hidden />
                        ) : (
                          <Volume2 size={14} aria-hidden />
                        )}
                      </button>
                    ) : null}
                  </div>
                  {r.kind === 'whiteboard' && r.board ? (
                    <MaicWhiteboard spec={r.board} />
                  ) : (
                    <MathRenderer
                      content={r.content}
                      fontSize={15}
                      className={`ai-classroom-msg-content ai-classroom-msg-content--${r.sender}`}
                    />
                  )}
                </div>
              ))}
              {liveTeacher ? <div className="ai-classroom-live">{liveTeacher}</div> : null}
              {streaming && !liveTeacher ? (
                <div className="ai-classroom-live" style={{ borderStyle: 'solid' }}>
                  <Loader2 size={18} className="spin" style={{ marginRight: 8 }} />
                  Working...
                </div>
              ) : null}
            </div>
          </section>

          {quizQuestions ? (
            <div className="ai-classroom-quiz">
              <h3>Quiz checkpoint</h3>
              {quizQuestions.map((q) => (
                <div key={q.id} className="ai-classroom-quiz-q">
                  <p>{q.question}</p>
                  {q.type === 'mcq' && q.options ? (
                    q.options.map((opt, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={quizDraft[q.id] === opt}
                          onChange={() => setQuizDraft((d) => ({ ...d, [q.id]: opt }))}
                        />{' '}
                        {opt}
                      </label>
                    ))
                  ) : (
                    <textarea
                      value={quizDraft[q.id] || ''}
                      onChange={(e) => setQuizDraft((d) => ({ ...d, [q.id]: e.target.value }))}
                      placeholder="Your answer"
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                className="ai-classroom-primary"
                onClick={() => void handleSubmitQuiz()}
                disabled={streaming}
              >
                Submit quiz
              </button>
            </div>
          ) : null}

          <div className="ai-classroom-footer">
            <button
              type="button"
              className="ai-classroom-primary"
              onClick={() => void runNextSegment()}
              disabled={!canContinue}
            >
              {stage === 'complete' ? 'Lesson complete' : autoFlow ? 'Run segment now' : 'Next lesson part'}
            </button>
            {stage === 'complete' ? (
              <button
                type="button"
                className="ai-classroom-secondary"
                onClick={() => navigate('/app')}
              >
                Back to dashboard
              </button>
            ) : null}
            {showComposer ? (
              <div className="ai-classroom-compose">
                <textarea
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  placeholder={isRecording ? 'Recording... tap stop to transcribe' : 'Ask in group chat...'}
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void handleSendStudent();
                    }
                  }}
                />
                <button
                  type="button"
                  className={`ai-classroom-mic-btn${isRecording ? ' is-recording' : ''}`}
                  onClick={() => {
                    if (isRecording) void stopRecording();
                    else void startRecording();
                  }}
                  disabled={!sessionId || sending || streaming || transcribingAudio}
                  aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                >
                  {isRecording ? <Square size={15} aria-hidden /> : <Mic size={15} aria-hidden />}
                </button>
                <button
                  type="button"
                  onClick={() => void handleSendStudent()}
                  disabled={sending || !composer.trim()}
                >
                  Send
                </button>
              </div>
            ) : null}
            {transcribingAudio ? (
              <div className="ai-classroom-audio-status" role="status" aria-live="polite">
                <Loader2 size={14} className="spin" aria-hidden />
                <span>Transcribing audio...</span>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
