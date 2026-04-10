import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as ImageManipulator from 'expo-image-manipulator';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { LOADING_STATES, useSolveStore } from '../stores/solveStore';
import { trackScanSolveEvent } from '../utils/scanSolveAnalytics';

type RouteParams = {
  prefillText?: string;
  autoSolve?: boolean;
};

const SUBJECT_OPTIONS = [
  'Auto-detect',
  'Algebra',
  'Calculus',
  'Statistics',
  'Geometry',
  'Trigonometry',
  'Mechanics',
  'Probability',
  'Matrices',
  'Vectors',
];

const MathSolverScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = (route.params || {}) as RouteParams;
  const { isDarkMode } = useTheme();
  const colors = useThemedColors();
  const [problem, setProblem] = useState(params.prefillText || '');
  const [subjectHint, setSubjectHint] = useState('Auto-detect');
  const [level, setLevel] = useState<'O-Level' | 'A-Level'>('O-Level');
  const [showCamera, setShowCamera] = useState(false);
  const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  const {
    history,
    isLoading,
    loadingStage,
    error,
    clearError,
    solveFromImage,
    solveFromText,
    hydrateFromHistory,
  } = useSolveStore();

  const currentLoading = LOADING_STATES[Math.min(loadingStage, LOADING_STATES.length - 1)];

  const handleImagePreprocess = useCallback(async (uri: string) => {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1600 } }],
      {
        compress: 0.85,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return manipulated.uri;
  }, []);

  const openCamera = useCallback(async () => {
    Haptics.selectionAsync();
    if (!cameraPermission?.granted) {
      const granted = await requestCameraPermission();
      if (!granted.granted) {
        Alert.alert('Camera access needed', 'Please allow camera access to scan a problem.');
        return;
      }
    }
    setShowCamera(true);
  }, [cameraPermission?.granted, requestCameraPermission]);

  const captureProblem = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (!photo?.uri) {
        return;
      }
      const uri = await handleImagePreprocess(photo.uri);
      setProcessedImageUri(uri);
      setShowCamera(false);
    } catch (captureError: any) {
      Alert.alert('Camera error', captureError?.message || 'Could not capture the problem.');
    }
  }, [handleImagePreprocess]);

  const runSolve = useCallback(async () => {
    clearError();
    trackScanSolveEvent('solve_initiated', {
      input_type: processedImageUri ? 'scan' : 'text',
      subject_hint: subjectHint,
      level,
    });

    try {
      const subject = subjectHint === 'Auto-detect' ? undefined : subjectHint;
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        throw new Error('No internet. Open a previous solve from history or reconnect to generate a new lesson.');
      }

      const result = processedImageUri
        ? await solveFromImage(processedImageUri, level, subject, problem.trim() || undefined)
        : await solveFromText(problem.trim(), level, subject);

      trackScanSolveEvent('solve_completed', {
        subject: result.problem.subject,
        difficulty: result.problem.difficulty,
        steps_count: result.solution.steps.length,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('ScanSolveResult');
    } catch (solveError: any) {
      trackScanSolveEvent('solve_error', {
        error_type: solveError?.message || 'unknown',
        subject_hint: subjectHint,
      });
      Alert.alert('Scan & Solve', solveError?.message || 'Could not prepare your lesson.');
    }
  }, [clearError, level, navigation, problem, processedImageUri, solveFromImage, solveFromText, subjectHint]);

  useEffect(() => {
    if (params.prefillText) {
      setProblem(params.prefillText);
    }
    if (params.autoSolve && params.prefillText) {
      const timer = setTimeout(() => {
        runSolve().catch(() => undefined);
      }, 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [params.autoSolve, params.prefillText, runSolve]);

  const canSolve = useMemo(() => Boolean(problem.trim() || processedImageUri), [problem, processedImageUri]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <LinearGradient
        colors={['#0f1117', '#141927', '#0f1117']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#22c55e" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan & Solve</Text>
        <Text style={styles.subtitle}>Scan or type any problem</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: '#1a1f2e', borderColor: 'rgba(255,255,255,0.08)' }]}>
          <TouchableOpacity onPress={openCamera} activeOpacity={0.9}>
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.scanButton}
            >
              <Ionicons name="camera-outline" size={22} color="#07120b" />
              <Text style={styles.scanButtonText}>Camera Scan</Text>
            </LinearGradient>
          </TouchableOpacity>

          {processedImageUri ? (
            <View style={styles.imagePreviewWrap}>
              <Image source={{ uri: processedImageUri }} style={styles.previewImage} />
              <View style={styles.previewBadge}>
                <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                <Text style={styles.previewBadgeText}>Ready</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <TextInput
            value={problem}
            onChangeText={setProblem}
            placeholder="e.g. x^2 + 5x + 6 = 0"
            placeholderTextColor="rgba(255,255,255,0.45)"
            multiline
            style={styles.textInput}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectRow}>
            {SUBJECT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSubjectHint(option)}
                style={[
                  styles.subjectChip,
                  subjectHint === option && styles.subjectChipActive,
                ]}
              >
                <Text style={[
                  styles.subjectChipText,
                  subjectHint === option && styles.subjectChipTextActive,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.levelRow}>
            {(['O-Level', 'A-Level'] as const).map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setLevel(item)}
                style={[styles.levelChip, level === item && styles.levelChipActive]}
              >
                <Text style={[styles.levelChipText, level === item && styles.levelChipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.solveButton, !canSolve && styles.solveButtonDisabled]}
            onPress={() => runSolve()}
            disabled={!canSolve || isLoading}
          >
            <Text style={styles.solveButtonText}>{isLoading ? 'Solving with Vertex AI...' : 'Solve'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyHeader}>
          <Text style={[styles.historyTitle, { color: colors.text.primary }]}>Recent Lessons</Text>
          <Text style={[styles.historySubtitle, { color: colors.text.secondary }]}>
            Offline re-open works from this history list.
          </Text>
        </View>

        {history.length === 0 ? (
          <View style={[styles.emptyHistoryCard, { backgroundColor: '#151925' }]}>
            <Text style={styles.emptyHistoryText}>Your last 20 Scan & Solve lessons will appear here.</Text>
          </View>
        ) : (
          history.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.historyCard, { backgroundColor: '#151925' }]}
              onPress={() => {
                hydrateFromHistory(item);
                navigation.navigate('ScanSolveResult');
              }}
            >
              <View style={styles.historyMetaRow}>
                <Text style={styles.historySubject}>{item.problem.subject}</Text>
                <Text style={styles.historyDifficulty}>{item.problem.difficulty}</Text>
              </View>
              <Text style={styles.historyProblem} numberOfLines={2}>
                {item.problem.plain || item.problem.latex}
              </Text>
              <Text style={styles.historyAnswer} numberOfLines={1}>
                {item.solution.final_answer}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={showCamera} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.cameraScreen}>
          <CameraView ref={cameraRef} facing="back" style={StyleSheet.absoluteFillObject} />
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraHint}>Hold steady - detecting problem...</Text>
            <View style={styles.scanZone}>
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
              <View style={styles.boundingBox}>
                <Text style={styles.boundingBoxText}>Place the maths inside the green zone</Text>
              </View>
            </View>
            <View style={styles.cameraActions}>
              <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.cameraActionSecondary}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={captureProblem} style={styles.cameraCaptureButton}>
                <View style={styles.cameraCaptureInner} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setProcessedImageUri(null)}
                style={styles.cameraActionSecondary}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.loadingBackdrop}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text style={styles.loadingTitle}>Preparing your lesson</Text>
            <Text style={styles.loadingMessage}>{currentLoading.message}</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${((loadingStage + 1) / LOADING_STATES.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.loadingFootnote}>This usually takes 8-12 seconds</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 8,
  },
  backText: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    marginTop: 6,
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },
  card: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
  },
  scanButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  scanButtonText: {
    color: '#07120b',
    fontSize: 17,
    fontWeight: '800',
  },
  imagePreviewWrap: {
    marginTop: 16,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 18,
  },
  previewBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: 'rgba(15,17,23,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 18,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  orText: {
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  textInput: {
    minHeight: 132,
    backgroundColor: '#111622',
    borderRadius: 18,
    padding: 16,
    color: '#fff',
    textAlignVertical: 'top',
    fontSize: 17,
    fontFamily: 'monospace',
  },
  subjectRow: {
    gap: 10,
    paddingTop: 16,
  },
  subjectChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#111622',
  },
  subjectChipActive: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.45)',
  },
  subjectChipText: {
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '600',
  },
  subjectChipTextActive: {
    color: '#d6ffe1',
  },
  levelRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  levelChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#111622',
  },
  levelChipActive: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  levelChipText: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '700',
  },
  levelChipTextActive: {
    color: '#fff',
  },
  errorText: {
    color: '#fca5a5',
    marginTop: 12,
  },
  solveButton: {
    marginTop: 18,
    backgroundColor: '#22c55e',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  solveButtonDisabled: {
    opacity: 0.45,
  },
  solveButtonText: {
    color: '#07120b',
    fontWeight: '800',
    fontSize: 18,
  },
  historyHeader: {
    marginTop: 28,
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 21,
    fontWeight: '800',
  },
  historySubtitle: {
    marginTop: 6,
  },
  emptyHistoryCard: {
    padding: 18,
    borderRadius: 18,
  },
  emptyHistoryText: {
    color: 'rgba(255,255,255,0.7)',
  },
  historyCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  historyMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historySubject: {
    color: '#86efac',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  historyDifficulty: {
    color: 'rgba(255,255,255,0.6)',
  },
  historyProblem: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
  },
  historyAnswer: {
    color: 'rgba(255,255,255,0.68)',
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 70,
    paddingBottom: 44,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cameraHint: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  scanZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boundingBox: {
    width: '86%',
    height: 260,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(34,197,94,0.75)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
  boundingBoxText: {
    color: '#dcfce7',
    fontWeight: '700',
  },
  corner: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderColor: '#22c55e',
  },
  cornerTopLeft: {
    top: '27%',
    left: '7%',
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    top: '27%',
    right: '7%',
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    bottom: '27%',
    left: '7%',
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    bottom: '27%',
    right: '7%',
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 12,
  },
  cameraActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraActionSecondary: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCaptureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCaptureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22c55e',
  },
  loadingBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#141927',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  loadingTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
  },
  loadingMessage: {
    color: 'rgba(255,255,255,0.72)',
    marginTop: 10,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 18,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 999,
  },
  loadingFootnote: {
    color: 'rgba(255,255,255,0.45)',
    marginTop: 12,
    fontSize: 12,
  },
});

export default MathSolverScreen;
