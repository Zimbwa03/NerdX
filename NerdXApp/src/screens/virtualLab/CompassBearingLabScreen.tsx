// Compass Bearings Lab - Geography Virtual Lab
// Measure and use compass bearings (0–360° clockwise from North)

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

// From A to B: A bottom-left, B top-right → bearing ~045° (NE)
const CORRECT_BEARING = 45;

const CompassBearingLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('compass-bearing');

  const [selectedBearing, setSelectedBearing] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const options = [
    { value: 0, label: '000° (N)' },
    { value: 45, label: '045° (NE)' },
    { value: 90, label: '090° (E)' },
    { value: 135, label: '135° (SE)' },
    { value: 180, label: '180° (S)' },
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
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Bearings (0–360°)</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            Bearings are measured clockwise from North. North = 0°, East = 90°, South = 180°, West = 270°.
          </Text>
          <View style={styles.compassRose}>
            <Text style={styles.nLabel}>N 0°</Text>
            <View style={styles.compassRow}>
              <Text style={styles.wLabel}>270° W</Text>
              <View style={[styles.compassCircle, { borderColor: themedColors.border }]}>
                <View style={[styles.needle, { backgroundColor: themedColors.primary.main }]} />
                <Ionicons name="locate" size={20} color={themedColors.text.secondary} />
              </View>
              <Text style={styles.eLabel}>E 90°</Text>
            </View>
            <Text style={styles.sLabel}>S 180°</Text>
          </View>
        </View>

        <View style={[styles.mapCard, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Practice</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            You are at point A. What is the bearing to point B? (Measure clockwise from North.)
          </Text>
          <View style={[styles.diagram, { borderColor: themedColors.border }]}>
            <View style={styles.diagramInner}>
              <Text style={styles.northArrow}>N</Text>
              <View style={styles.aPoint}>
                <Text style={styles.pointLabel}>A</Text>
              </View>
              <View style={[styles.lineAB, { backgroundColor: themedColors.primary.main }]} />
              <View style={styles.bPoint}>
                <Text style={styles.pointLabel}>B</Text>
              </View>
            </View>
          </View>
          <View style={styles.optionsRow}>
            {options.map((opt) => {
              const isCorrect = opt.value === CORRECT_BEARING;
              const isSelected = selectedBearing === opt.value;
              const showResult = selectedBearing !== null;
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
                  onPress={() => setSelectedBearing(opt.value)}
                  disabled={selectedBearing !== null}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFF' : themedColors.text.primary }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedBearing !== null && (
            <View
              style={[
                styles.feedback,
                {
                  backgroundColor:
                    selectedBearing === CORRECT_BEARING ? '#E8F5E9' : '#FFEBEE',
                },
              ]}
            >
              <Ionicons
                name={selectedBearing === CORRECT_BEARING ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={selectedBearing === CORRECT_BEARING ? '#2E7D32' : '#C62828'}
              />
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color:
                      selectedBearing === CORRECT_BEARING ? '#2E7D32' : '#C62828',
                  },
                ]}
              >
                {selectedBearing === CORRECT_BEARING
                  ? 'Correct! From A to B the direction is North-east, bearing 045°.'
                  : 'The bearing from A to B is 045° (North-east). B is to the right and up from A.'}
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
  compassRose: { alignItems: 'center', marginVertical: 8 },
  nLabel: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  compassRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  wLabel: { fontSize: 12, width: 48, textAlign: 'center' },
  eLabel: { fontSize: 12, width: 48, textAlign: 'center' },
  compassCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needle: { position: 'absolute', width: 4, height: 32, top: 8 },
  sLabel: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  mapCard: { padding: 16, borderRadius: 16 },
  diagram: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 24,
    marginVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  diagramInner: {
    height: 160,
    position: 'relative',
  },
  northArrow: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -8,
    fontSize: 12,
    fontWeight: '700',
  },
  aPoint: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bPoint: {
    position: 'absolute',
    top: 24,
    right: 40,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineAB: {
    position: 'absolute',
    bottom: 34,
    left: 52,
    width: 2,
    height: 100,
    transform: [{ rotate: '-45deg' }],
  },
  pointLabel: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionBtn: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5 },
  optionText: { fontSize: 14, fontWeight: '600' },
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

export default CompassBearingLabScreen;
