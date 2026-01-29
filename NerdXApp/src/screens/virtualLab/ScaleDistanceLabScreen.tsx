// Scale & Distance Lab - Geography Virtual Lab
// Use map scale to measure straight-line and curved distance

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

// Scale: 1 cm = 2 km. Line from A to B is 3 cm on "map" → 6 km
const SCALE_CM_TO_KM = 2;
const LINE_CM = 3;
const CORRECT_DISTANCE_KM = 6;

const ScaleDistanceLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('scale-distance');

  const [selectedDist, setSelectedDist] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const options = [
    { value: 3, label: '3 km' },
    { value: 4, label: '4 km' },
    { value: 5, label: '5 km' },
    { value: 6, label: '6 km' },
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
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Using a linear scale</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            The scale bar shows: 1 cm on the map = 2 km on the ground.
          </Text>
          <View style={[styles.scaleBar, { borderColor: themedColors.border }]}>
            <View style={styles.scaleLine}>
              <View style={[styles.segment, { width: 40 }]} />
              <View style={[styles.segment, { width: 40 }]} />
              <View style={[styles.segment, { width: 40 }]} />
            </View>
            <View style={styles.scaleLabels}>
              <Text style={[styles.scaleText, { color: themedColors.text.secondary }]}>0</Text>
              <Text style={[styles.scaleText, { color: themedColors.text.secondary }]}>2 km</Text>
              <Text style={[styles.scaleText, { color: themedColors.text.secondary }]}>4 km</Text>
              <Text style={[styles.scaleText, { color: themedColors.text.secondary }]}>6 km</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Task: Measure distance</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            The straight line from town A to town B on the map is 3 cm long. Using the scale (1 cm = 2 km), what is the real distance from A to B?
          </Text>
          <View style={[styles.diagram, { borderColor: themedColors.border }]}>
            <View style={styles.lineDiagram}>
              <View style={styles.townA}>
                <Text style={styles.townLabel}>A</Text>
              </View>
              <View style={[styles.roadLine, { backgroundColor: themedColors.primary.main }]} />
              <View style={styles.townB}>
                <Text style={styles.townLabel}>B</Text>
              </View>
            </View>
            <Text style={[styles.diagramCaption, { color: themedColors.text.secondary }]}>3 cm on map</Text>
          </View>
          <View style={styles.optionsRow}>
            {options.map((opt) => {
              const isCorrect = opt.value === CORRECT_DISTANCE_KM;
              const isSelected = selectedDist === opt.value;
              const showResult = selectedDist !== null;
              const bg = !showResult
                ? themedColors.background.default
                : isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : themedColors.background.default;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, { backgroundColor: bg, borderColor: themedColors.border }]}
                  onPress={() => setSelectedDist(opt.value)}
                  disabled={selectedDist !== null}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFF' : themedColors.text.primary }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedDist !== null && (
            <View
              style={[
                styles.feedback,
                { backgroundColor: selectedDist === CORRECT_DISTANCE_KM ? '#E8F5E9' : '#FFEBEE' },
              ]}
            >
              <Ionicons
                name={selectedDist === CORRECT_DISTANCE_KM ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={selectedDist === CORRECT_DISTANCE_KM ? '#2E7D32' : '#C62828'}
              />
              <Text
                style={[
                  styles.feedbackText,
                  { color: selectedDist === CORRECT_DISTANCE_KM ? '#2E7D32' : '#C62828' },
                ]}
              >
                {selectedDist === CORRECT_DISTANCE_KM
                  ? 'Correct! 3 cm × 2 km/cm = 6 km.'
                  : 'Distance = map distance × scale. 3 cm × 2 km per cm = 6 km.'}
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
  scaleBar: { borderWidth: 2, borderRadius: 12, padding: 16, marginVertical: 8 },
  scaleLine: { flexDirection: 'row', marginBottom: 8 },
  segment: { height: 6, backgroundColor: '#333', marginRight: 0 },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0 },
  scaleText: { fontSize: 12 },
  diagram: { borderWidth: 2, borderRadius: 12, padding: 20, marginVertical: 8, backgroundColor: '#F5F5F5' },
  lineDiagram: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  townA: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1976D2', alignItems: 'center', justifyContent: 'center' },
  townB: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' },
  roadLine: { width: 80, height: 4, borderRadius: 2 },
  townLabel: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  diagramCaption: { fontSize: 12, marginTop: 8, textAlign: 'center' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
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

export default ScaleDistanceLabScreen;
