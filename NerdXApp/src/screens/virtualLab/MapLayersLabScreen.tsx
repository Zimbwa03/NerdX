// Map Layers & GIS Lab - Geography Virtual Lab
// Understand GIS layers: roads, rivers, land use

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

const MapLayersLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('map-layers');

  const [roadsOn, setRoadsOn] = useState(true);
  const [riversOn, setRiversOn] = useState(true);
  const [landUseOn, setLandUseOn] = useState(false);
  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Q: Why use layers? Turn on/off to compare = correct
  const options = [
    { value: 0, label: 'So the map is always the same' },
    { value: 1, label: 'To turn themes on/off and compare different data' },
    { value: 2, label: 'To hide all information' },
    { value: 3, label: 'To replace paper maps only' },
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
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Toggle layers</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            In GIS, each type of data (roads, rivers, land use) is a separate layer. Tap to turn layers on or off.
          </Text>
          <View style={styles.layerToggles}>
            <TouchableOpacity
              style={[styles.toggleRow, roadsOn && styles.toggleRowOn]}
              onPress={() => setRoadsOn((v) => !v)}
            >
              <Ionicons name="navigate" size={22} color={roadsOn ? '#2E7D32' : '#999'} />
              <Text style={[styles.toggleLabel, { color: roadsOn ? themedColors.text.primary : themedColors.text.secondary }]}>
                Roads
              </Text>
              <Text style={styles.toggleState}>{roadsOn ? 'On' : 'Off'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleRow, riversOn && styles.toggleRowOn]}
              onPress={() => setRiversOn((v) => !v)}
            >
              <Ionicons name="water" size={22} color={riversOn ? '#2196F3' : '#999'} />
              <Text style={[styles.toggleLabel, { color: riversOn ? themedColors.text.primary : themedColors.text.secondary }]}>
                Rivers
              </Text>
              <Text style={styles.toggleState}>{riversOn ? 'On' : 'Off'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleRow, landUseOn && styles.toggleRowOn]}
              onPress={() => setLandUseOn((v) => !v)}
            >
              <Ionicons name="leaf" size={22} color={landUseOn ? '#4CAF50' : '#999'} />
              <Text style={[styles.toggleLabel, { color: landUseOn ? themedColors.text.primary : themedColors.text.secondary }]}>
                Land use
              </Text>
              <Text style={styles.toggleState}>{landUseOn ? 'On' : 'Off'}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.previewMap, { borderColor: themedColors.border }]}>
            {roadsOn && <View style={[styles.layerRoad, { backgroundColor: '#666' }]} />}
            {riversOn && <View style={[styles.layerRiver, { backgroundColor: '#2196F3' }]} />}
            {landUseOn && <View style={[styles.layerLand, { backgroundColor: 'rgba(76,175,80,0.3)' }]} />}
            <Text style={[styles.previewLabel, { color: themedColors.text.secondary }]}>Map preview</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Task</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            Why is it useful to have separate layers in GIS?
          </Text>
          <View style={styles.optionsCol}>
            {options.map((opt) => {
              const isCorrect = opt.value === correctIndex;
              const isSelected = selectedQ === opt.value;
              const showResult = selectedQ !== null;
              const bg = !showResult
                ? themedColors.background.default
                : isSelected ? (isCorrect ? '#4CAF50' : '#F44336') : themedColors.background.default;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, { backgroundColor: bg, borderColor: themedColors.border }]}
                  onPress={() => setSelectedQ(opt.value)}
                  disabled={selectedQ !== null}
                >
                  <Text style={[styles.optionText, { color: isSelected ? '#FFF' : themedColors.text.primary }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {selectedQ !== null && (
            <View
              style={[
                styles.feedback,
                { backgroundColor: selectedQ === correctIndex ? '#E8F5E9' : '#FFEBEE' },
              ]}
            >
              <Ionicons
                name={selectedQ === correctIndex ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={selectedQ === correctIndex ? '#2E7D32' : '#C62828'}
              />
              <Text
                style={[
                  styles.feedbackText,
                  { color: selectedQ === correctIndex ? '#2E7D32' : '#C62828' },
                ]}
              >
                {selectedQ === correctIndex
                  ? 'Correct! Layers let you compare different themes and focus on what you need.'
                  : 'Layers let you turn themes on or off to compare data (e.g. roads vs rivers vs land use) and analyse patterns.'}
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
  layerToggles: { gap: 8, marginBottom: 16 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  toggleRowOn: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  toggleLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  toggleState: { fontSize: 12, fontWeight: '700', color: '#666' },
  previewMap: {
    borderWidth: 2,
    borderRadius: 12,
    height: 120,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FAFAFA',
  },
  layerRoad: { position: 'absolute', top: 40, left: 20, right: 20, height: 4, borderRadius: 2 },
  layerRiver: { position: 'absolute', bottom: 30, left: 30, width: 80, height: 4, borderRadius: 2 },
  layerLand: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  previewLabel: { position: 'absolute', bottom: 8, alignSelf: 'center', fontSize: 11 },
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

export default MapLayersLabScreen;
