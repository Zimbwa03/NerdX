// Balance Sheet Lab – ZIMSEC O-Level Paper 2 Statement of Financial Position
// Fetches different questions from API (Vertex AI). Students practice varied Balance Sheet scenarios.

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
import { virtualLabApi, BalanceSheetQuestion } from '../../services/api/virtualLabApi';

const ACCENT = '#B8860B';

// Fallback when API fails – same structure as API response
const FALLBACK_QUESTION: BalanceSheetQuestion = {
  question_id: 'fallback',
  question_type: 'balance_sheet',
  business_type: 'sole_trader',
  difficulty_level: 'intermediate',
  marks: 20,
  time_estimate: '24 minutes',
  scenario: {
    business_name: 'Takura Enterprises',
    financial_year_end: '31 December 2025',
    context: 'Sole trader. Prepare a Balance Sheet (Statement of Financial Position) as at the year end showing clearly Working Capital.',
    additional_info: '',
  },
  question_data: {
    trial_balance: [
      { account: 'Capital (1 Jan 2025)', debit: null, credit: 50000 },
      { account: 'Drawings', debit: 8000, credit: null },
      { account: 'Premises', debit: 80000, credit: null },
      { account: 'Motor Vehicles (Cost)', debit: 40000, credit: null },
      { account: 'Accumulated Depreciation - Vehicles (1 Jan)', debit: null, credit: 12000 },
      { account: 'Equipment', debit: 25000, credit: null },
      { account: 'Inventory', debit: 15000, credit: null },
      { account: 'Trade Receivables', debit: 18000, credit: null },
      { account: 'Trade Payables', debit: null, credit: 12000 },
      { account: 'Bank', debit: 8500, credit: null },
      { account: 'Cash', debit: 500, credit: null },
      { account: 'Sales', debit: null, credit: 180000 },
      { account: 'Purchases', debit: 110000, credit: null },
      { account: 'Rent', debit: 12000, credit: null },
      { account: 'Salaries', debit: 35000, credit: null },
      { account: 'Insurance', debit: 2400, credit: null },
      { account: 'Electricity', debit: 3600, credit: null },
      { account: 'Loan from ABC Bank', debit: null, credit: 20000 },
    ],
    adjustments: [
      { id: 'adj_1', type: 'Depreciation', description: 'Motor vehicles 20% reducing balance; Equipment 10% straight line' },
      { id: 'adj_2', type: 'Accrual', description: 'Electricity owing at year-end: $400' },
      { id: 'adj_3', type: 'Prepayment', description: 'Insurance prepaid at year-end: $600' },
      { id: 'adj_4', type: 'Provision', description: 'Provision for doubtful debts 5% of trade receivables' },
      { id: 'adj_5', type: 'Closing stock', description: 'Closing inventory valued at $18,000' },
    ],
  },
  requirements: [],
  step_by_step_guidance: [
    { step: 1, instruction: 'List all Non-Current Assets at Net Book Value', hint: 'Subtract accumulated depreciation from cost.' },
    { step: 2, instruction: 'List all Current Assets', hint: 'Include inventory, debtors (less provision), prepayments, bank, cash.' },
    { step: 3, instruction: 'List all Current Liabilities', hint: 'Include creditors and accrued expenses.' },
    { step: 4, instruction: 'Calculate Working Capital', hint: 'Working Capital = Current Assets − Current Liabilities' },
    { step: 5, instruction: 'Complete the Capital Section', hint: 'Opening Capital + Net Profit − Drawings = Closing Capital' },
    { step: 6, instruction: 'Add Long-term Liabilities', hint: 'Loans payable after 12 months from balance sheet date.' },
  ],
  model_answer_summary: {
    working_capital: 32300,
    closing_capital: 52500,
    non_current_assets_total: 124900,
    current_assets_total: 44700,
    current_liabilities_total: 12400,
  },
  source: 'fallback',
};

