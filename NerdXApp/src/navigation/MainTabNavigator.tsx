/**
 * NerdX Main Tab Navigator — Brand Kit Section 5.4
 *
 * Five tabs: Learn · Progress · Modes · Community · Profile
 * Each tab owns its own Stack navigator so nested screens (Notes, Quiz, etc.)
 * stay within the context of the tab that launched them.
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { NerdXTabBar } from './NerdXTabBar';

// ─── Learn Tab screens ────────────────────────────────────────────────────────
import DashboardScreen from '../screens/DashboardScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import TopicsScreen from '../screens/TopicsScreen';
import QuizScreen from '../screens/QuizScreen';
import ScienceNotesScreen from '../screens/ScienceNotesScreen';
import ComputerScienceNotesScreen from '../screens/ComputerScienceNotesScreen';
import TopicNotesDetailScreen from '../screens/TopicNotesDetailScreen';
import MathNotesDetailScreen from '../screens/MathNotesDetailScreen';
import GraphPracticeScreen from '../screens/GraphPracticeScreen';
import EnglishComprehensionScreen from '../screens/EnglishComprehensionScreen';
import EnglishEssayScreen from '../screens/EnglishEssayScreen';
import HistoryEssayScreen from '../screens/HistoryEssayScreen';
import CombinedScienceExamScreen from '../screens/CombinedScienceExamScreen';
import ExamSetupScreen from '../screens/ExamSetupScreen';
import ExamSessionScreen from '../screens/ExamSessionScreen';
import ExamResultsScreen from '../screens/ExamResultsScreen';
import ExamReviewScreen from '../screens/ExamReviewScreen';
import ALevelPhysicsScreen from '../screens/ALevelPhysicsScreen';
import ALevelPhysicsNotesScreen from '../screens/ALevelPhysicsNotesScreen';
import ALevelChemistryScreen from '../screens/ALevelChemistryScreen';
import ALevelChemistryNotesScreen from '../screens/ALevelChemistryNotesScreen';
import ALevelPureMathScreen from '../screens/ALevelPureMathScreen';
import ALevelPureMathNotesScreen from '../screens/ALevelPureMathNotesScreen';
import ALevelBiologyScreen from '../screens/ALevelBiologyScreen';
import ALevelBiologyNotesScreen from '../screens/ALevelBiologyNotesScreen';
import GeographyNotesScreen from '../screens/GeographyNotesScreen';
import AccountingNotesScreen from '../screens/AccountingNotesScreen';
import CommerceNotesScreen from '../screens/CommerceNotesScreen';
import BusinessEnterpriseSkillsNotesScreen from '../screens/BusinessEnterpriseSkillsNotesScreen';
import HistoryNotesScreen from '../screens/HistoryNotesScreen';
import CreditsScreen from '../screens/CreditsScreen';

// ─── Progress Tab screens ─────────────────────────────────────────────────────
import ProgressScreen from '../screens/ProgressScreen';
import AIInsightsScreen from '../screens/AIInsightsScreen';

// ─── Modes Tab screens ────────────────────────────────────────────────────────
import VirtualLabScreen from '../screens/VirtualLabScreen';
import TeacherModeSetupScreen from '../screens/TeacherModeSetupScreen';
import TeacherModeScreen from '../screens/TeacherModeScreen';
import TeacherHistoryScreen from '../screens/TeacherHistoryScreen';
import ProjectListScreen from '../screens/ProjectListScreen';
import ProjectAssistantSetupScreen from '../screens/ProjectAssistantSetupScreen';
import ProjectAssistantScreen from '../screens/ProjectAssistantScreen';
import MathSolverScreen from '../screens/MathSolverScreen';
import FormulaSheetScreen from '../screens/FormulaSheetScreen';
import PastPaperScreen from '../screens/PastPaperScreen';
import OfflineSettingsScreen from '../screens/OfflineSettingsScreen';
import ModelDownloadScreen from '../screens/ModelDownloadScreen';
import OfflineChatScreen from '../screens/OfflineChatScreen';
import NerdXLiveModeScreen from '../screens/NerdXLiveModeScreen';
import NerdXLiveAudioScreen from '../screens/NerdXLiveAudioScreen';
import NerdXLiveVideoScreen from '../screens/NerdXLiveVideoScreen';
// Virtual Lab simulations
import CellExplorerScreen from '../screens/virtualLab/CellExplorerScreen';
import OsmosisScreen from '../screens/virtualLab/OsmosisScreen';
import AtomBuilderScreen from '../screens/virtualLab/AtomBuilderScreen';
import EquationBalancerScreen from '../screens/virtualLab/EquationBalancerScreen';
import CircuitBuilderScreen from '../screens/virtualLab/CircuitBuilderScreen';
import ProjectileMotionScreen from '../screens/virtualLab/ProjectileMotionScreen';
import FoodTestLabScreen from '../screens/virtualLab/FoodTestLabScreen';
import PhotosynthesisReactorScreen from '../screens/virtualLab/PhotosynthesisReactorScreen';
import EnzymeActionLabScreen from '../screens/virtualLab/EnzymeActionLabScreen';
import TranspirationTrackerScreen from '../screens/virtualLab/TranspirationTrackerScreen';
import HeartPumpScreen from '../screens/virtualLab/HeartPumpScreen';
import TitrationMasterScreen from '../screens/virtualLab/TitrationMasterScreen';
import PHScaleExplorerScreen from '../screens/virtualLab/pHScaleExplorerScreen';
import ElectrolysisSimulatorScreen from '../screens/virtualLab/ElectrolysisSimulatorScreen';
import MotionGrapherScreen from '../screens/virtualLab/MotionGrapherScreen';
import NewtonsLawsLabScreen from '../screens/virtualLab/NewtonsLawsLabScreen';
import ThermalExpansionScreen from '../screens/virtualLab/ThermalExpansionScreen';
import WavePropertiesScreen from '../screens/virtualLab/WavePropertiesScreen';
import VirtualLabTemplateScreen from '../screens/virtualLab/VirtualLabTemplateScreen';
import VirtualLabInteractiveScreen from '../screens/virtualLab/VirtualLabInteractiveScreen';
import MapWorkLabScreen from '../screens/virtualLab/MapWorkLabScreen';
import SixFigureGridLabScreen from '../screens/virtualLab/SixFigureGridLabScreen';
import CompassBearingLabScreen from '../screens/virtualLab/CompassBearingLabScreen';
import ContourLinesLabScreen from '../screens/virtualLab/ContourLinesLabScreen';
import ScaleDistanceLabScreen from '../screens/virtualLab/ScaleDistanceLabScreen';
import CrossSectionLabScreen from '../screens/virtualLab/CrossSectionLabScreen';
import MapLayersLabScreen from '../screens/virtualLab/MapLayersLabScreen';
import GeoMapsLabScreen from '../screens/virtualLab/GeoMapsLabScreen';
import DifferentiationLabScreen from '../screens/virtualLab/DifferentiationLabScreen';
import IntegrationLabScreen from '../screens/virtualLab/IntegrationLabScreen';
import QuadraticExplorerScreen from '../screens/virtualLab/QuadraticExplorerScreen';
import ComplexNumbersLabScreen from '../screens/virtualLab/ComplexNumbersLabScreen';
import TrigFunctionsLabScreen from '../screens/virtualLab/TrigFunctionsLabScreen';
import VectorVisualizerScreen from '../screens/virtualLab/VectorVisualizerScreen';
import MatrixSandboxScreen from '../screens/virtualLab/MatrixSandboxScreen';
import LinearProgrammingLabScreen from '../screens/virtualLab/LinearProgrammingLabScreen';
import MarketNegotiationScreen from '../screens/virtualLab/MarketNegotiationScreen';
import JobInterviewScreen from '../screens/virtualLab/JobInterviewScreen';
import UniversityCampusLifeScreen from '../screens/virtualLab/UniversityCampusLifeScreen';
import MedicalConsultationScreen from '../screens/virtualLab/MedicalConsultationScreen';
import InternationalTravelScreen from '../screens/virtualLab/InternationalTravelScreen';
import SocialGatheringsScreen from '../screens/virtualLab/SocialGatheringsScreen';
import BankingServicesScreen from '../screens/virtualLab/BankingServicesScreen';
import ProbabilitySimulatorScreen from '../screens/virtualLab/ProbabilitySimulatorScreen';
import StatisticsExplorerScreen from '../screens/virtualLab/StatisticsExplorerScreen';
import LogarithmsLabScreen from '../screens/virtualLab/LogarithmsLabScreen';
import SequencesSeriesLabScreen from '../screens/virtualLab/SequencesSeriesLabScreen';
import SimultaneousEquationsLabScreen from '../screens/virtualLab/SimultaneousEquationsLabScreen';
import RatioProportionLabScreen from '../screens/virtualLab/RatioProportionLabScreen';
import IndicesStandardFormLabScreen from '../screens/virtualLab/IndicesStandardFormLabScreen';
import BoundsAccuracyLabScreen from '../screens/virtualLab/BoundsAccuracyLabScreen';
import LinearGraphsLabScreen from '../screens/virtualLab/LinearGraphsLabScreen';
import InequalitiesRegionLabScreen from '../screens/virtualLab/InequalitiesRegionLabScreen';
import AngleRulesLabScreen from '../screens/virtualLab/AngleRulesLabScreen';
import SimilarityScaleLabScreen from '../screens/virtualLab/SimilarityScaleLabScreen';
import MensurationLabScreen from '../screens/virtualLab/MensurationLabScreen';
import PythagorasTrigLabScreen from '../screens/virtualLab/PythagorasTrigLabScreen';
import TransformationsLabScreen from '../screens/virtualLab/TransformationsLabScreen';
import BalanceSheetLabScreen from '../screens/virtualLab/BalanceSheetLabScreen';
import IncomeStatementLabScreen from '../screens/virtualLab/IncomeStatementLabScreen';
import PartnershipAppropriationLabScreen from '../screens/virtualLab/PartnershipAppropriationLabScreen';
import CashFlowStatementLabScreen from '../screens/virtualLab/CashFlowStatementLabScreen';
import ManufacturingAccountLabScreen from '../screens/virtualLab/ManufacturingAccountLabScreen';
import CorrectionOfErrorsLabScreen from '../screens/virtualLab/CorrectionOfErrorsLabScreen';
import NotForProfitLabScreen from '../screens/virtualLab/NotForProfitLabScreen';
import ProgrammingLabEditorScreen from '../screens/virtualLab/ProgrammingLabEditorScreen';
import WebDesignLabEditorScreen from '../screens/virtualLab/WebDesignLabEditorScreen';
import DatabaseLabEditorScreen from '../screens/virtualLab/DatabaseLabEditorScreen';
import ProjectGatesLabScreen from '../screens/virtualLab/ProjectGatesLabScreen';

// ─── Community Tab screens ────────────────────────────────────────────────────
import NotificationsScreen from '../screens/NotificationsScreen';
import NotificationDetailScreen from '../screens/NotificationDetailScreen';

// ─── Profile Tab screens ──────────────────────────────────────────────────────
import ProfileScreen from '../screens/ProfileScreen';
import AccountScreen from '../screens/AccountScreen';
import ReferralHubScreen from '../screens/ReferralHubScreen';
import BillingHistoryScreen from '../screens/BillingHistoryScreen';
import SecurityCenterScreen from '../screens/SecurityCenterScreen';
import LearningPreferencesScreen from '../screens/LearningPreferencesScreen';

// ─────────────────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();
const LearnStack = createStackNavigator();
const ProgressStack = createStackNavigator();
const ModesStack = createStackNavigator();
const CommunityStack = createStackNavigator();
const ProfileStack = createStackNavigator();

/** Shared headerless stack options */
const noHeader = { headerShown: false } as const;

