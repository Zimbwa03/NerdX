import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { HandsOnActivityConfig } from '../../../data/virtualLab';
import { useThemedColors } from '../../../theme/useThemedStyles';
import { ExperimentRunner, ExperimentRunnerResult } from './ExperimentRunner';
import { MatchingLab, MatchingLabResult } from './MatchingLab';
import { SequencingLab, SequencingLabResult } from './SequencingLab';

export type HandsOnProgress =
  | ({ type: 'experiment_runner' } & ExperimentRunnerResult)
  | ({ type: 'matching' } & MatchingLabResult)
  | ({ type: 'sequencing' } & SequencingLabResult);

interface Props {
  activity?: HandsOnActivityConfig;
  onProgress?: (progress: HandsOnProgress) => void;
}

export const HandsOnActivityRenderer: React.FC<Props> = ({ activity, onProgress }) => {
  const themedColors = useThemedColors();

  if (!activity) {
    return (
      <View style={[styles.placeholder, { backgroundColor: themedColors.background.paper }]}>
        <Text style={[styles.placeholderTitle, { color: themedColors.text.primary }]}>
          Hands-on activity coming soon
        </Text>
        <Text style={[styles.placeholderText, { color: themedColors.text.secondary }]}>
          This simulation doesn’t have an interactive activity configured yet.
        </Text>
      </View>
    );
  }

  switch (activity.type) {
    case 'experiment_runner':
      return (
        <ExperimentRunner
          config={activity}
          onProgress={(p) => onProgress?.({ type: 'experiment_runner', ...p })}
        />
      );
    case 'matching':
      return (
        <MatchingLab
          config={activity}
          onProgress={(p) => onProgress?.({ type: 'matching', ...p })}
        />
      );
    case 'sequencing':
      return (
        <SequencingLab
          config={activity}
          onProgress={(p) => onProgress?.({ type: 'sequencing', ...p })}
        />
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  placeholder: { padding: 16, borderRadius: 16 },
  placeholderTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  placeholderText: { fontSize: 13, lineHeight: 18 },
});

export default HandsOnActivityRenderer;

