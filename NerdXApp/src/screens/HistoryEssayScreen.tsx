// ZIMSEC History 3-part Essay Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  historyApi,
  type HistoryEssayQuestion,
  type HistoryMarkingResult,
} from '../services/api/historyApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import LoadingProgress from '../components/LoadingProgress';

const HISTORY_COLOR = '#5D4037';

type RouteParams = {
  topic: { id: string; name: string };
  subject: { id: string; name: string; color?: string };
};

const HistoryEssayScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const { topic, subject } = (route.params ?? {}) as RouteParams;

  const [question, setQuestion] = useState<HistoryEssayQuestion | null>(null);
  const [generating, setGenerating] = useState(false);
  const [partA, setPartA] = useState('');
  const [partB, setPartB] = useState('');
  const [partC, setPartC] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<HistoryMarkingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (question || !topic) return;
    let cancelled = false;
    (async () => {
      setGenerating(true);
      setError(null);
      try {
        const res = await historyApi.generateQuestion(topic);
        if (cancelled) return;
        if (res.success && res.data) {
          setQuestion(res.data);
          if (res.credits_remaining !== undefined) updateUser({ credits: res.credits_remaining });
        } else {
          setError(res.message ?? 'Failed to generate question.');
        }
      } catch (e) {
        if (!cancelled) setError('Failed to generate question. Please try again.');
      } finally {
        if (!cancelled) setGenerating(false);
      }
    })();
    return () => { cancelled = true; };
  }, [topic, question, updateUser]);

  const handleSubmit = async () => {
    if (!question) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await historyApi.submitEssay(question, {
        part_a: partA.trim(),
        part_b: partB.trim(),
        part_c: partC.trim(),
      });
      if (res.success && res.data) {
        setResult(res.data);
        if (res.data.credits_remaining !== undefined) updateUser({ credits: res.data.credits_remaining });
      } else {
        setError(res.message ?? res.data?.error ?? 'Failed to submit.');
      }
    } catch (e) {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewQuestion = () => {
    navigation.goBack();
  };

  if (!topic) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.noTopicText, { color: themedColors.text.secondary }]}>
          No topic selected. Choose a topic from the History page.
        </Text>
      </View>
    );
  }

  if (generating && !question) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <StatusBar barStyle="light-content" />
        <LoadingProgress visible message="Generating question…" estimatedTime={10} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    );
  }

  if (result) {
    const totalMarks = question?.total_marks ?? 32;
    const breakdown = result.breakdown ?? {};
    const hasDetailedExplanation =
      breakdown.part_a_analysis || breakdown.part_b_analysis || breakdown.part_c_analysis;
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <LinearGradient colors={[HISTORY_COLOR, '#3E2723']} style={styles.header}>
          <StatusBar barStyle="light-content" />
          <TouchableOpacity onPress={handleNewQuestion} style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>History Essay – Results</Text>
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Scores</Text>
            <View style={styles.scoresRow}>
              <Text style={[styles.scoreText, { color: themedColors.text.primary }]}>Part [a]: {result.part_a_score ?? 0}/5</Text>
              <Text style={[styles.scoreText, { color: themedColors.text.primary }]}>Part [b]: {result.part_b_score ?? 0}/12</Text>
              <Text style={[styles.scoreText, { color: themedColors.text.primary }]}>Part [c]: {result.part_c_score ?? 0}/15</Text>
              <Text style={[styles.scoreText, { color: themedColors.primary.main, fontWeight: 'bold' }]}>Total: {result.total ?? 0}/{totalMarks}</Text>
            </View>
            {result.part_a_feedback ? <Text style={[styles.feedbackText, { color: themedColors.text.secondary }]}><Text style={{ fontWeight: '600' }}>Part [a]:</Text> {result.part_a_feedback}</Text> : null}
            {result.part_b_feedback ? <Text style={[styles.feedbackText, { color: themedColors.text.secondary }]}><Text style={{ fontWeight: '600' }}>Part [b]:</Text> {result.part_b_feedback}</Text> : null}
            {result.part_c_feedback ? <Text style={[styles.feedbackText, { color: themedColors.text.secondary }]}><Text style={{ fontWeight: '600' }}>Part [c]:</Text> {result.part_c_feedback}</Text> : null}
            {result.constructive_feedback ? (
              <View style={styles.constructiveBlock}>
                <Text style={[styles.cardTitle, { color: themedColors.text.primary, marginBottom: 8 }]}>Constructive feedback</Text>
                <Text style={[styles.feedbackText, { color: themedColors.text.secondary }]}>{result.constructive_feedback}</Text>
              </View>
            ) : null}

            {hasDetailedExplanation ? (
              <View style={styles.constructiveBlock}>
                <Text style={[styles.cardTitle, { color: themedColors.text.primary, marginBottom: 8 }]}>Detailed explanation</Text>
                {breakdown.part_a_analysis ? (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={[styles.partLabel, { color: themedColors.primary.main }]}>Part [a] – What was marked</Text>
                    <Text style={[styles.feedbackText, { color: themedColors.text.secondary }]}>{breakdown.part_a_analysis}</Text>
                  </View>
                ) : null}
                {breakdown.part_b_analysis ? (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={[styles.partLabel, { color: themedColors.primary.main }]}>Part [b] – What was marked</Text>
                    <Text style={[styles.feedbackText, { color: themedColors.text.secondary }]}>{breakdown.part_b_analysis}</Text>
                  </View>
                ) : null}
                {breakdown.part_c_analysis ? (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={[styles.partLabel, { color: themedColors.primary.main }]}>Part [c] – What was marked</Text>
                    <Text style={[styles.feedbackText, { color: themedColors.text.secondary }]}>{breakdown.part_c_analysis}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            <TouchableOpacity style={[styles.submitButton, { backgroundColor: HISTORY_COLOR }]} onPress={handleNewQuestion}>
              <Text style={styles.submitButtonText}>Choose another topic</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!question) return null;

  const partAInfo = question.parts[0] ?? { label: '[a]', question_text: '', marks: 5 };
  const partBInfo = question.parts[1] ?? { label: '[b]', question_text: '', marks: 12 };
  const partCInfo = question.parts[2] ?? { label: '[c]', question_text: '', marks: 15 };

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <LinearGradient colors={[HISTORY_COLOR, '#3E2723']} style={styles.header}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History Essay</Text>
        <Text style={styles.headerSubtitle}>Topic: {question.topic}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Question</Text>
          <Text style={[styles.questionStem, { color: themedColors.text.secondary }]}>{question.question_text}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.partLabel, { color: themedColors.primary.main }]}>{partAInfo.label} ({partAInfo.marks} marks)</Text>
          <Text style={[styles.partQuestion, { color: themedColors.text.secondary }]}>{partAInfo.question_text}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themedColors.background.subtle, color: themedColors.text.primary }]}
            placeholder="Your answer for Part [a]…"
            placeholderTextColor={themedColors.text.hint}
            multiline
            numberOfLines={4}
            value={partA}
            onChangeText={setPartA}
          />
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.partLabel, { color: themedColors.primary.main }]}>{partBInfo.label} ({partBInfo.marks} marks)</Text>
          <Text style={[styles.partQuestion, { color: themedColors.text.secondary }]}>{partBInfo.question_text}</Text>
          <TextInput
            style={[styles.input, styles.inputLarge, { backgroundColor: themedColors.background.subtle, color: themedColors.text.primary }]}
            placeholder="Your answer for Part [b]…"
            placeholderTextColor={themedColors.text.hint}
            multiline
            numberOfLines={6}
            value={partB}
            onChangeText={setPartB}
          />
        </View>

        <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
          <Text style={[styles.partLabel, { color: themedColors.primary.main }]}>{partCInfo.label} ({partCInfo.marks} marks)</Text>
          <Text style={[styles.partQuestion, { color: themedColors.text.secondary }]}>{partCInfo.question_text}</Text>
          <TextInput
            style={[styles.input, styles.inputLarge, { backgroundColor: themedColors.background.subtle, color: themedColors.text.primary }]}
            placeholder="Your answer for Part [c]…"
            placeholderTextColor={themedColors.text.hint}
            multiline
            numberOfLines={6}
            value={partC}
            onChangeText={setPartC}
          />
        </View>

        {error ? <Text style={[styles.errorText, { color: themedColors.error.main }]}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: HISTORY_COLOR }, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Submit for marking</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16 },
  backButton: { position: 'absolute', left: 16, top: 48, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 4 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  questionStem: { fontSize: 15, lineHeight: 22 },
  partLabel: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  partQuestion: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: 12, fontSize: 15, minHeight: 100, textAlignVertical: 'top' },
  inputLarge: { minHeight: 140 },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  noTopicText: { padding: 24, textAlign: 'center', fontSize: 15 },
  scoresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  scoreText: { fontSize: 15 },
  feedbackText: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  constructiveBlock: { marginTop: 12 },
  errorText: { fontSize: 14, marginBottom: 12 },
});

export default HistoryEssayScreen;
