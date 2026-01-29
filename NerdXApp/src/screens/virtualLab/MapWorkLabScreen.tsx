// Map Work Lab Screen - Geography Virtual Lab
// Interactive map reading: grid references, scale, compass directions

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';

const GRID_SIZE = 5;
const CELL_SIZE = 52;
const MAP_PADDING = 12;

const MapWorkLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('map-work-grid-scale');

  const [selectedCell, setSelectedCell] = useState<{ e: number; n: number } | null>(null);
  const [task1Correct, setTask1Correct] = useState<boolean | null>(null);
  const [task2Answer, setTask2Answer] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Task 1: Find grid reference 23 (easting 2, northing 3)
  const targetGridRef = { e: 2, n: 3 };
  const handleCellPress = (e: number, n: number) => {
    setSelectedCell({ e, n });
    const correct = e === targetGridRef.e && n === targetGridRef.n;
    setTask1Correct(correct);
  };

  // Task 2: Distance from A(1,1) to B(3,4). Scale: 1 square = 1 km. Pythag: sqrt(2²+3²) ≈ 3.6 km
  const distanceOptions = [
    { value: 2, label: '2 km' },
    { value: 3, label: '3 km' },
    { value: 4, label: '4 km' },
    { value: 5, label: '5 km' },
  ];
  const correctDistance = 4; // closest to 3.6

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

        {/* Compass rose */}
        <View style={[styles.compassCard, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Compass directions</Text>
          <View style={styles.compassRow}>
            <View style={styles.compassItem}><Text style={styles.compassText}>N</Text></View>
          </View>
          <View style={styles.compassRow}>
            <View style={styles.compassItem}><Text style={styles.compassText}>W</Text></View>
            <View style={[styles.compassCenter, { backgroundColor: themedColors.primary.main }]}>
              <Ionicons name="locate" size={20} color="#FFF" />
            </View>
            <View style={styles.compassItem}><Text style={styles.compassText}>E</Text></View>
          </View>
          <View style={styles.compassRow}>
            <View style={styles.compassItem}><Text style={styles.compassText}>S</Text></View>
          </View>
        </View>

        {/* Map grid */}
        <View style={[styles.mapCard, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Practice: 4-figure grid reference</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            Tap the grid square with reference <Text style={styles.bold}>23</Text> (easting 2, northing 3).
          </Text>
          <View style={styles.scaleBar}>
            <View style={[styles.scaleLine, { backgroundColor: themedColors.text.primary }]} />
            <Text style={[styles.scaleText, { color: themedColors.text.secondary }]}>1 cm = 1 km</Text>
          </View>
          <View style={styles.gridWrapper}>
            {/* Northing labels (vertical, left) */}
            <View style={styles.northingLabels}>
              {[1, 2, 3, 4, 5].reverse().map((n) => (
                <View key={n} style={styles.labelCell}>
                  <Text style={[styles.axisLabel, { color: themedColors.text.secondary }]}>{n}</Text>
                </View>
              ))}
            </View>
            <View>
              {/* Easting labels (horizontal, top) */}
              <View style={styles.eastingLabels}>
                {[1, 2, 3, 4, 5].map((e) => (
                  <View key={e} style={[styles.labelCell, { width: CELL_SIZE }]}>
                    <Text style={[styles.axisLabel, { color: themedColors.text.secondary }]}>{e}</Text>
                  </View>
                ))}
              </View>
              {/* Grid cells */}
              {[5, 4, 3, 2, 1].map((n) => (
                <View key={n} style={styles.gridRow}>
                  {[1, 2, 3, 4, 5].map((e) => {
                    const isTarget = e === targetGridRef.e && n === targetGridRef.n;
                    const isSelected = selectedCell?.e === e && selectedCell?.n === n;
                    return (
                      <TouchableOpacity
                        key={`${e}-${n}`}
                        style={[
                          styles.cell,
                          {
                            backgroundColor: isSelected
                              ? (task1Correct ? '#4CAF50' : '#F44336')
                              : themedColors.background.default,
                            borderColor: isTarget && !selectedCell ? themedColors.primary.main : themedColors.border,
                          },
                        ]}
                        onPress={() => handleCellPress(e, n)}
                        activeOpacity={0.8}
                      >
                        {isTarget && (
                          <Ionicons
                            name="school"
                            size={18}
                            color={isSelected && task1Correct ? '#FFF' : themedColors.primary.main}
                          />
                        )}
                        {isSelected && !task1Correct && (
                          <Ionicons name="close" size={18} color="#FFF" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
          {task1Correct !== null && (
            <View style={[styles.feedback, { backgroundColor: task1Correct ? '#E8F5E9' : '#FFEBEE' }]}>
              <Ionicons name={task1Correct ? 'checkmark-circle' : 'close-circle'} size={20} color={task1Correct ? '#2E7D32' : '#C62828'} />
              <Text style={[styles.feedbackText, { color: task1Correct ? '#2E7D32' : '#C62828' }]}>
                {task1Correct ? 'Correct! That is grid square 23.' : 'Not quite. Remember: easting first, then northing.'}
              </Text>
            </View>
          )}
        </View>

        {/* Task 2: Distance */}
        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Using scale</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            Point A is at grid reference 11, Point B at 34. Scale: 1 square = 1 km. What is the approximate straight-line distance from A to B?
          </Text>
          <View style={styles.optionsRow}>
            {distanceOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionBtn,
                  {
                    backgroundColor: task2Answer === opt.value
                      ? (opt.value === correctDistance ? '#4CAF50' : '#F44336')
                      : themedColors.background.default,
                    borderColor: themedColors.border,
                  },
                ]}
                onPress={() => setTask2Answer(opt.value)}
                disabled={task2Answer !== null}
              >
                <Text style={[
                  styles.optionText,
                  { color: task2Answer === opt.value ? '#FFF' : themedColors.text.primary },
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {task2Answer !== null && (
            <View style={[styles.feedback, { backgroundColor: task2Answer === correctDistance ? '#E8F5E9' : '#FFEBEE' }]}>
              <Ionicons
                name={task2Answer === correctDistance ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={task2Answer === correctDistance ? '#2E7D32' : '#C62828'}
              />
              <Text style={[styles.feedbackText, { color: task2Answer === correctDistance ? '#2E7D32' : '#C62828' }]}>
                {task2Answer === correctDistance
                  ? 'Correct! A to B is about 4 km (using the scale).'
                  : 'The straight-line distance from 11 to 34 is about 4 km (Pythagoras: 2² + 3² = 13, √13 ≈ 3.6).'}
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
  compassCard: { padding: 16, borderRadius: 16, alignItems: 'center' },
  compassRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  compassItem: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  compassCenter: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  compassText: { fontSize: 16, fontWeight: '700' },
  mapCard: { padding: 16, borderRadius: 16 },
  scaleBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  scaleLine: { width: 40, height: 4, borderRadius: 2 },
  scaleText: { fontSize: 12 },
  gridWrapper: { flexDirection: 'row', alignItems: 'flex-end' },
  northingLabels: { marginRight: 4, justifyContent: 'space-between', height: GRID_SIZE * CELL_SIZE },
  eastingLabels: { flexDirection: 'row', marginBottom: 4 },
  labelCell: { height: CELL_SIZE - 8, alignItems: 'center', justifyContent: 'center' },
  axisLabel: { fontSize: 12, fontWeight: '600' },
  gridRow: { flexDirection: 'row' },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
  },
  feedback: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginTop: 12, gap: 10 },
  feedbackText: { flex: 1, fontSize: 14, fontWeight: '600' },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5 },
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

export default MapWorkLabScreen;
