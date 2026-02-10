import type { HandsOnActivityConfig } from '../../../data/virtualLab';
import { ExperimentRunner, type ExperimentRunnerResult } from './ExperimentRunner';
import { MatchingLab, type MatchingLabResult } from './MatchingLab';
import { SequencingLab, type SequencingLabResult } from './SequencingLab';

export type HandsOnProgress =
  | ({ type: 'experiment_runner' } & ExperimentRunnerResult)
  | ({ type: 'matching' } & MatchingLabResult)
  | ({ type: 'sequencing' } & SequencingLabResult);

interface Props {
  activity?: HandsOnActivityConfig;
  onProgress?: (progress: HandsOnProgress) => void;
}

export function HandsOnActivityRenderer({ activity, onProgress }: Props) {
  if (!activity) {
    return (
      <div className="vl-card">
        <div className="vl-card-title">Hands-on activity coming soon</div>
        <div className="vl-card-subtitle">
          This simulation doesn&apos;t have an interactive activity configured yet.
        </div>
      </div>
    );
  }

  switch (activity.type) {
    case 'experiment_runner':
      return <ExperimentRunner config={activity} onProgress={(p) => onProgress?.({ type: 'experiment_runner', ...p })} />;
    case 'matching':
      return <MatchingLab config={activity} onProgress={(p) => onProgress?.({ type: 'matching', ...p })} />;
    case 'sequencing':
      return <SequencingLab config={activity} onProgress={(p) => onProgress?.({ type: 'sequencing', ...p })} />;
    default:
      return null;
  }
}