// ── Learn Stack ───────────────────────────────────────────────────────────────
function LearnStackScreen() {
  return (
    <LearnStack.Navigator screenOptions={noHeader}>
      <LearnStack.Screen name="Dashboard" component={DashboardScreen} />
      <LearnStack.Screen name="Subjects" component={SubjectsScreen} options={{ headerShown: true, title: 'Choose Subject' }} />
      <LearnStack.Screen name="Topics" component={TopicsScreen} options={{ headerShown: true, title: 'Choose Topic' }} />
      <LearnStack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: true, title: 'Quiz', headerBackTitle: 'Back' }} />
      <LearnStack.Screen name="Credits" component={CreditsScreen} options={{ headerShown: true, title: 'Buy Credits' }} />
      <LearnStack.Screen name="ScienceNotes" component={ScienceNotesScreen} options={{ headerShown: true, title: 'Notes' }} />
      <LearnStack.Screen name="ComputerScienceNotes" component={ComputerScienceNotesScreen} options={{ headerShown: true, title: 'CS Notes' }} />
      <LearnStack.Screen name="TopicNotesDetail" component={TopicNotesDetailScreen} options={{ headerShown: true, title: 'Notes' }} />
      <LearnStack.Screen name="MathNotesDetail" component={MathNotesDetailScreen} options={{ headerShown: true, title: 'Math Notes' }} />
      <LearnStack.Screen name="GraphPractice" component={GraphPracticeScreen} options={{ headerShown: true, title: 'Graph Practice' }} />
      <LearnStack.Screen name="EnglishComprehension" component={EnglishComprehensionScreen} options={{ headerShown: true, title: 'Comprehension' }} />
      <LearnStack.Screen name="EnglishEssay" component={EnglishEssayScreen} options={{ headerShown: true, title: 'Essay Writing' }} />
      <LearnStack.Screen name="HistoryEssay" component={HistoryEssayScreen} options={{ headerShown: true, title: 'History Essay' }} />
      <LearnStack.Screen name="CombinedScienceExam" component={CombinedScienceExamScreen} options={{ headerShown: true, title: 'Combined Science Exam' }} />
      <LearnStack.Screen name="ExamSetup" component={ExamSetupScreen} />
      <LearnStack.Screen name="ExamSession" component={ExamSessionScreen} options={{ gestureEnabled: false }} />
      <LearnStack.Screen name="ExamResults" component={ExamResultsScreen} options={{ gestureEnabled: false }} />
      <LearnStack.Screen name="ExamReview" component={ExamReviewScreen} />
      <LearnStack.Screen name="ALevelPhysics" component={ALevelPhysicsScreen} options={{ headerShown: true, title: 'A Level Physics' }} />
      <LearnStack.Screen name="ALevelPhysicsNotes" component={ALevelPhysicsNotesScreen} options={{ headerShown: true, title: 'Physics Notes' }} />
      <LearnStack.Screen name="ALevelChemistry" component={ALevelChemistryScreen} options={{ headerShown: true, title: 'A Level Chemistry' }} />
      <LearnStack.Screen name="ALevelChemistryNotes" component={ALevelChemistryNotesScreen} options={{ headerShown: true, title: 'Chemistry Notes' }} />
      <LearnStack.Screen name="ALevelPureMath" component={ALevelPureMathScreen} options={{ headerShown: true, title: 'A Level Pure Math' }} />
      <LearnStack.Screen name="ALevelPureMathNotes" component={ALevelPureMathNotesScreen} options={{ headerShown: true, title: 'Pure Math Notes' }} />
      <LearnStack.Screen name="ALevelBiology" component={ALevelBiologyScreen} options={{ headerShown: true, title: 'A Level Biology' }} />
      <LearnStack.Screen name="ALevelBiologyNotes" component={ALevelBiologyNotesScreen} options={{ headerShown: true, title: 'Biology Notes' }} />
      <LearnStack.Screen name="GeographyNotes" component={GeographyNotesScreen} options={{ headerShown: true, title: 'Geography Notes' }} />
      <LearnStack.Screen name="AccountingNotes" component={AccountingNotesScreen} options={{ headerShown: true, title: 'Accounting Notes' }} />
      <LearnStack.Screen name="CommerceNotes" component={CommerceNotesScreen} options={{ headerShown: true, title: 'Commerce Notes' }} />
      <LearnStack.Screen name="BESNotes" component={BusinessEnterpriseSkillsNotesScreen} options={{ headerShown: true, title: 'BES Notes' }} />
      <LearnStack.Screen name="HistoryNotes" component={HistoryNotesScreen} options={{ headerShown: true, title: 'History Notes' }} />
    </LearnStack.Navigator>
  );
}

