// Generic Virtual Lab Template Screen
// Used for simulations that don't yet have a dedicated interactive screen

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

type RouteParams = { simulationId: string };

const VirtualLabTemplateScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const themedColors = useThemedColors();

  const { simulationId } = (route.params || {}) as RouteParams;
  const simulation = getSimulationById(simulationId);

  const [checkedObjectives, setCheckedObjectives] = useState<Record<string, boolean>>({});
  const [showQuiz, setShowQuiz] = useState(false);

  const objectives = simulation?.learningObjectives || [];
  const completedCount = useMemo(
    () => objectives.filter(o => checkedObjectives[o.id]).length,
    [objectives, checkedObjectives]
  );
  const progress = objectives.length > 0 ? Math.round((completedCount / objectives.length) * 100) : 0;

  const canTakeQuiz = objectives.length === 0 ? true : completedCount >= Math.min(2, objectives.length);

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
        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.topic, { color: themedColors.text.secondary }]}>
            {simulation.topic}
          </Text>
          <Text style={[styles.title, { color: themedColors.text.primary }]}>
            {simulation.description}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>
              Activity Checklist
            </Text>
            <Text style={[styles.progressText, { color: themedColors.primary.main }]}>
              {progress}%
            </Text>
          </View>

          <View style={[styles.progressBarBg, { backgroundColor: themedColors.background.subtle }]}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>

          {objectives.map(obj => {
            const checked = !!checkedObjectives[obj.id];
            return (
              <TouchableOpacity
                key={obj.id}
                style={[
                  styles.objectiveRow,
                  { borderColor: themedColors.text.secondary + '20' },
                  checked ? { backgroundColor: '#4CAF5010' } : null
                ]}
                onPress={() => setCheckedObjectives(prev => ({ ...prev, [obj.id]: !prev[obj.id] }))}
              >
                <Ionicons
                  name={checked ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={checked ? '#4CAF50' : themedColors.text.secondary}
                />
                <Text style={[styles.objectiveText, { color: themedColors.text.primary }]}>
                  {obj.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.completeButton, !canTakeQuiz && styles.completeButtonDisabled]}
          onPress={() => setShowQuiz(true)}
          disabled={!canTakeQuiz}
        >
          <Text style={styles.completeButtonText}>
            {canTakeQuiz ? 'Take Knowledge Check' : 'Tick at least 2 checklist items'}
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
  contentContainer: { padding: 16, paddingBottom: 40 },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  topic: { fontSize: 12, marginBottom: 6 },
  title: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  progressText: { fontSize: 13, fontWeight: '800' },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressBarFill: { height: '100%', backgroundColor: '#4CAF50' },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  objectiveText: { flex: 1, fontSize: 13, lineHeight: 18 },
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

export default VirtualLabTemplateScreen;

