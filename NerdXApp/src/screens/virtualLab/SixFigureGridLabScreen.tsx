// Six-Figure Grid References Lab - Geography Virtual Lab
// Practice 6-figure grid references by dividing a grid square into tenths

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

const SQUARE_SIZE = 140;
const SUBDIV = 10;
const CELL = SQUARE_SIZE / SUBDIV;

// Church in square 25 (easting 2, northing 5) at tenths 5 across, 7 up → 6-fig 255 257
const TARGET_E_TENTHS = 5;
const TARGET_N_TENTHS = 7;
const CORRECT_6_FIG = '255257';

const SixFigureGridLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('six-figure-grid-refs');

  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const options = [
    { value: '255257', label: '255 257' },
    { value: '254257', label: '254 257' },
    { value: '255256', label: '255 256' },
    { value: '256257', label: '256 257' },
  ];

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
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>How 6-figure refs work</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            Each grid square is divided into 10 parts along the easting and 10 along the northing. The 3rd digit of the easting (and northing) gives the tenths. E.g. 253 372 = easting 25.3, northing 37.2.
          </Text>
        </View>

        <View style={[styles.mapCard, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Practice</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            The church (✟) lies in grid square <Text style={styles.bold}>25</Text>. What is its 6-figure grid reference?
          </Text>
          <View style={styles.gridSquareWrapper}>
            <Text style={[styles.axisLabel, { color: themedColors.text.secondary }]}>N 25</Text>
            <View style={styles.gridRow}>
              <Text style={[styles.axisLabelV, { color: themedColors.text.secondary }]}>E 25</Text>
              <View style={[styles.bigSquare, { borderColor: themedColors.border }]}>
                {Array.from({ length: SUBDIV }, (_, ny) => (
                  <View key={ny} style={styles.miniRow}>
                    {Array.from({ length: SUBDIV }, (_, ex) => {
                      const isChurch = ex === TARGET_E_TENTHS && ny === TARGET_N_TENTHS;
                      return (
                        <View
                          key={`${ex}-${ny}`}
                          style={[
                            styles.miniCell,
                            {
                              borderColor: themedColors.border,
                              backgroundColor: isChurch ? '#E8F5E9' : 'transparent',
                            },
                          ]}
                        >
                          {isChurch && <Ionicons name="business" size={14} color="#2E7D32" />}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.optionsRow}>
            {options.map((opt) => {
              const isCorrect = opt.value === CORRECT_6_FIG;
              const isSelected = selectedRef === opt.value;
              const showResult = selectedRef !== null;
              const bg = !showResult
                ? themedColors.background.default
                : isSelected
                  ? isCorrect
                    ? '#4CAF50'
                    : '#F44336'
                  : themedColors.background.default;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, { backgroundColor: bg, borderColor: themedColors.border }]}
                  onPress={() => setSelectedRef(opt.value)}
                  disabled={selectedRef !== null}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFF' : themedColors.text.primary }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedRef !== null && (
            <View
              style={[
                styles.feedback,
                { backgroundColor: selectedRef === CORRECT_6_FIG ? '#E8F5E9' : '#FFEBEE' },
              ]}
            >
              <Ionicons
                name={selectedRef === CORRECT_6_FIG ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={selectedRef === CORRECT_6_FIG ? '#2E7D32' : '#C62828'}
              />
              <Text
                style={[
                  styles.feedbackText,
                  { color: selectedRef === CORRECT_6_FIG ? '#2E7D32' : '#C62828' },
                ]}
              >
                {selectedRef === CORRECT_6_FIG
                  ? 'Correct! 255 257 = easting 2.5, northing 5.7 (church in square 25).'
                  : 'The church is at 255 257. Remember: easting tenths first (5), northing tenths second (7).'}
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
  bold: { fontWeight: '700' },
  mapCard: { padding: 16, borderRadius: 16 },
  gridSquareWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  axisLabel: { fontSize: 11, marginBottom: 4 },
  axisLabelV: { fontSize: 11, width: 24, textAlign: 'center', marginRight: 4 },
  gridRow: { flexDirection: 'row', alignItems: 'center' },
  bigSquare: { width: SQUARE_SIZE, height: SQUARE_SIZE, borderWidth: 2, borderRadius: 8, overflow: 'hidden' },
  miniRow: { flexDirection: 'row' },
  miniCell: {
    width: CELL - 0.5,
    height: CELL - 0.5,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  optionBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5 },
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

export default SixFigureGridLabScreen;