// ── Progress Stack ────────────────────────────────────────────────────────────
function ProgressStackScreen() {
  return (
    <ProgressStack.Navigator screenOptions={noHeader}>
      <ProgressStack.Screen name="Progress" component={ProgressScreen} />
      <ProgressStack.Screen name="AIInsights" component={AIInsightsScreen} />
    </ProgressStack.Navigator>
  );
}

// ── Modes Stack ───────────────────────────────────────────────────────────────
function ModesStackScreen() {
  return (
    <ModesStack.Navigator screenOptions={noHeader}>
      <ModesStack.Screen name="VirtualLab" component={VirtualLabScreen} />
      <ModesStack.Screen name="TeacherModeSetup" component={TeacherModeSetupScreen} />
      <ModesStack.Screen name="TeacherMode" component={TeacherModeScreen} />
      <ModesStack.Screen name="TeacherHistory" component={TeacherHistoryScreen} />
      <ModesStack.Screen name="ProjectList" component={ProjectListScreen} />
      <ModesStack.Screen name="ProjectAssistantSetup" component={ProjectAssistantSetupScreen} />
      <ModesStack.Screen name="ProjectAssistant" component={ProjectAssistantScreen} />
      <ModesStack.Screen name="MathSolver" component={MathSolverScreen} />
      <ModesStack.Screen name="FormulaSheet" component={FormulaSheetScreen} />
      <ModesStack.Screen name="PastPapers" component={PastPaperScreen} />
      <ModesStack.Screen name="OfflineSettings" component={OfflineSettingsScreen} />
      <ModesStack.Screen name="ModelDownload" component={ModelDownloadScreen} />
      <ModesStack.Screen name="OfflineChat" component={OfflineChatScreen} />
      <ModesStack.Screen name="NerdXLiveMode" component={NerdXLiveModeScreen} />
      <ModesStack.Screen name="NerdXLiveAudio" component={NerdXLiveAudioScreen} />
      <ModesStack.Screen name="NerdXLiveVideo" component={NerdXLiveVideoScreen} />
      {/* Virtual Lab Simulations */}
      <ModesStack.Screen name="CellExplorer" component={CellExplorerScreen} />
      <ModesStack.Screen name="Osmosis" component={OsmosisScreen} />
      <ModesStack.Screen name="AtomBuilder" component={AtomBuilderScreen} />
      <ModesStack.Screen name="EquationBalancer" component={EquationBalancerScreen} />
      <ModesStack.Screen name="CircuitBuilder" component={CircuitBuilderScreen} />
      <ModesStack.Screen name="ProjectileMotion" component={ProjectileMotionScreen} />
      <ModesStack.Screen name="FoodTestLab" component={FoodTestLabScreen} />
      <ModesStack.Screen name="PhotosynthesisReactor" component={PhotosynthesisReactorScreen} />
      <ModesStack.Screen name="EnzymeActionLab" component={EnzymeActionLabScreen} />
      <ModesStack.Screen name="TranspirationTracker" component={TranspirationTrackerScreen} />
      <ModesStack.Screen name="HeartPump" component={HeartPumpScreen} />
      <ModesStack.Screen name="TitrationMaster" component={TitrationMasterScreen} />
      <ModesStack.Screen name="pHScaleExplorer" component={PHScaleExplorerScreen} />
      <ModesStack.Screen name="ElectrolysisSimulator" component={ElectrolysisSimulatorScreen} />
      <ModesStack.Screen name="MotionGrapher" component={MotionGrapherScreen} />
      <ModesStack.Screen name="NewtonsLawsLab" component={NewtonsLawsLabScreen} />
      <ModesStack.Screen name="ThermalExpansion" component={ThermalExpansionScreen} />
      <ModesStack.Screen name="WaveProperties" component={WavePropertiesScreen} />
      <ModesStack.Screen name="VirtualLabTemplate" component={VirtualLabTemplateScreen} />
      <ModesStack.Screen name="VirtualLabInteractive" component={VirtualLabInteractiveScreen} />
      <ModesStack.Screen name="MapWorkLab" component={MapWorkLabScreen} />
      <ModesStack.Screen name="SixFigureGridLab" component={SixFigureGridLabScreen} />
      <ModesStack.Screen name="CompassBearingLab" component={CompassBearingLabScreen} />
      <ModesStack.Screen name="ContourLinesLab" component={ContourLinesLabScreen} />
      <ModesStack.Screen name="ScaleDistanceLab" component={ScaleDistanceLabScreen} />
      <ModesStack.Screen name="CrossSectionLab" component={CrossSectionLabScreen} />
      <ModesStack.Screen name="MapLayersLab" component={MapLayersLabScreen} />
      <ModesStack.Screen name="GeoMapsLab" component={GeoMapsLabScreen} />
      <ModesStack.Screen name="DifferentiationLab" component={DifferentiationLabScreen} />
      <ModesStack.Screen name="IntegrationLab" component={IntegrationLabScreen} />
      <ModesStack.Screen name="QuadraticExplorer" component={QuadraticExplorerScreen} />
      <ModesStack.Screen name="ComplexNumbersLab" component={ComplexNumbersLabScreen} />
      <ModesStack.Screen name="TrigFunctionsLab" component={TrigFunctionsLabScreen} />
      <ModesStack.Screen name="VectorVisualizer" component={VectorVisualizerScreen} />
      <ModesStack.Screen name="MatrixSandbox" component={MatrixSandboxScreen} />
      <ModesStack.Screen name="LinearProgrammingLab" component={LinearProgrammingLabScreen} />
      <ModesStack.Screen name="MarketNegotiation" component={MarketNegotiationScreen} />
      <ModesStack.Screen name="JobInterview" component={JobInterviewScreen} />
      <ModesStack.Screen name="UniversityCampusLife" component={UniversityCampusLifeScreen} />
      <ModesStack.Screen name="MedicalConsultation" component={MedicalConsultationScreen} />
      <ModesStack.Screen name="InternationalTravel" component={InternationalTravelScreen} />
      <ModesStack.Screen name="SocialGatherings" component={SocialGatheringsScreen} />
      <ModesStack.Screen name="BankingServices" component={BankingServicesScreen} />
      <ModesStack.Screen name="ProbabilitySimulator" component={ProbabilitySimulatorScreen} />
      <ModesStack.Screen name="StatisticsExplorer" component={StatisticsExplorerScreen} />
      <ModesStack.Screen name="LogarithmsLab" component={LogarithmsLabScreen} />
      <ModesStack.Screen name="SequencesSeriesLab" component={SequencesSeriesLabScreen} />
      <ModesStack.Screen name="SimultaneousEquationsLab" component={SimultaneousEquationsLabScreen} />
      <ModesStack.Screen name="RatioProportionLab" component={RatioProportionLabScreen} />
      <ModesStack.Screen name="IndicesStandardFormLab" component={IndicesStandardFormLabScreen} />
      <ModesStack.Screen name="BoundsAccuracyLab" component={BoundsAccuracyLabScreen} />
      <ModesStack.Screen name="LinearGraphsLab" component={LinearGraphsLabScreen} />
      <ModesStack.Screen name="InequalitiesRegionLab" component={InequalitiesRegionLabScreen} />
      <ModesStack.Screen name="AngleRulesLab" component={AngleRulesLabScreen} />
      <ModesStack.Screen name="SimilarityScaleLab" component={SimilarityScaleLabScreen} />
      <ModesStack.Screen name="MensurationLab" component={MensurationLabScreen} />
      <ModesStack.Screen name="PythagorasTrigLab" component={PythagorasTrigLabScreen} />
      <ModesStack.Screen name="TransformationsLab" component={TransformationsLabScreen} />
      <ModesStack.Screen name="BalanceSheetLab" component={BalanceSheetLabScreen} />
      <ModesStack.Screen name="IncomeStatementLab" component={IncomeStatementLabScreen} />
      <ModesStack.Screen name="PartnershipAppropriationLab" component={PartnershipAppropriationLabScreen} />
      <ModesStack.Screen name="CashFlowStatementLab" component={CashFlowStatementLabScreen} />
      <ModesStack.Screen name="ManufacturingAccountLab" component={ManufacturingAccountLabScreen} />
      <ModesStack.Screen name="CorrectionOfErrorsLab" component={CorrectionOfErrorsLabScreen} />
      <ModesStack.Screen name="NotForProfitLab" component={NotForProfitLabScreen} />
      <ModesStack.Screen name="ProgrammingLabEditor" component={ProgrammingLabEditorScreen} />
      <ModesStack.Screen name="WebDesignLabEditor" component={WebDesignLabEditorScreen} />
      <ModesStack.Screen name="DatabaseLabEditor" component={DatabaseLabEditorScreen} />
      <ModesStack.Screen name="ProjectGatesLab" component={ProjectGatesLabScreen} />
    </ModesStack.Navigator>
  );
}

