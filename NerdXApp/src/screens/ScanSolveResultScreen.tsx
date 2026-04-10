import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  LayoutAnimation,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import { WebView } from 'react-native-webview';
import MathRenderer from '../components/MathRenderer';
import { useSolveStore } from '../stores/solveStore';
import { resolveConceptToNote, showMissingConceptAlert } from '../utils/scanSolveResolver';
import { trackScanSolveEvent } from '../utils/scanSolveAnalytics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5];

const ScanSolveResultScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [rate, setRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [webviewError, setWebviewError] = useState(false);
  const [stepsY, setStepsY] = useState(0);
  const result = useSolveStore((state) => state.result);
  const saveToNotes = useSolveStore((state) => state.saveToNotes);

  useEffect(() => {
    if (!result?.media?.audio_base64) return;
    let isCancelled = false;
    const currentResult = result;

    async function prepareAudio() {
      try {
        const outputPath = `${FileSystem.cacheDirectory}scan-solve-${currentResult.id}.mp3`;
        await FileSystem.writeAsStringAsync(outputPath, currentResult.media.audio_base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (!isCancelled) {
          setAudioUri(outputPath);
        }
      } catch (error) {
        console.warn('Failed to prepare scan solve audio', error);
      }
    }

    prepareAudio();
    return () => {
      isCancelled = true;
    };
  }, [result]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => undefined);
      }
    };
  }, []);

  const currentStepIndex = useMemo(() => {
    if (!result?.solution.steps.length || !duration) return -1;
    return Math.min(
      result.solution.steps.length - 1,
      Math.floor((position / duration) * result.solution.steps.length)
    );
  }, [duration, position, result?.solution.steps.length]);

  if (!result) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="sparkles-outline" size={38} color="#22c55e" />
        <Text style={styles.emptyTitle}>No lesson loaded</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('MathSolver')}>
          <Text style={styles.primaryButtonText}>Open Scan & Solve</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const loadAndPlayAudio = async () => {
    if (!audioUri) return;

    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true, progressUpdateIntervalMillis: 300, rate, shouldCorrectPitch: true },
          (status) => {
            if (!status.isLoaded) return;
            setIsPlaying(status.isPlaying);
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              trackScanSolveEvent('audio_played', {
                subject: result.problem.subject,
                played_to_percent: 100,
                speed: rate,
              });
              scrollRef.current?.scrollTo({ y: stepsY, animated: true });
            }
          }
        );
        soundRef.current = sound;
        trackScanSolveEvent('audio_played', {
          subject: result.problem.subject,
          played_to_percent: 0,
          speed: rate,
        });
      } else {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      Alert.alert('Audio unavailable', 'The narration could not be played on this device.');
    }
  };

  const togglePlayback = async () => {
    Haptics.selectionAsync();
    if (!soundRef.current) {
      await loadAndPlayAudio();
      return;
    }
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const seekBy = async (milliseconds: number) => {
    if (!soundRef.current) return;
    const nextPosition = Math.max(0, Math.min(duration, position + milliseconds));
    await soundRef.current.setPositionAsync(nextPosition);
  };

  const changeSpeed = async () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(rate);
    const nextRate = PLAYBACK_SPEEDS[(currentIndex + 1) % PLAYBACK_SPEEDS.length];
    setRate(nextRate);
    if (soundRef.current) {
      await soundRef.current.setRateAsync(nextRate, true);
    }
  };

  const toggleStep = (stepNumber: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSteps((current) =>
      current.includes(stepNumber)
        ? current.filter((item) => item !== stepNumber)
        : [...current, stepNumber]
    );
    trackScanSolveEvent('step_expanded', {
      step_number: stepNumber,
      subject: result.problem.subject,
    });
  };

  const expandAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSteps(result.solution.steps.map((step) => step.step_number));
  };

  const copyAnswer = async () => {
    await Clipboard.setStringAsync(result.solution.final_answer);
    Alert.alert('Copied', 'The final answer has been copied.');
  };

  const shareSolution = async () => {
    await Share.share({
      message: `${result.problem.plain}\n\nFinal Answer: ${result.solution.final_answer}`,
    });
  };

  const openConcept = (concept: string) => {
    const target = resolveConceptToNote(concept);
    if (!target) {
      showMissingConceptAlert(concept);
      return;
    }
    navigation.navigate('MathNotesDetail', {
      topic: target.topic,
      isALevel: target.isALevel,
    });
  };

  const saveCurrent = () => {
    saveToNotes(result);
    trackScanSolveEvent('solution_saved', {
      subject: result.problem.subject,
      difficulty: result.problem.difficulty,
    });
    Alert.alert('Saved', 'This lesson has been saved to your local notes history.');
  };

  const formatTime = (value: number) => {
    const totalSeconds = Math.floor(value / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.stickyHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerMeta}>
          <Text style={styles.subjectBadge}>{result.problem.subject} • {result.problem.difficulty}</Text>
          <Text style={styles.headerTitle} numberOfLines={2}>{result.problem.plain || result.problem.latex}</Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Visual Explanation</Text>
        <View style={styles.webviewCard}>
          {webviewError ? (
            <View style={styles.webviewFallback}>
              <Text style={styles.webviewFallbackText}>Visualization unavailable</Text>
              <TouchableOpacity onPress={() => setWebviewError(false)} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <WebView
              source={{ html: result.media.simulation_html }}
              style={styles.webview}
              scrollEnabled={false}
              onError={() => setWebviewError(true)}
              originWhitelist={['*']}
            />
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.conceptsRow}>
          {result.solution.key_concepts.map((concept) => (
            <TouchableOpacity
              key={concept}
              style={styles.conceptChip}
              onPress={() => openConcept(concept)}
            >
              <Text style={styles.conceptChipText}>{concept}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>Listen & Learn</Text>
        <View style={styles.audioCard}>
          <Text style={styles.audioTitle}>Solving: {result.problem.subject}</Text>
          <View style={styles.waveRow}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                style={[
                  styles.waveBar,
                  {
                    height: isPlaying ? 12 + ((index + currentStepIndex + 1) % 4) * 8 : 12,
                    opacity: isPlaying ? 1 : 0.4,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.audioProgress}>
            {formatTime(position)} / {formatTime(duration || 0)}
          </Text>
          <View style={styles.audioControls}>
            <TouchableOpacity onPress={() => seekBy(-10000)} style={styles.audioAction}>
              <Ionicons name="play-back" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayback} style={styles.audioPlay}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color="#07120b" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => seekBy(10000)} style={styles.audioAction}>
              <Ionicons name="play-forward" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={changeSpeed} style={styles.audioSpeed}>
              <Text style={styles.audioSpeedText}>{rate}x</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setShowTranscript((value) => !value)} style={styles.transcriptToggle}>
            <Text style={styles.transcriptToggleText}>{showTranscript ? 'Hide Transcript' : 'Show Transcript'}</Text>
          </TouchableOpacity>
          {showTranscript ? <Text style={styles.transcriptText}>{result.solution.audio_script}</Text> : null}
        </View>

        <View onLayout={(event) => setStepsY(event.nativeEvent.layout.y)}>
          <View style={styles.stepsHeaderRow}>
            <Text style={styles.sectionLabel}>Step-by-Step Solution</Text>
            <TouchableOpacity onPress={expandAll}>
              <Text style={styles.expandAllText}>Expand All</Text>
            </TouchableOpacity>
          </View>

          {result.solution.steps.map((step) => {
            const expanded = expandedSteps.includes(step.step_number);
            const highlighted = currentStepIndex === step.step_number - 1;
            return (
              <View
                key={step.step_number}
                style={[
                  styles.stepCard,
                  highlighted && styles.stepCardHighlighted,
                ]}
              >
                <TouchableOpacity style={styles.stepHeader} onPress={() => toggleStep(step.step_number)}>
                  <View>
                    <Text style={styles.stepLabel}>STEP {step.step_number}</Text>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                  </View>
                  <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#fff" />
                </TouchableOpacity>
                {expanded ? (
                  <View style={styles.stepBody}>
                    <Text style={styles.stepWhy}>WHY: {step.explanation}</Text>
                    {step.working ? (
                      <View style={styles.mathBlock}>
                        <MathRenderer content={step.working} fontSize={16} />
                      </View>
                    ) : null}
                    {step.hint ? <Text style={styles.stepHint}>Watch out: {step.hint}</Text> : null}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.answerBanner}>
          <Text style={styles.answerLabel}>Final Answer</Text>
          <MathRenderer content={result.solution.final_answer} fontSize={20} />
          <View style={styles.answerActions}>
            <TouchableOpacity style={styles.answerActionButton} onPress={copyAnswer}>
              <Text style={styles.answerActionText}>Copy Answer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.answerActionButton} onPress={shareSolution}>
              <Text style={styles.answerActionText}>Share Solution</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Learn More</Text>
        <View style={styles.infoCardAmber}>
          <Text style={styles.infoCardTitle}>ZIMSEC Exam Tip</Text>
          <Text style={styles.infoCardText}>{result.solution.zimsec_exam_tip}</Text>
        </View>

        <View style={styles.infoCardRed}>
          <Text style={styles.infoCardTitle}>Common Mistakes</Text>
          {result.solution.common_mistakes.map((mistake) => (
            <Text key={mistake} style={styles.infoBullet}>• {mistake}</Text>
          ))}
        </View>

        <View style={styles.practiceCard}>
          <Text style={styles.infoCardTitle}>Practice More</Text>
          {result.solution.similar_problems.map((problem) => (
            <TouchableOpacity
              key={problem.problem}
              style={styles.practiceChip}
              onPress={() => {
                trackScanSolveEvent('similar_problem_tapped', { from_subject: result.problem.subject });
                navigation.navigate('MathSolver', {
                  prefillText: problem.problem,
                  autoSolve: true,
                });
              }}
            >
              <Text style={styles.practiceChipText}>{problem.problem}</Text>
              <Text style={styles.practiceHint}>{problem.hint}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.bottomButton} onPress={saveCurrent}>
            <Text style={styles.bottomButtonText}>Save to Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('MathSolver')}>
            <Text style={styles.bottomButtonText}>Solve Another</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
  },
  emptyState: {
    flex: 1,
    backgroundColor: '#0f1117',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 16,
  },
  stickyHeader: {
    paddingTop: 56,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerBack: {
    marginRight: 12,
    paddingTop: 4,
  },
  headerMeta: {
    flex: 1,
  },
  subjectBadge: {
    color: '#86efac',
    textTransform: 'capitalize',
    fontWeight: '700',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  sectionLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 14,
  },
  webviewCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
    backgroundColor: '#111827',
    height: 320,
    marginBottom: 14,
  },
  webview: {
    flex: 1,
    backgroundColor: '#111827',
  },
  webviewFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  webviewFallbackText: {
    color: '#fff',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#22c55e',
  },
  retryButtonText: {
    color: '#07120b',
    fontWeight: '800',
  },
  conceptsRow: {
    gap: 10,
    marginBottom: 24,
  },
  conceptChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  conceptChipText: {
    color: '#d1fae5',
    fontWeight: '600',
  },
  audioCard: {
    backgroundColor: '#161d2d',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  audioTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  waveRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    height: 40,
    marginBottom: 12,
  },
  waveBar: {
    width: 10,
    borderRadius: 999,
    backgroundColor: '#22c55e',
  },
  audioProgress: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  audioAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlay: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioSpeed: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  audioSpeedText: {
    color: '#fff',
    fontWeight: '700',
  },
  transcriptToggle: {
    alignSelf: 'flex-start',
  },
  transcriptToggleText: {
    color: '#86efac',
    fontWeight: '700',
  },
  transcriptText: {
    color: 'rgba(255,255,255,0.72)',
    marginTop: 12,
    lineHeight: 22,
  },
  stepsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandAllText: {
    color: '#86efac',
    fontWeight: '700',
  },
  stepCard: {
    backgroundColor: '#161d2d',
    borderRadius: 18,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  stepCardHighlighted: {
    borderColor: '#86efac',
    borderWidth: 1,
  },
  stepHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepLabel: {
    color: '#86efac',
    fontWeight: '800',
    marginBottom: 6,
  },
  stepTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  stepBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stepWhy: {
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: 12,
  },
  mathBlock: {
    backgroundColor: '#0f1117',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  stepHint: {
    color: '#fcd34d',
  },
  answerBanner: {
    backgroundColor: 'rgba(34,197,94,0.14)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
    marginTop: 12,
    marginBottom: 24,
  },
  answerLabel: {
    color: '#dcfce7',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  answerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  answerActionButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#111827',
    paddingVertical: 12,
    alignItems: 'center',
  },
  answerActionText: {
    color: '#fff',
    fontWeight: '700',
  },
  infoCardAmber: {
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  infoCardRed: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  infoCardTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 10,
  },
  infoCardText: {
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  infoBullet: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  practiceCard: {
    backgroundColor: '#161d2d',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  practiceChip: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  practiceChipText: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 6,
  },
  practiceHint: {
    color: 'rgba(255,255,255,0.65)',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#07120b',
    fontWeight: '800',
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#22c55e',
  },
  primaryButtonText: {
    color: '#07120b',
    fontWeight: '800',
  },
});

export default ScanSolveResultScreen;
