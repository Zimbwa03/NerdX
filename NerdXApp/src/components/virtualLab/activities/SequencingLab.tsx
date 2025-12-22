import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useThemedColors } from '../../../theme/useThemedStyles';
import { SequencingActivityConfig } from '../../../data/virtualLab';

export interface SequencingLabResult {
  placed: number;
  total: number;
  isComplete: boolean;
}

interface Props {
  config: SequencingActivityConfig;
  onProgress?: (result: SequencingLabResult) => void;
}

export const SequencingLab: React.FC<Props> = ({ config, onProgress }) => {
  const themedColors = useThemedColors();

  const shuffled = useMemo(() => shuffle(config.steps), [config.steps]);
  const [chosen, setChosen] = useState<string[]>([]);

  const required = config.requiredCorrectToUnlock ?? config.steps.length;

  const correctSoFar = chosen.filter((s, idx) => config.steps[idx] === s).length;
  const isComplete = correctSoFar >= Math.min(required, config.steps.length) && chosen.length === config.steps.length;

  const notify = (nextChosen: string[]) => {
    const correct = nextChosen.filter((s, idx) => config.steps[idx] === s).length;
    onProgress?.({
      placed: correct,
      total: config.steps.length,
      isComplete: correct >= Math.min(required, config.steps.length) && nextChosen.length === config.steps.length,
    });
  };

  const pick = (step: string) => {
    if (chosen.includes(step)) return;
    const next = [...chosen, step];
    setChosen(next);
    notify(next);
  };

  const undo = () => {
    if (chosen.length === 0) return;
    const next = chosen.slice(0, -1);
    setChosen(next);
    notify(next);
  };

  const reset = () => {
    setChosen([]);
    notify([]);
  };

  return (
    <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
      {config.prompt && (
        <Text style={[styles.prompt, { color: themedColors.text.secondary }]}>{config.prompt}</Text>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Build the correct order</Text>
        {config.steps.map((_, idx) => {
          const val = chosen[idx];
          const correct = val ? (val === config.steps[idx]) : null;
          return (
            <View
              key={idx}
              style={[
                styles.slot,
                { borderColor: themedColors.text.secondary + '20', backgroundColor: themedColors.background.subtle },
                correct === true ? { borderColor: '#4CAF50', backgroundColor: '#4CAF5010' } : null,
                correct === false ? { borderColor: '#F44336', backgroundColor: '#F4433610' } : null,
              ]}
            >
              <Text style={[styles.slotIndex, { color: themedColors.text.secondary }]}>{idx + 1}.</Text>
              <Text style={[styles.slotText, { color: themedColors.text.primary }]}>
                {val || 'Tap a step below'}
              </Text>
              {correct === true && <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />}
              {correct === false && <Ionicons name="close-circle" size={18} color="#F44336" />}
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Steps</Text>
        <View style={styles.stepsWrap}>
          {shuffled.map(step => {
            const used = chosen.includes(step);
            return (
              <TouchableOpacity
                key={step}
                style={[
                  styles.stepChip,
                  { backgroundColor: themedColors.background.subtle, borderColor: themedColors.text.secondary + '20' },
                  used ? { opacity: 0.5 } : null,
                ]}
                onPress={() => pick(step)}
                disabled={used || chosen.length >= config.steps.length}
              >
                <Text style={[styles.stepText, { color: themedColors.text.primary }]}>{step}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerBtns}>
          <TouchableOpacity style={[styles.btn, { borderColor: themedColors.primary.main }]} onPress={undo}>
            <Ionicons name="arrow-undo" size={18} color={themedColors.primary.main} />
            <Text style={[styles.btnText, { color: themedColors.primary.main }]}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, { borderColor: themedColors.primary.main }]} onPress={reset}>
            <Ionicons name="refresh" size={18} color={themedColors.primary.main} />
            <Text style={[styles.btnText, { color: themedColors.primary.main }]}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.unlockBadge, { backgroundColor: isComplete ? '#4CAF5020' : '#FF980020' }]}>
          <Ionicons name={isComplete ? 'lock-open' : 'lock-closed'} size={16} color={isComplete ? '#4CAF50' : '#FF9800'} />
          <Text style={[styles.unlockText, { color: isComplete ? '#4CAF50' : '#FF9800' }]}>
            {isComplete ? 'Knowledge Check Unlocked' : `Correct steps: ${correctSoFar}/${config.steps.length}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

function shuffle(arr: string[]): string[] {
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
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  slotIndex: { width: 22, fontWeight: '900' },
  slotText: { flex: 1, fontSize: 13, fontWeight: '600' },
  stepsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stepChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, maxWidth: '100%' },
  stepText: { fontSize: 12, fontWeight: '700' },
  footer: { marginTop: 12, gap: 10 },
  footerBtns: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  btnText: { fontWeight: '800' },
  unlockBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  unlockText: { fontSize: 12, fontWeight: '800' },
});

export default SequencingLab;

