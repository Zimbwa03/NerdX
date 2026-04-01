import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { MaicHistorySession } from '../../../services/api/aiClassroomApi';
import { lineForSubject, subjectOptionFromLine, type LevelKind } from './subjectData';
import './AiClassroomSetup.css';
import { ClassroomHero } from './ClassroomHero';
import { FormLevelControl } from './FormLevelControl';
import { HowItWorksModal } from './HowItWorksModal';
import { LaunchButton } from './LaunchButton';
import { RecentSessionsCard } from './RecentSessionsCard';
import { SessionPreviewCard } from './SessionPreviewCard';
import { SubjectSelector } from './SubjectSelector';
import { TopicInput } from './TopicInput';
import type { VoiceMode } from './VoiceToggle';
import { VoiceToggle } from './VoiceToggle';

type Curriculum = LevelKind;

type Props = {
  credits: number;
  subject: string;
  onSubjectChange: (v: string) => void;
  formNumber: number;
  onFormNumberChange: (n: number) => void;
  curriculumLevel: Curriculum;
  onCurriculumLevelChange: (l: Curriculum) => void;
  topic: string;
  onTopicChange: (v: string) => void;
  voiceMode: VoiceMode;
  onVoiceModeChange: (m: VoiceMode) => void;
  error: string | null;
  historyLoading: boolean;
  historyItems: MaicHistorySession[];
  resumingId: string | null;
  onResumeSession: (id: string) => void;
  starting: boolean;
  startHint: string | null;
  onStart: () => void;
};

export function AIClassroomSetupPage({
  credits,
  subject,
  onSubjectChange,
  formNumber,
  onFormNumberChange,
  curriculumLevel,
  onCurriculumLevelChange,
  topic,
  onTopicChange,
  voiceMode,
  onVoiceModeChange,
  error,
  historyLoading,
  historyItems,
  resumingId,
  onResumeSession,
  starting,
  startHint,
  onStart,
}: Props) {
  const [howOpen, setHowOpen] = useState(false);

  useEffect(() => {
    const opt = subjectOptionFromLine(subject);
    if (!opt) return;
    const next = lineForSubject(opt, curriculumLevel);
    if (next !== subject.trim()) onSubjectChange(next);
  }, [curriculumLevel, subject, onSubjectChange]);

  return (
    <div className="min-h-0 flex-1 bg-classroom-base font-dm text-classroom-text-primary antialiased">
      <ClassroomHero credits={credits} onOpenHowItWorks={() => setHowOpen(true)} />
      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} />

      <div className="mx-auto max-w-[1400px] px-6 py-8 md:px-10 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <motion.div
            className="w-full shrink-0 lg:w-[55%] lg:max-w-[640px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-[20px] border border-classroom-border bg-classroom-surface p-8">
              <h2 className="font-sora text-base font-semibold text-classroom-text-primary">
                Configure your session
              </h2>
              <p className="mt-1 text-[13px] text-classroom-text-secondary">
                Customise below and your AI teacher will prepare a full structured lesson.
              </p>
              <div className="my-4 border-t border-classroom-border" />

              <div className="flex flex-col gap-6">
                <SubjectSelector
                  subject={subject}
                  level={curriculumLevel}
                  onSubjectChange={onSubjectChange}
                />
                <FormLevelControl
                  form={formNumber}
                  level={curriculumLevel}
                  onFormChange={onFormNumberChange}
                  onLevelChange={onCurriculumLevelChange}
                />
                <TopicInput topic={topic} onTopicChange={onTopicChange} />
                <VoiceToggle value={voiceMode} onChange={onVoiceModeChange} />
              </div>

              {error ? (
                <p
                  className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col items-center">
                <LaunchButton
                  loading={starting}
                  disabled={!subject.trim()}
                  onClick={onStart}
                  creditsLabel={credits.toLocaleString()}
                />
                {starting && startHint ? (
                  <p className="mt-2 text-center text-xs text-classroom-text-secondary" aria-live="polite">
                    {startHint}
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>

          <div className="w-full flex-1 lg:w-[45%] lg:min-w-0">
            <SessionPreviewCard />
            <RecentSessionsCard
              loading={historyLoading}
              items={historyItems}
              resumingId={resumingId}
              onResume={onResumeSession}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