function normalizeQuestion(raw: any): BalanceSheetQuestion {
  const q = raw?.scenario ? raw : FALLBACK_QUESTION;
  const scenario = q.scenario || FALLBACK_QUESTION.scenario;
  const qd = q.question_data || FALLBACK_QUESTION.question_data;
  const trial_balance = Array.isArray(qd.trial_balance) ? qd.trial_balance : FALLBACK_QUESTION.question_data.trial_balance;
  const adjustments = Array.isArray(qd.adjustments) ? qd.adjustments : FALLBACK_QUESTION.question_data.adjustments;
  const steps = Array.isArray(q.step_by_step_guidance) && q.step_by_step_guidance.length > 0
    ? q.step_by_step_guidance
    : FALLBACK_QUESTION.step_by_step_guidance!;
  return {
    question_id: q.question_id || 'bs-1',
    question_type: q.question_type || 'balance_sheet',
    business_type: q.business_type || 'sole_trader',
    difficulty_level: q.difficulty_level || 'intermediate',
    marks: q.marks,
    time_estimate: q.time_estimate,
    scenario: {
      business_name: scenario.business_name || 'Business',
      financial_year_end: scenario.financial_year_end || '31 December 2025',
      context: scenario.context || '',
      additional_info: scenario.additional_info,
    },
    question_data: { trial_balance, adjustments },
    requirements: q.requirements,
    step_by_step_guidance: steps,
    model_answer_summary: q.model_answer_summary,
    source: q.source,
  };
}

const BalanceSheetLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('accounting-balance-sheet-lab');
  const [question, setQuestion] = useState<BalanceSheetQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showTrialBalance, setShowTrialBalance] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await virtualLabApi.getBalanceSheetQuestion({
        business_type: 'sole_trader',
        difficulty_level: 'intermediate',
        format: 'vertical',
      });
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
  const adjustments = q.question_data.adjustments;
  const steps = q.step_by_step_guidance || FALLBACK_QUESTION.step_by_step_guidance!;
  const summary = q.model_answer_summary;

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar barStyle="light-content" />
      <SimulationHeader
        simulation={simulation}
        onBack={() => navigation.goBack()}
        xpReward={simulation.xpReward}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
            Generating your Balance Sheet question…
          </Text>
          <Text style={[styles.loadingSubtext, { color: themedColors.text.secondary }]}>
            Using Vertex AI for a new scenario each time
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {loadError && (
            <View style={[styles.banner, { backgroundColor: ACCENT + '25' }]}>
              <Ionicons name="information-circle" size={20} color={ACCENT} />
              <Text style={[styles.bannerText, { color: themedColors.text.primary }]}>
                Could not load new question. Showing practice example. Tap "New question" to try again.
              </Text>
            </View>
          )}

          {/* New question button */}
          <TouchableOpacity
            style={[styles.newQuestionBtn, { backgroundColor: ACCENT + '20', borderColor: ACCENT }]}
            onPress={fetchQuestion}
            disabled={loading}
          >
            <Ionicons name="refresh" size={20} color={ACCENT} />
            <Text style={[styles.newQuestionBtnText, { color: ACCENT }]}>New question</Text>
          </TouchableOpacity>

          {/* Scenario */}
          <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="business" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Scenario</Text>
              {q.source === 'vertex_ai' && (
                <Text style={[styles.badge, { color: ACCENT }]}>New</Text>
              )}
            </View>
            <Text style={[styles.businessName, { color: themedColors.text.primary }]}>{scenario.business_name}</Text>
            <Text style={[styles.meta, { color: themedColors.text.secondary }]}>Year ended {scenario.financial_year_end}</Text>
            <Text style={[styles.context, { color: themedColors.text.primary }]}>{scenario.context}</Text>
          </View>

          {/* Trial Balance (collapsible) */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: themedColors.background.paper }]}
            onPress={() => setShowTrialBalance(!showTrialBalance)}
            activeOpacity={0.8}
          >
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="list" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Trial Balance (extract)</Text>
              <Ionicons name={showTrialBalance ? 'chevron-up' : 'chevron-down'} size={20} color={themedColors.text.secondary} />
            </View>
            {showTrialBalance && (
              <View style={styles.tbTable}>
                <View style={styles.tbRow}>
                  <Text style={[styles.tbHead, { color: themedColors.text.secondary }]}>Account</Text>
                  <Text style={[styles.tbHead, styles.tbNum, { color: themedColors.text.secondary }]}>Debit</Text>
                  <Text style={[styles.tbHead, styles.tbNum, { color: themedColors.text.secondary }]}>Credit</Text>
                </View>
                {(trialBalance || []).slice(0, 14).map((row: any, i: number) => (
                  <View key={i} style={styles.tbRow}>
                    <Text style={[styles.tbCell, { color: themedColors.text.primary }]} numberOfLines={1}>{row.account}</Text>
                    <Text style={[styles.tbCell, styles.tbNum, { color: themedColors.text.primary }]}>
                      {row.debit != null ? Number(row.debit).toLocaleString() : '–'}
                    </Text>
                    <Text style={[styles.tbCell, styles.tbNum, { color: themedColors.text.primary }]}>
                      {row.credit != null ? Number(row.credit).toLocaleString() : '–'}
                    </Text>
                  </View>
                ))}
                {trialBalance.length > 14 && (
                  <Text style={[styles.tbNote, { color: themedColors.text.secondary }]}>… and more accounts</Text>
                )}
              </View>
            )}
          </TouchableOpacity>

          {/* Adjustments */}
          <View style={[styles.card, { backgroundColor: themedColors.background.paper }]}>
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="create" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Adjustments</Text>
            </View>
            {(adjustments || []).map((adj: any, i: number) => (
              <View key={adj.id || i} style={styles.adjRow}>
                <Text style={[styles.adjType, { color: ACCENT }]}>{adj.type || 'Adjustment'}</Text>
                <Text style={[styles.adjDesc, { color: themedColors.text.primary }]}>{adj.description || adj.desc || ''}</Text>
              </View>
            ))}
          </View>

          {/* Step-by-step guidance */}
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

          {/* Model answer (collapsible) – show summary if from API */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: themedColors.background.paper }]}
            onPress={() => setShowModelAnswer(!showModelAnswer)}
            activeOpacity={0.8}
          >
            <View style={[styles.cardAccent, { backgroundColor: ACCENT + '20' }]}>
              <Ionicons name="document-text" size={20} color={ACCENT} />
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Model Balance Sheet (check your answer)</Text>
              <Ionicons name={showModelAnswer ? 'chevron-up' : 'chevron-down'} size={20} color={themedColors.text.secondary} />
            </View>
            {showModelAnswer && summary && (
              <View style={styles.modelAnswer}>
                {summary.non_current_assets_total != null && (
                  <Text style={[styles.modelSection, { color: themedColors.text.primary }]}>
                    Non-Current Assets total: ${(summary.non_current_assets_total as number).toLocaleString()}
                  </Text>
                )}
                {summary.current_assets_total != null && (
                  <Text style={[styles.modelSection, { color: themedColors.text.primary }]}>
                    Current Assets total: ${(summary.current_assets_total as number).toLocaleString()}
                  </Text>
                )}
                {summary.current_liabilities_total != null && (
                  <Text style={[styles.modelSection, { color: themedColors.text.primary }]}>
                    Current Liabilities total: ${(summary.current_liabilities_total as number).toLocaleString()}
                  </Text>
                )}
                {summary.working_capital != null && (
                  <Text style={[styles.modelSection, { color: ACCENT }]}>
                    Working Capital = ${(summary.working_capital as number).toLocaleString()}
                  </Text>
                )}
                {summary.closing_capital != null && (
                  <Text style={[styles.modelSection, { color: themedColors.text.primary }]}>
                    Closing Capital = ${(summary.closing_capital as number).toLocaleString()}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quizButton, { backgroundColor: ACCENT }]}
            onPress={() => setShowQuiz(true)}
          >
            <Text style={styles.quizButtonText}>Take Knowledge Check</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errText: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  backBtn: { backgroundColor: '#B8860B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  backBtnText: { color: '#FFF', fontWeight: '700' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  loadingText: { fontSize: 16, fontWeight: '600' },
  loadingSubtext: { fontSize: 13 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, marginBottom: 12 },
  bannerText: { flex: 1, fontSize: 13 },
  newQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  newQuestionBtnText: { fontSize: 15, fontWeight: '700' },
  badge: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
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
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  quizButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default BalanceSheetLabScreen;
