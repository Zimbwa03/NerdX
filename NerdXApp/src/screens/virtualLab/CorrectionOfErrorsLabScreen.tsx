// Correction of Errors Lab – ZIMSEC O-Level Paper 2 Correction of Errors
// Fetches different questions from API (Vertex AI). Same depth as Balance Sheet Builder.
// Renders "Errors" (or adjustments) and model answer with corrected totals.

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '../../theme/useThemedStyles';
import { SimulationHeader, KnowledgeCheck } from '../../components/virtualLab';
import { getSimulationById } from '../../data/virtualLab';
import { virtualLabApi, AccountingLabQuestion } from '../../services/api/virtualLabApi';

const ACCENT = '#B8860B';

const FALLBACK_QUESTION: AccountingLabQuestion = {
  question_id: 'fallback-correction-errors',
  question_type: 'correction_of_errors',
  difficulty_level: 'intermediate',
  marks: 18,
  time_estimate: '22 minutes',
  scenario: {
    business_name: 'Rudo General Dealer',
    financial_year_end: '31 December 2025',
    context: "The trial balance of Rudo General Dealer does not agree. The following errors were discovered. Prepare journal entries to correct them and state the corrected trial balance totals.",
    additional_info: '',
  },
  question_data: {
    trial_balance: [
      { account: 'Debit total (as extracted)', debit: 245000, credit: null },
      { account: 'Credit total (as extracted)', debit: null, credit: 241000 },
    ],
    errors: [
      { id: 'err_1', type: 'omission', description: 'A credit purchase of $2,000 was not entered in the purchases account.' },
      { id: 'err_2', type: 'commission', description: 'Electricity paid $500 was debited to the rates account.' },
      { id: 'err_3', type: 'reversal', description: 'A payment of $1,500 to a creditor was debited to the creditor and credited to cash.' },
    ],
    adjustments: [
      { id: 'adj_1', type: 'omission', description: 'Credit purchase $2,000 not entered: Dr Purchases, Cr Payables.' },
      { id: 'adj_2', type: 'commission', description: 'Electricity $500 wrong account: Dr Electricity, Cr Rates.' },
      { id: 'adj_3', type: 'reversal', description: 'Payment $1,500 reversed: Dr Payables $3,000, Cr Cash $3,000 (correct double entry).' },
    ],
  },
  requirements: [],
  step_by_step_guidance: [
    { step: 1, instruction: 'Identify each error type', hint: 'Omission, commission, reversal, principle, compensating.' },
    { step: 2, instruction: 'Write the correcting journal entry', hint: 'Debit and credit the correct accounts with correct amounts.' },
    { step: 3, instruction: 'Determine effect on trial balance', hint: 'Each entry may change debit total, credit total, or both.' },
    { step: 4, instruction: 'Calculate corrected totals', hint: 'Apply all corrections to the extracted totals.' },
  ],
  model_answer_summary: {
    corrected_debit_total: 247000,
    corrected_credit_total: 247000,
  },
  source: 'fallback',
};

function normalizeQuestion(raw: any): AccountingLabQuestion {
  const q = raw?.scenario ? raw : FALLBACK_QUESTION;
  const scenario = q.scenario || FALLBACK_QUESTION.scenario;
  const qd = q.question_data || FALLBACK_QUESTION.question_data;
  const trial_balance = Array.isArray(qd.trial_balance) ? qd.trial_balance : FALLBACK_QUESTION.question_data.trial_balance;
  const errors = Array.isArray(qd.errors) ? qd.errors : (Array.isArray(qd.adjustments) ? qd.adjustments : FALLBACK_QUESTION.question_data.adjustments);
  const adjustments = Array.isArray(qd.adjustments) ? qd.adjustments : errors;
  const steps = Array.isArray(q.step_by_step_guidance) && q.step_by_step_guidance.length > 0 ? q.step_by_step_guidance : FALLBACK_QUESTION.step_by_step_guidance!;
  return {
    question_id: q.question_id || 'ce-1',
    question_type: q.question_type || 'correction_of_errors',
    difficulty_level: q.difficulty_level || 'intermediate',
    marks: q.marks,
    time_estimate: q.time_estimate,
    scenario: {
      business_name: scenario.business_name || 'Business',
      financial_year_end: scenario.financial_year_end || '31 December 2025',
      context: scenario.context || '',
      additional_info: scenario.additional_info,
    },
    question_data: { trial_balance, adjustments, errors },
    requirements: q.requirements,
    step_by_step_guidance: steps,
    model_answer_summary: q.model_answer_summary,
    source: q.source,
  };
}

const CorrectionOfErrorsLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('accounting-correction-of-errors-lab');
  const [question, setQuestion] = useState<AccountingLabQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showTrialBalance, setShowTrialBalance] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await virtualLabApi.getCorrectionOfErrorsQuestion({ difficulty_level: 'intermediate', format: 'vertical' });
      setQuestion(normalizeQuestion(data));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load question');
      setQuestion(FALLBACK_QUESTION);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  if (!simulation) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centered}>
          <Text style={[styles.errText, { color: themedColors.text.primary }]}>Simulation not found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const q = question || FALLBACK_QUESTION;
  const scenario = q.scenario;
  const trialBalance = q.question_data.trial_balance;
  const errorsToShow = q.question_data.errors && q.question_data.errors.length > 0 ? q.question_data.errors : q.question_data.adjustments;
  const steps = q.step_by_step_guidance || FALLBACK_QUESTION.step_by_step_guidance!;
  const summary = q.model_answer_summary;

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar barStyle="light-content" />
      <SimulationHeader simulation={simulation} onBack={() => navigation.goBack()} xpReward={simulation.xpReward} />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Generating your Correction of Errors question…</Text>
          <Text style={[styles.loadingSubtext, { color: themedColors.text.secondary }]}>Using Vertex AI for a new scenario each time</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {loadError && (
            <View style={[styles.banner, { backgroundColor: ACCENT + '25' }]}>
              <Ionicons name="information-circle" size={20} color={ACCENT} />
              <Text style={[styles.bannerText, { color: themedColors.text.primary }]}>Could not load new question. Showing practice example. Tap "New question" to try again.</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.newQuestionBtn, { backgroundColor: ACCENT + '20', borderColor: ACCENT }]} onPress={fetchQuestion} disabled={loading}>
            <Ionicons name="refresh" size={20} color={ACCENT} />
            <Text style={[styles.newQuestionBtnText, { color: ACCENT }]}>New question</Text>
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="business" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Scenario</Text>
              {q.source === 'vertex_ai' && <Text style={[styles.badge, { color: ACCENT }]}>New</Text>}
            </View>
            <Text style={[styles.businessName, { color: themedColors.text.primary }]}>{scenario.business_name}</Text>
            <Text style={[styles.meta, { color: themedColors.text.secondary }]}>Year ended {scenario.financial_year_end}</Text>
            <Text style={[styles.context, { color: themedColors.text.primary }]}>{scenario.context}</Text>
          </View>

          <TouchableOpacity style={[styles.card, { backgroundColor: themedColors.background.paper }]} onPress={() => setShowTrialBalance(!showTrialBalance)} activeOpacity={0.8}>
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="list" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Trial balance (extract / totals)</Text>
              <Ionicons name={showTrialBalance ? 'chevron-up' : 'chevron-down'} size={20} color={themedColors.text.secondary} />
            </View>
            {showTrialBalance && (
              <View style={styles.tbTable}>
                <View style={styles.tbRow}>
                  <Text style={[styles.tbHead, { color: themedColors.text.secondary }]}>Account</Text>
                  <Text style={[styles.tbHead, styles.tbNum, { color: themedColors.text.secondary }]}>Debit</Text>
                  <Text style={[styles.tbHead, styles.tbNum, { color: themedColors.text.secondary }]}>Credit</Text>
                </View>
                {(trialBalance || []).slice(0, 10).map((row: any, i: number) => (
                  <View key={i} style={styles.tbRow}>
                    <Text style={[styles.tbCell, { color: themedColors.text.primary }]} numberOfLines={1}>{row.account}</Text>
                    <Text style={[styles.tbCell, styles.tbNum, { color: themedColors.text.primary }]}>{row.debit != null ? Number(row.debit).toLocaleString() : '–'}</Text>
                    <Text style={[styles.tbCell, styles.tbNum, { color: themedColors.text.primary }]}>{row.credit != null ? Number(row.credit).toLocaleString() : '–'}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="warning" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Errors discovered</Text>
            </View>
            {(errorsToShow || []).map((err: any, i: number) => (
              <View key={err.id || i} style={styles.adjRow}>
                <Text style={[styles.adjType, { color: ACCENT }]}>{err.type || 'Error'}</Text>
                <Text style={[styles.adjDesc, { color: themedColors.text.primary }]}>{err.description || err.desc || ''}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="walk" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Step-by-step</Text>
            </View>
            {(steps || []).map((s: any) => (
              <View key={s.step} style={styles.stepRow}>
                <View style={[styles.stepBadge, { backgroundColor: ACCENT }]}>
                  <Text style={styles.stepNum}>{s.step}</Text>
                </View>
                <View style={styles.stepBody}>
                  <Text style={[styles.stepInstruction, { color: themedColors.text.primary }]}>{s.instruction}</Text>
                  <Text style={[styles.stepHint, { color: themedColors.text.secondary }]}>{s.hint}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.card, { backgroundColor: themedColors.background.paper }]} onPress={() => setShowModelAnswer(!showModelAnswer)} activeOpacity={0.8}>
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="document-text" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Corrected totals (check your answer)</Text>
              <Ionicons name={showModelAnswer ? 'chevron-up' : 'chevron-down'} size={20} color={themedColors.text.secondary} />
            </View>
            {showModelAnswer && summary && (
              <View style={styles.modelAnswer}>
                {summary.corrected_debit_total != null && <Text style={[styles.modelSection, { color: ACCENT }]}>Corrected debit total: ${(summary.corrected_debit_total as number).toLocaleString()}</Text>}
                {summary.corrected_credit_total != null && <Text style={[styles.modelSection, { color: ACCENT }]}>Corrected credit total: ${(summary.corrected_credit_total as number).toLocaleString()}</Text>}
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quizButton, { backgroundColor: ACCENT }]} onPress={() => setShowQuiz(true)}>
            <Text style={styles.quizButtonText}>Take Knowledge Check</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      <KnowledgeCheck visible={showQuiz} simulation={simulation} onComplete={() => setShowQuiz(false)} onClose={() => setShowQuiz(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errText: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  backBtn: { backgroundColor: '#B8860B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  backBtnText: { color: '#FFF', fontWeight: '700' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  loadingText: { fontSize: 16, fontWeight: '600' },
  loadingSubtext: { fontSize: 13 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, marginBottom: 12 },
  bannerText: { flex: 1, fontSize: 13 },
  newQuestionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8, marginBottom: 12, borderWidth: 1 },
  newQuestionBtnText: { fontSize: 15, fontWeight: '700' },
  badge: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  card: { borderRadius: 16, padding: 16, marginBottom: 12 },
  cardAccent: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, paddingVertical: 6, paddingHorizontal: 0 },
  cardTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  businessName: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  meta: { fontSize: 13, marginBottom: 8 },
  context: { fontSize: 14, lineHeight: 20 },
  tbTable: { marginTop: 4 },
  tbRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  tbHead: { fontSize: 12, fontWeight: '700' },
  tbCell: { fontSize: 12 },
  tbNum: { width: 72, textAlign: 'right' },
  tbNote: { fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  adjRow: { marginBottom: 10 },
  adjType: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  adjDesc: { fontSize: 13, lineHeight: 18 },
  stepRow: { flexDirection: 'row', marginBottom: 14 },
  stepBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepNum: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  stepBody: { flex: 1 },
  stepInstruction: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  stepHint: { fontSize: 12, lineHeight: 18 },
  modelAnswer: { gap: 8 },
  modelSection: { fontSize: 13, lineHeight: 20 },
  quizButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8, marginTop: 8 },
  quizButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default CorrectionOfErrorsLabScreen;
