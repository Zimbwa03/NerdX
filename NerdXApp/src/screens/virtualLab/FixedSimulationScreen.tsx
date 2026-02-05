// Fixed Simulation Screen
// Generic interactive screen with a fixed simulation id

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';
import HandsOnActivityRenderer, { HandsOnProgress } from '../../components/virtualLab/activities/HandsOnActivityRenderer';

interface Props {
  simulationId: string;
  accentColor?: string;
  accentIcon?: keyof typeof Ionicons.glyphMap;
  accentLabel?: string;
}

const FixedSimulationScreen: React.FC<Props> = ({
  simulationId,
  accentColor = '#1976D2',
  accentIcon = 'calculator-outline',
  accentLabel = 'O-Level Focus',
}) => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();

  const simulation = getSimulationById(simulationId);

  const [showQuiz, setShowQuiz] = useState(false);
  const [handsOnComplete, setHandsOnComplete] = useState(false);
  const [handsOnProgress, setHandsOnProgress] = useState<HandsOnProgress | null>(null);

  const canTakeQuiz = simulation?.handsOnActivity ? handsOnComplete : true;

  const progressLabel = useMemo(() => {
    if (!handsOnProgress) return 'Hands-on: not started';
    if (handsOnProgress.type === 'experiment_runner') return `Hands-on: ${handsOnProgress.progressPercent}%`;
    if (handsOnProgress.type === 'matching') return `Hands-on: ${handsOnProgress.correctPairs}/${handsOnProgress.totalPairs} matched`;
    if (handsOnProgress.type === 'sequencing') return `Hands-on: ${handsOnProgress.placed}/${handsOnProgress.total} correct`;
    return 'Hands-on';
  }, [handsOnProgress]);

  if (!simulation) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.notFound}>
          <Ionicons name="alert-circle" size={36} color={themedColors.text.secondary} />
          <Text style={[styles.notFoundTitle, { color: themedColors.text.primary }]}>
            Simulation not found
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar barStyle="light-content" />

      <SimulationHeader
        title={simulation.title}
        subject={simulation.subject}
        learningObjectives={simulation.learningObjectives}
        onBack={() => navigation.goBack()}
        xpReward={simulation.xpReward}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.accentCard, { borderColor: accentColor + '40', backgroundColor: accentColor + '12' }]}>
          <View style={[styles.accentIconWrap, { backgroundColor: accentColor }]}>
            <Ionicons name={accentIcon} size={18} color="#FFF" />
          </View>
          <Text style={[styles.accentText, { color: accentColor }]}>{accentLabel}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.topic, { color: themedColors.text.secondary }]}>{simulation.topic}</Text>
          <Text style={[styles.desc, { color: themedColors.text.primary }]}>{simulation.description}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="hand-left" size={16} color={themedColors.text.secondary} />
            <Text style={[styles.metaText, { color: themedColors.text.secondary }]}>{progressLabel}</Text>
          </View>
        </View>

        <HandsOnActivityRenderer
          activity={simulation.handsOnActivity}
          onProgress={(p) => {
            setHandsOnProgress(p);
            if (p.type === 'experiment_runner') setHandsOnComplete(!!p.isComplete);
            if (p.type === 'matching') setHandsOnComplete(!!p.isComplete);
            if (p.type === 'sequencing') setHandsOnComplete(!!p.isComplete);
          }}
        />

        <TouchableOpacity
          style={[styles.completeButton, !canTakeQuiz && styles.completeButtonDisabled]}
          onPress={() => setShowQuiz(true)}
          disabled={!canTakeQuiz}
        >
          <Text style={styles.completeButtonText}>
            {canTakeQuiz ? 'Take Knowledge Check' : 'Complete the hands-on activity to unlock'}
          </Text>
          <Ionicons name={canTakeQuiz ? 'arrow-forward' : 'lock-closed'} size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>

      <KnowledgeCheck
        visible={showQuiz}
        simulation={simulation}
        onComplete={() => setShowQuiz(false)}
        onClose={() => setShowQuiz(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40, gap: 16 },
  card: { padding: 16, borderRadius: 16 },
  accentCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accentIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentText: { fontSize: 13, fontWeight: '800' },
  topic: { fontSize: 12, marginBottom: 6 },
  desc: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  metaText: { fontSize: 12, fontWeight: '700' },
  completeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonDisabled: { backgroundColor: '#9E9E9E' },
  completeButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 10 },
  notFoundTitle: { fontSize: 16, fontWeight: '700' },
  backBtn: { backgroundColor: '#1976D2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginTop: 6 },
  backBtnText: { color: '#FFF', fontWeight: '700' },
});

export default FixedSimulationScreen;
