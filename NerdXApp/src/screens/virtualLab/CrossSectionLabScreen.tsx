// Cross-Sections & Relief Lab - Geography Virtual Lab
// Draw and interpret cross-sections from contour maps

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const CrossSectionLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('cross-section-lab');

  const [selectedQ1, setSelectedQ1] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Q1: What does a cross-section show? Side view = correct
  const options = [
    { value: 0, label: 'A view from directly above' },
    { value: 1, label: 'A side view of the land along a line' },
    { value: 2, label: 'Only rivers and water' },
    { value: 3, label: 'Grid references only' },
  ];
  const correctIndex = 1;

  if (!simulation) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: themedColors.text.primary }]}>Simulation not found</Text>
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

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.topic, { color: themedColors.text.secondary }]}>{simulation.topic}</Text>
          <Text style={[styles.desc, { color: themedColors.text.primary }]}>{simulation.description}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>What is a cross-section?</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            A cross-section (or profile) is a side view of the land along a straight line on the map. You transfer heights from where contours cross the line, then join the points to show relief.
          </Text>
          <View style={[styles.diagram, { borderColor: themedColors.border }]}>
            <View style={styles.profileBox}>
              <View style={[styles.profileLine, { backgroundColor: themedColors.primary.main }]} />
              <Text style={[styles.axisLabel, { color: themedColors.text.secondary }]}>Height (m)</Text>
              <Text style={[styles.axisLabelH, { color: themedColors.text.secondary }]}>Distance →</Text>
            </View>
            <Text style={[styles.diagramCaption, { color: themedColors.text.secondary }]}>
              Example: cross-section showing a hill (peak) and valley (dip)
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Task</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            What does a cross-section (profile) show?
          </Text>
          <View style={styles.optionsCol}>
            {options.map((opt) => {
              const isCorrect = opt.value === correctIndex;
              const isSelected = selectedQ1 === opt.value;
              const showResult = selectedQ1 !== null;
              const bg = !showResult
                ? themedColors.background.default
                : isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : themedColors.background.default;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, { backgroundColor: bg, borderColor: themedColors.border }]}
                  onPress={() => setSelectedQ1(opt.value)}
                  disabled={selectedQ1 !== null}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFF' : themedColors.text.primary }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedQ1 !== null && (
            <View
              style={[
                styles.feedback,
                {
                  backgroundColor: selectedQ1 === correctIndex ? '#E8F5E9' : '#FFEBEE',
                },
              ]}
            >
              <Ionicons
                name={selectedQ1 === correctIndex ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={selectedQ1 === correctIndex ? '#2E7D32' : '#C62828'}
              />
              <Text
                style={[
                  styles.feedbackText,
                  { color: selectedQ1 === correctIndex ? '#2E7D32' : '#C62828' },
                ]}
              >
                {selectedQ1 === correctIndex
                  ? 'Correct! A cross-section is a side view of the land along a line – it shows the shape of the relief.'
                  : 'A cross-section is a side view of the land along a straight line on the map, showing hills and valleys.'}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.quizButton, { backgroundColor: themedColors.primary.main }]}
          onPress={() => setShowQuiz(true)}
        >
          <Text style={styles.quizButtonText}>Take Knowledge Check</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
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
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
  card: { padding: 16, borderRadius: 16 },
  topic: { fontSize: 12, marginBottom: 6 },
  desc: { fontSize: 14, lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  instruction: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  diagram: { borderWidth: 2, borderRadius: 12, padding: 16, marginVertical: 8, backgroundColor: '#F5F5F5' },
  profileBox: { height: 100, position: 'relative', justifyContent: 'center' },
  profileLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 4,
    borderRadius: 2,
    top: '50%',
    marginTop: -2,
    opacity: 0.9,
  },
  axisLabel: { position: 'absolute', left: 4, top: 8, fontSize: 10 },
  axisLabelH: { position: 'absolute', right: 8, bottom: 4, fontSize: 10 },
  diagramCaption: { fontSize: 12, marginTop: 8, textAlign: 'center' },
  optionsCol: { gap: 10 },
  optionBtn: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5 },
  optionText: { fontSize: 15, fontWeight: '600' },
  feedback: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginTop: 12, gap: 10 },
  feedbackText: { flex: 1, fontSize: 14, fontWeight: '600' },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  quizButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, marginBottom: 12 },
  backBtn: { backgroundColor: '#2E7D32', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  backBtnText: { color: '#FFF', fontWeight: '700' },
});

export default CrossSectionLabScreen;
