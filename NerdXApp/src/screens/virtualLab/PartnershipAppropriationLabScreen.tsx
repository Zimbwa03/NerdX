// Partnership Appropriation Lab – ZIMSEC O-Level Paper 2 Partnership Accounts
// Fetches different questions from API (Vertex AI). Same depth as Balance Sheet Builder.

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
  question_id: 'fallback-partnership',
  question_type: 'partnership_appropriation',
  difficulty_level: 'intermediate',
  marks: 18,
  time_estimate: '22 minutes',
  scenario: {
    business_name: 'Moyo & Ncube Traders',
    financial_year_end: '31 December 2025',
    context: "Partnership (profit share 2:1). Prepare the Appropriation Account and show the partners' Capital and Current account balances after appropriation. Interest on capital 5% p.a.; Ncube receives a salary of $12,000.",
    additional_info: '',
  },
  question_data: {
    trial_balance: [
      { account: 'Capital - Moyo', debit: null, credit: 60000 },
      { account: 'Capital - Ncube', debit: null, credit: 40000 },
      { account: 'Current account - Moyo (1 Jan)', debit: 2000, credit: null },
      { account: 'Current account - Ncube (1 Jan)', debit: null, credit: 3000 },
      { account: 'Drawings - Moyo', debit: 8000, credit: null },
      { account: 'Drawings - Ncube', debit: 5000, credit: null },
      { account: 'Net Profit (before appropriation)', debit: null, credit: 45000 },
    ],
    adjustments: [
      { id: 'adj_1', type: 'interest_on_capital', description: 'Interest on capital 5% per annum' },
      { id: 'adj_2', type: 'partner_salary', description: "Ncube's salary $12,000" },
      { id: 'adj_3', type: 'profit_share', description: 'Profit shared Moyo:Ncube = 2:1' },
    ],
  },
  requirements: [],
  step_by_step_guidance: [
    { step: 1, instruction: 'Start with Net Profit', hint: 'Bring in the net profit before appropriation.' },
    { step: 2, instruction: 'Deduct interest on capital', hint: 'Calculate 5% of each partner\'s capital; deduct from profit.' },
    { step: 3, instruction: 'Deduct partner salary', hint: "Deduct Ncube's salary from remaining profit." },
    { step: 4, instruction: 'Share remaining profit', hint: 'Divide residual profit in the ratio 2:1 (Moyo:Ncube).' },
    { step: 5, instruction: 'Update Current accounts', hint: 'Add interest, salary, profit share; deduct drawings. Balance c/d.' },
  ],
  model_answer_summary: {
    net_profit: 45000,
    interest_on_capital_moyo: 3000,
    interest_on_capital_ncube: 2000,
    salary_ncube: 12000,
    profit_share_moyo: 20000,
    profit_share_ncube: 10000,
    current_balance_moyo: 13000,
    current_balance_ncube: 15000,
  },
  source: 'fallback',
};

function normalizeQuestion(raw: any): AccountingLabQuestion {
  const q = raw?.scenario ? raw : FALLBACK_QUESTION;
  const scenario = q.scenario || FALLBACK_QUESTION.scenario;
  const qd = q.question_data || FALLBACK_QUESTION.question_data;
  const trial_balance = Array.isArray(qd.trial_balance) ? qd.trial_balance : FALLBACK_QUESTION.question_data.trial_balance;
  const adjustments = Array.isArray(qd.adjustments) ? qd.adjustments : FALLBACK_QUESTION.question_data.adjustments;
  const steps = Array.isArray(q.step_by_step_guidance) && q.step_by_step_guidance.length > 0 ? q.step_by_step_guidance : FALLBACK_QUESTION.step_by_step_guidance!;
  return {
    question_id: q.question_id || 'pa-1',
    question_type: q.question_type || 'partnership_appropriation',
    difficulty_level: q.difficulty_level || 'intermediate',
    marks: q.marks,
    time_estimate: q.time_estimate,
    scenario: {
      business_name: scenario.business_name || 'Partnership',
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

const PartnershipAppropriationLabScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const themedColors = useThemedColors();
  const simulation = getSimulationById('accounting-partnership-appropriation-lab');
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
      const data = await virtualLabApi.getPartnershipAppropriationQuestion({ difficulty_level: 'intermediate', format: 'vertical' });
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
      <SimulationHeader simulation={simulation} onBack={() => navigation.goBack()} xpReward={simulation.xpReward} />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>Generating your Partnership question…</Text>
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
                    <Text style={[styles.tbCell, styles.tbNum, { color: themedColors.text.primary }]}>{row.debit != null ? Number(row.debit).toLocaleString() : '–'}</Text>
                    <Text style={[styles.tbCell, styles.tbNum, { color: themedColors.text.primary }]}>{row.credit != null ? Number(row.credit).toLocaleString() : '–'}</Text>
                  </View>
                ))}
                {trialBalance.length > 14 && <Text style={[styles.tbNote, { color: themedColors.text.secondary }]}>… and more accounts</Text>}
              </View>
            )}
          </TouchableOpacity>

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
              <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>Model Appropriation (check your answer)</Text>
              <Ionicons name={showModelAnswer ? 'chevron-up' : 'chevron-down'} size={20} color={themedColors.text.secondary} />
            </View>
            {showModelAnswer && summary && (
              <View style={styles.modelAnswer}>
                {summary.net_profit != null && <Text style={[styles.modelSection, { color: themedColors.text.primary }]}>Net profit: ${(summary.net_profit as number).toLocaleString()}</Text>}
                {summary.profit_share_moyo != null && <Text style={[styles.modelSection, { color: ACCENT }]}>Profit share (Moyo): ${(summary.profit_share_moyo as number).toLocaleString()}</Text>}
                {summary.profit_share_ncube != null && <Text style={[styles.modelSection, { color: ACCENT }]}>Profit share (Ncube): ${(summary.profit_share_ncube as number).toLocaleString()}</Text>}
                {summary.current_balance_moyo != null && <Text style={[styles.modelSection, { color: themedColors.text.primary }]}>Current balance (Moyo): ${(summary.current_balance_moyo as number).toLocaleString()}</Text>}
                {summary.current_balance_ncube != null && <Text style={[styles.modelSection, { color: themedColors.text.primary }]}>Current balance (Ncube): ${(summary.current_balance_ncube as number).toLocaleString()}</Text>}
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

export default PartnershipAppropriationLabScreen;
