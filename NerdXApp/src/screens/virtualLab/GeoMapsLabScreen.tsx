// Geo Maps Lab Screen - Geography Virtual Lab
// Real OpenStreetMap (Leaflet) for ZIMSEC mapwork: markers, distance, bearing, place selection.
// AI feedback via DeepSeek (NerdX GeoTutor).

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader } from '../../components/virtualLab';
import { OSMMapView, MapActionPayload, MapMarker, OSMMapViewRef } from '../../components/geography';
import { getSimulationById } from '../../data/virtualLab';
import { virtualLabApi } from '../../services/api/virtualLabApi';
import { useAuth } from '../../context/AuthContext';

const MAP_HEIGHT = Dimensions.get('window').height * 0.4;

export interface MapActionsSnapshot {
  markers: Array<{ name: string; lat: number; lon: number; student_label?: string }>;
  lines: Array<{ points: Array<{ lat: number; lon: number }>; label?: string }>;
  measurements: {
    distance_km?: number;
    bearing_deg?: number;
    elevation_profile?: number[];
  };
  selected_place?: { name: string; lat: number; lon: number };
}

const GeoMapsLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('geo-maps-lab');
  const mapRef = useRef<OSMMapViewRef>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [bearingDeg, setBearingDeg] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [lines, setLines] = useState<Array<{ points: Array<{ lat: number; lon: number }>; label?: string }>>([]);
  const [level, setLevel] = useState<'O' | 'A'>('O');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMapAction = useCallback((payload: MapActionPayload) => {
    if (payload.type === 'marker_added' && payload.markers) {
      setMarkers(payload.markers);
    }
    if (payload.type === 'measurement') {
      setDistanceKm(payload.distance_km ?? null);
      setBearingDeg(payload.bearing_deg ?? null);
      if (payload.points && payload.points.length >= 2) {
        setLines([{ points: payload.points, label: 'Measured line' }]);
      }
    }
    if (payload.type === 'place_selected' && payload.name != null && payload.lat != null && payload.lon != null) {
      setSelectedPlace({ name: payload.name, lat: payload.lat, lon: payload.lon });
    }
    if (payload.type === 'markers_cleared') {
      setMarkers([]);
      setDistanceKm(null);
      setBearingDeg(null);
      setLines([]);
    }
  }, []);

  const clearMarkers = () => {
    mapRef.current?.clearMarkers();
    setMarkers([]);
    setDistanceKm(null);
    setBearingDeg(null);
    setSelectedPlace(null);
    setLines([]);
  };

  const getMapActionsPayload = () => ({
    markers: markers.map(m => ({ name: m.name, lat: m.lat, lon: m.lon, student_label: m.student_label })),
    lines,
    measurements: {
      distance_km: distanceKm ?? undefined,
      bearing_deg: bearingDeg ?? undefined,
    },
    selected_place: selectedPlace ?? undefined,
  });

  const handleGetFeedback = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await virtualLabApi.getGeoMapsFeedback({
        level,
        topic: simulation?.topic ?? 'Map Work and Geographical Information Systems (GIS)',
        task_type: 'Mapwork',
        map_actions: getMapActionsPayload(),
        student_answer_text: studentAnswer.trim() || undefined,
      });
      setFeedback(result.response);
      if (result.credits_remaining !== undefined && result.credits_remaining !== null) {
        updateUser({ credits: Number(result.credits_remaining) });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to get feedback';
      setError(msg);
      if (err.response?.status === 402) {
        Alert.alert(
          'Insufficient credits',
          msg + '\n\nBuy credits to use the AI tutor.',
          [
            { text: 'OK' },
            { text: 'Buy credits', onPress: () => navigation.navigate('Credits' as never) },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

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

        <View style={[styles.taskCard, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Map task</Text>
          <Text style={[styles.instruction, { color: themedColors.text.secondary }]}>
            Tap the map to place markers. Place at least 2 points to see straight-line distance and bearing. Tap a marker to select it. Use real locations (e.g. Zimbabwe) to practise settlement, transport, or drainage mapwork.
          </Text>
        </View>

        <View style={[styles.mapWrapper, { backgroundColor: themedColors.background.paper }]}>
          <View style={styles.mapContainer}>
            <OSMMapView
              ref={mapRef}
              config={{ centerLat: -19.0154, centerLon: 29.1549, zoom: 6 }}
              onMapAction={handleMapAction}
              style={styles.map}
            />
          </View>
          <TouchableOpacity
            style={[styles.clearBtn, { backgroundColor: themedColors.primary.main }]}
            onPress={clearMarkers}
          >
            <Ionicons name="trash-outline" size={18} color="#FFF" />
            <Text style={styles.clearBtnText}>Clear markers</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Your map data</Text>
          <Text style={[styles.summaryText, { color: themedColors.text.secondary }]}>
            Markers: {markers.length}
            {distanceKm != null && ` • Distance: ${distanceKm.toFixed(2)} km`}
            {bearingDeg != null && ` • Bearing: ${bearingDeg.toFixed(1)}°`}
          </Text>
          {selectedPlace && (
            <Text style={[styles.summaryText, { color: themedColors.text.secondary }]}>
              Selected: {selectedPlace.name} ({selectedPlace.lat.toFixed(4)}, {selectedPlace.lon.toFixed(4)})
            </Text>
          )}
        </View>

        <View style={[styles.feedbackCard, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>AI feedback (DeepSeek)</Text>
          <View style={styles.levelRow}>
            <Text style={[styles.label, { color: themedColors.text.secondary }]}>Level:</Text>
            <TouchableOpacity
              style={[styles.levelBtn, level === 'O' && { backgroundColor: themedColors.primary.main }]}
              onPress={() => setLevel('O')}
            >
              <Text style={[styles.levelBtnText, { color: level === 'O' ? '#FFF' : themedColors.text.primary }]}>O-Level</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.levelBtn, level === 'A' && { backgroundColor: themedColors.primary.main }]}
              onPress={() => setLevel('A')}
            >
              <Text style={[styles.levelBtnText, { color: level === 'A' ? '#FFF' : themedColors.text.primary }]}>A-Level</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.label, { color: themedColors.text.secondary, marginTop: 8 }]}>Your answer (optional, for marking):</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: themedColors.background.default, color: themedColors.text.primary, borderColor: themedColors.border }]}
            placeholder="e.g. The settlement is nucleated because..."
            placeholderTextColor={themedColors.text.muted}
            value={studentAnswer}
            onChangeText={setStudentAnswer}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[styles.feedbackBtn, { backgroundColor: themedColors.primary.main }]}
            onPress={handleGetFeedback}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="school-outline" size={20} color="#FFF" />
                <Text style={styles.feedbackBtnText}>Get AI feedback (1 credit)</Text>
              </>
            )}
          </TouchableOpacity>
          {error && (
            <Text style={[styles.errorText, { color: themedColors.error?.main ?? '#B00020' }]}>{error}</Text>
          )}
          {feedback != null && feedback.length > 0 && (
            <View style={styles.markdownWrapper}>
              <Markdown style={{ body: { color: themedColors.text.primary }, heading2: { color: themedColors.primary.main } }}>
                {feedback}
              </Markdown>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  topic: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
  },
  taskCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    lineHeight: 20,
  },
  mapWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mapContainer: {
    height: MAP_HEIGHT,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  clearBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
  },
  feedbackCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  levelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  levelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 72,
    fontSize: 14,
    marginTop: 4,
  },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  feedbackBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  markdownWrapper: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1976D2',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default GeoMapsLabScreen;
