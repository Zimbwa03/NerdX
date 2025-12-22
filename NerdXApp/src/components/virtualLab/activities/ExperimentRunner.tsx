import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

import { useThemedColors } from '../../../theme/useThemedStyles';
import { ExperimentRunnerConfig } from '../../../data/virtualLab';
import { evalCondition, evalFormula } from './exprEval';

export interface ExperimentRunnerResult {
  completedTasks: string[];
  progressPercent: number;
  isComplete: boolean;
}

interface Props {
  config: ExperimentRunnerConfig;
  onProgress?: (result: ExperimentRunnerResult) => void;
}

export const ExperimentRunner: React.FC<Props> = ({ config, onProgress }) => {
  const themedColors = useThemedColors();

  const initialControls = useMemo(() => {
    const obj: Record<string, number> = {};
    for (const c of config.controls) obj[c.id] = c.defaultValue;
    return obj;
  }, [config.controls]);

  const [values, setValues] = useState<Record<string, number>>(initialControls);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const readouts = useMemo(() => {
    const vars: Record<string, number> = { ...values };
    // compute readouts and add into vars for conditions
    const computed: Record<string, number> = {};
    for (const r of config.readouts) {
      computed[r.id] = evalFormula(r.formula, vars);
      vars[r.id] = computed[r.id];
    }
    return { vars, computed };
  }, [values, config.readouts]);

  const required = config.requiredTasksToUnlock ?? config.tasks.length;
  const isComplete = completedTasks.length >= Math.min(required, config.tasks.length);
  const progressPercent =
    config.tasks.length > 0 ? Math.round((completedTasks.length / config.tasks.length) * 100) : 100;

  const notify = (nextCompleted: string[]) => {
    const res: ExperimentRunnerResult = {
      completedTasks: nextCompleted,
      progressPercent,
      isComplete: nextCompleted.length >= Math.min(required, config.tasks.length),
    };
    onProgress?.(res);
  };

  const checkTask = (taskId: string) => {
    const task = config.tasks.find(t => t.id === taskId);
    if (!task) return;
    if (completedTasks.includes(taskId)) return;

    const ok = evalCondition(task.condition, readouts.vars);
    if (ok) {
      const next = [...completedTasks, taskId];
      setCompletedTasks(next);
      notify(next);
    }
  };

  const reset = () => {
    setValues(initialControls);
    setCompletedTasks([]);
    notify([]);
  };

  return (
    <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
      {config.intro && (
        <Text style={[styles.intro, { color: themedColors.text.secondary }]}>{config.intro}</Text>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Controls</Text>
        {config.controls.map(c => (
          <View key={c.id} style={styles.controlRow}>
            <View style={styles.controlHeader}>
              <Text style={[styles.controlLabel, { color: themedColors.text.primary }]}>{c.label}</Text>
              <Text style={[styles.controlValue, { color: themedColors.primary.main }]}>
                {values[c.id].toFixed(Math.max(0, decimalsForStep(c.step)))}
                {c.unit ? ` ${c.unit}` : ''}
              </Text>
            </View>
            <Slider
              minimumValue={c.min}
              maximumValue={c.max}
              step={c.step}
              value={values[c.id]}
              onValueChange={(v: number) => setValues(prev => ({ ...prev, [c.id]: v }))}
              minimumTrackTintColor={themedColors.primary.main}
              maximumTrackTintColor={themedColors.text.secondary + '30'}
              thumbTintColor={themedColors.primary.main}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Readouts</Text>
        <View style={styles.readoutsGrid}>
          {config.readouts.map(r => {
            const val = readouts.computed[r.id] ?? 0;
            const decimals = r.decimals ?? 2;
            return (
              <View key={r.id} style={[styles.readoutBox, { backgroundColor: themedColors.background.subtle }]}>
                <Text style={[styles.readoutLabel, { color: themedColors.text.secondary }]}>{r.label}</Text>
                <Text style={[styles.readoutValue, { color: themedColors.text.primary }]}>
                  {val.toFixed(decimals)}
                  {r.unit ? ` ${r.unit}` : ''}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.tasksHeader}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Tasks</Text>
          <Text style={[styles.tasksProgress, { color: themedColors.primary.main }]}>
            {completedTasks.length}/{config.tasks.length}
          </Text>
        </View>

        {config.tasks.map(t => {
          const done = completedTasks.includes(t.id);
          return (
            <View
              key={t.id}
              style={[
                styles.taskRow,
                { borderColor: themedColors.text.secondary + '20' },
                done ? { backgroundColor: '#4CAF5010', borderColor: '#4CAF50' } : null,
              ]}
            >
              <Ionicons
                name={done ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={done ? '#4CAF50' : themedColors.text.secondary}
              />
              <Text style={[styles.taskText, { color: themedColors.text.primary }]}>{t.instruction}</Text>
              <TouchableOpacity
                style={[styles.taskCheckBtn, { backgroundColor: done ? '#4CAF50' : themedColors.primary.main }]}
                onPress={() => checkTask(t.id)}
                disabled={done}
              >
                <Text style={styles.taskCheckBtnText}>{done ? 'Done' : 'Check'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity style={[styles.resetBtn, { borderColor: themedColors.primary.main }]} onPress={reset}>
          <Ionicons name="refresh" size={18} color={themedColors.primary.main} />
          <Text style={[styles.resetBtnText, { color: themedColors.primary.main }]}>Reset</Text>
        </TouchableOpacity>

        <View style={[styles.unlockBadge, { backgroundColor: isComplete ? '#4CAF5020' : '#FF980020' }]}>
          <Ionicons name={isComplete ? 'lock-open' : 'lock-closed'} size={16} color={isComplete ? '#4CAF50' : '#FF9800'} />
          <Text style={[styles.unlockText, { color: isComplete ? '#4CAF50' : '#FF9800' }]}>
            {isComplete ? 'Knowledge Check Unlocked' : `Complete ${Math.min(required, config.tasks.length)} tasks to unlock`}
          </Text>
        </View>
      </View>
    </View>
  );
};

function decimalsForStep(step: number): number {
  const s = String(step);
  const idx = s.indexOf('.');
  if (idx === -1) return 0;
  return Math.min(3, s.length - idx - 1);
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16 },
  intro: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },
  controlRow: { marginBottom: 12 },
  controlHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  controlLabel: { fontSize: 13, fontWeight: '700' },
  controlValue: { fontSize: 13, fontWeight: '800' },
  readoutsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  readoutBox: { width: '48%', padding: 12, borderRadius: 12 },
  readoutLabel: { fontSize: 11, marginBottom: 4 },
  readoutValue: { fontSize: 16, fontWeight: '800' },
  tasksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tasksProgress: { fontSize: 13, fontWeight: '900' },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  taskText: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  taskCheckBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  taskCheckBtnText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  footerButtons: { marginTop: 6, gap: 10 },
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
  resetBtnText: { fontWeight: '800' },
  unlockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  unlockText: { fontSize: 12, fontWeight: '800' },
});

export default ExperimentRunner;

