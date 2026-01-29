// Contour Lines & Relief Lab - Geography Virtual Lab
// Read contour lines to understand relief and slope

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

const ContourLinesLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('contour-lines');

  const [selectedQ1, setSelectedQ1] = useState<number | null>(null);
  const [selectedQ2, setSelectedQ2] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Q1: What is the height at point X? (between 100 and 200 m contours → 150 m)
  const heightOptions = [
    { value: 100, label: '100 m' },
    { value: 150, label: '150 m' },
    { value: 200, label: '200 m' },
    { value: 250, label: '250 m' },
  ];
  const correctHeight = 150;

  // Q2: Is the slope from A to B steep or gentle? (close contours = steep)
  const slopeOptions = [
    { value: 'steep', label: 'Steep (contours close together)' },
    { value: 'gentle', label: 'Gentle (contours far apart)' },
  ];
  const correctSlope = 'steep';

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
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Contour diagram</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            Contour interval = 50 m. Each line joins points at the same height. Close lines = steep slope.
          </Text>
          <View style={[styles.diagram, { borderColor: themedColors.border }]}>
            <View style={styles.contourBox}>
              <View style={[styles.contourLine, styles.contour100]} />
              <View style={[styles.contourLine, styles.contour150]} />
              <View style={[styles.contourLine, styles.contour200]} />
              <View style={[styles.contourLine, styles.contour250]} />
              <View style={styles.pointX}>
                <Text style={styles.pointLabel}>X</Text>
              </View>
              <Text style={[styles.contourLabel, styles.label100]}>100 m</Text>
              <Text style={[styles.contourLabel, styles.label200]}>200 m</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Task 1: Height at X</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            Point X lies halfway between the 100 m and 200 m contours. What is the approximate height at X?
          </Text>
          <View style={styles.optionsRow}>
            {heightOptions.map((opt) => {
              const isCorrect = opt.value === correctHeight;
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
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Task 2: Slope</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            From A to B the contours are close together. What does this tell you about the slope?
          </Text>
          <View style={styles.optionsRow}>
            {slopeOptions.map((opt) => {
              const isCorrect = opt.value === correctSlope;
              const isSelected = selectedQ2 === opt.value;
              const showResult = selectedQ2 !== null;
              const bg = !showResult
                ? themedColors.background.default
                : isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : themedColors.background.default;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, styles.optionBtnWide, { backgroundColor: bg, borderColor: themedColors.border }]}
                  onPress={() => setSelectedQ2(opt.value)}
                  disabled={selectedQ2 !== null}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFF' : themedColors.text.primary }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
  contourBox: { height: 140, position: 'relative' },
  contourLine: { position: 'absolute', borderWidth: 1, borderColor: '#666', borderRadius: 999 },
  contour100: { width: 120, height: 120, top: 10, left: 40 },
  contour150: { width: 90, height: 90, top: 25, left: 55 },
  contour200: { width: 60, height: 60, top: 40, left: 70 },
  contour250: { width: 30, height: 30, top: 55, left: 85 },
  pointX: {
    position: 'absolute',
    top: 52,
    left: 98,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointLabel: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  contourLabel: { position: 'absolute', fontSize: 10, fontWeight: '600', color: '#666' },
  label100: { top: 12, left: 42 },
  label200: { top: 42, left: 72 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5 },
  optionBtnWide: { minWidth: '80%' },
  optionText: { fontSize: 15, fontWeight: '600' },
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

export default ContourLinesLabScreen;