// ── Community Stack ───────────────────────────────────────────────────────────
function CommunityStackScreen() {
  return (
    <CommunityStack.Navigator screenOptions={noHeader}>
      <CommunityStack.Screen name="Notifications" component={NotificationsScreen} />
      <CommunityStack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
    </CommunityStack.Navigator>
  );
}

// ── Profile Stack ─────────────────────────────────────────────────────────────
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={noHeader}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Account" component={AccountScreen} />
      <ProfileStack.Screen name="Credits" component={CreditsScreen} />
      <ProfileStack.Screen name="ReferralHub" component={ReferralHubScreen} />
      <ProfileStack.Screen name="BillingHistory" component={BillingHistoryScreen} />
      <ProfileStack.Screen name="SecurityCenter" component={SecurityCenterScreen} />
      <ProfileStack.Screen name="LearningPreferences" component={LearningPreferencesScreen} />
    </ProfileStack.Navigator>
  );
}

// ── Main Tab Navigator ────────────────────────────────────────────────────────
export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <NerdXTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="LearnTab" component={LearnStackScreen} />
      <Tab.Screen name="ProgressTab" component={ProgressStackScreen} />
      <Tab.Screen name="ModesTab" component={ModesStackScreen} />
      <Tab.Screen name="CommunityTab" component={CommunityStackScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}
