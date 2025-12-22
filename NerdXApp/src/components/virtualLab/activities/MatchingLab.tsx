import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemedColors } from '../../../theme/useThemedStyles';
import { MatchingActivityConfig } from '../../../data/virtualLab';

export interface MatchingLabResult {
  correctPairs: number;
  totalPairs: number;
  isComplete: boolean;
}

interface Props {
  config: MatchingActivityConfig;
  onProgress?: (result: MatchingLabResult) => void;
}

export const MatchingLab: React.FC<Props> = ({ config, onProgress }) => {
  const themedColors = useThemedColors();

  const leftItems = useMemo(() => config.pairs.map(p => p.left), [config.pairs]);
  const rightItems = useMemo(() => shuffle(config.pairs.map(p => p.right)), [config.pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrongFlash, setWrongFlash] = useState(false);

  const required = config.requiredCorrectToUnlock ?? config.pairs.length;
  const correctPairs = Object.keys(matched).filter(l => {
    const r = matched[l];
    const pair = config.pairs.find(p => p.left === l);
    return pair?.right === r;
  }).length;
  const isComplete = correctPairs >= Math.min(required, config.pairs.length);

  const notify = (nextMatched: Record<string, string>) => {
    const correct = Object.keys(nextMatched).filter(l => {
      const r = nextMatched[l];
      const pair = config.pairs.find(p => p.left === l);
      return pair?.right === r;
    }).length;
    onProgress?.({ correctPairs: correct, totalPairs: config.pairs.length, isComplete: correct >= Math.min(required, config.pairs.length) });
  };

  const pickRight = (right: string) => {
    if (!selectedLeft) return;
    const expected = config.pairs.find(p => p.left === selectedLeft)?.right;
    if (expected === right) {
      const next = { ...matched, [selectedLeft]: right };
      setMatched(next);
      setSelectedLeft(null);
      notify(next);
    } else {
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 250);
    }
  };

  const reset = () => {
    setSelectedLeft(null);
    setMatched({});
    notify({});
  };

  return (
    <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
      {config.prompt && (
        <Text style={[styles.prompt, { color: themedColors.text.secondary }]}>{config.prompt}</Text>
      )}

      <View style={styles.grid}>
        <View style={styles.col}>
          <Text style={[styles.colTitle, { color: themedColors.text.primary }]}>Left</Text>
          {leftItems.map(item => {
            const done = matched[item] !== undefined;
            const isSel = selectedLeft === item;
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.pill,
                  { backgroundColor: themedColors.background.subtle, borderColor: themedColors.text.secondary + '20' },
                  isSel ? { borderColor: themedColors.primary.main, backgroundColor: themedColors.primary.main + '15' } : null,
                  done ? { backgroundColor: '#4CAF5010', borderColor: '#4CAF50' } : null,
                ]}
                onPress={() => !done && setSelectedLeft(item)}
                disabled={done}
              >
                <Ionicons
                  name={done ? 'checkmark-circle' : isSel ? 'radio-button-on' : 'radio-button-off'}
                  size={18}
                  color={done ? '#4CAF50' : isSel ? themedColors.primary.main : themedColors.text.secondary}
                />
                <Text style={[styles.pillText, { color: themedColors.text.primary }]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.col}>
          <Text style={[styles.colTitle, { color: themedColors.text.primary }]}>Right</Text>
          {rightItems.map(item => {
            const used = Object.values(matched).includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.pill,
                  { backgroundColor: themedColors.background.subtle, borderColor: themedColors.text.secondary + '20' },
                  wrongFlash ? { borderColor: '#F44336' } : null,
                  used ? { opacity: 0.5 } : null,
                ]}
                onPress={() => !used && pickRight(item)}
                disabled={used}
              >
                <Ionicons name="link" size={18} color={themedColors.text.secondary} />
                <Text style={[styles.pillText, { color: themedColors.text.primary }]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.resetBtn, { borderColor: themedColors.primary.main }]} onPress={reset}>
          <Ionicons name="refresh" size={18} color={themedColors.primary.main} />
          <Text style={[styles.resetText, { color: themedColors.primary.main }]}>Reset</Text>
        </TouchableOpacity>

        <View style={[styles.unlockBadge, { backgroundColor: isComplete ? '#4CAF5020' : '#FF980020' }]}>
          <Ionicons name={isComplete ? 'lock-open' : 'lock-closed'} size={16} color={isComplete ? '#4CAF50' : '#FF9800'} />
          <Text style={[styles.unlockText, { color: isComplete ? '#4CAF50' : '#FF9800' }]}>
            {isComplete ? 'Knowledge Check Unlocked' : `Match ${Math.min(required, config.pairs.length)} to unlock`}
          </Text>
        </View>
      </View>
    </View>
  );
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16 },
  prompt: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  grid: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  colTitle: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  pillText: { flex: 1, fontSize: 13, fontWeight: '600' },
  footer: { marginTop: 8, gap: 10 },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  resetText: { fontWeight: '800' },
  unlockBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  unlockText: { fontSize: 12, fontWeight: '800' },
});

export default MatchingLab;

