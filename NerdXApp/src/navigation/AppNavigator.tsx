// Main App Navigator
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SubjectsScreen from '../screens/SubjectsScreen';
import TopicsScreen from '../screens/TopicsScreen';
import QuizScreen from '../screens/QuizScreen';
import CreditsScreen from '../screens/CreditsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TeacherModeSetupScreen from '../screens/TeacherModeSetupScreen';
import TeacherModeScreen from '../screens/TeacherModeScreen';
import ProjectAssistantSetupScreen from '../screens/ProjectAssistantSetupScreen';
import ProjectAssistantScreen from '../screens/ProjectAssistantScreen';
import ProjectListScreen from '../screens/ProjectListScreen';
import GraphPracticeScreen from '../screens/GraphPracticeScreen';
import EnglishComprehensionScreen from '../screens/EnglishComprehensionScreen';
import EnglishEssayScreen from '../screens/EnglishEssayScreen';
import CombinedScienceExamScreen from '../screens/CombinedScienceExamScreen';
import VirtualLabScreen from '../screens/VirtualLabScreen';
import FormulaSheetScreen from '../screens/FormulaSheetScreen';
import PastPaperScreen from '../screens/PastPaperScreen';
import ScienceNotesScreen from '../screens/ScienceNotesScreen';
import TopicNotesDetailScreen from '../screens/TopicNotesDetailScreen';
import MathSolverScreen from '../screens/MathSolverScreen';
import OfflineSettingsScreen from '../screens/OfflineSettingsScreen';
import ModelDownloadScreen from '../screens/ModelDownloadScreen';
import MathNotesDetailScreen from '../screens/MathNotesDetailScreen';
import ALevelPhysicsScreen from '../screens/ALevelPhysicsScreen';
import ALevelPhysicsNotesScreen from '../screens/ALevelPhysicsNotesScreen';
import ALevelChemistryScreen from '../screens/ALevelChemistryScreen';
import ALevelChemistryNotesScreen from '../screens/ALevelChemistryNotesScreen';
import ALevelPureMathScreen from '../screens/ALevelPureMathScreen';
import ALevelPureMathNotesScreen from '../screens/ALevelPureMathNotesScreen';
import ALevelBiologyScreen from '../screens/ALevelBiologyScreen';
import ALevelBiologyNotesScreen from '../screens/ALevelBiologyNotesScreen';

// Virtual Lab Simulation Screens
import CellExplorerScreen from '../screens/virtualLab/CellExplorerScreen';
import OsmosisScreen from '../screens/virtualLab/OsmosisScreen';
import AtomBuilderScreen from '../screens/virtualLab/AtomBuilderScreen';
import EquationBalancerScreen from '../screens/virtualLab/EquationBalancerScreen';
import CircuitBuilderScreen from '../screens/virtualLab/CircuitBuilderScreen';
import ProjectileMotionScreen from '../screens/virtualLab/ProjectileMotionScreen';
// Phase 2 - Biology
import FoodTestLabScreen from '../screens/virtualLab/FoodTestLabScreen';
import PhotosynthesisReactorScreen from '../screens/virtualLab/PhotosynthesisReactorScreen';
import EnzymeActionLabScreen from '../screens/virtualLab/EnzymeActionLabScreen';
import TranspirationTrackerScreen from '../screens/virtualLab/TranspirationTrackerScreen';
import HeartPumpScreen from '../screens/virtualLab/HeartPumpScreen';
// Phase 2 - Chemistry
import TitrationMasterScreen from '../screens/virtualLab/TitrationMasterScreen';
import PHScaleExplorerScreen from '../screens/virtualLab/pHScaleExplorerScreen';
import ElectrolysisSimulatorScreen from '../screens/virtualLab/ElectrolysisSimulatorScreen';
// Phase 2 - Physics
import MotionGrapherScreen from '../screens/virtualLab/MotionGrapherScreen';
import NewtonsLawsLabScreen from '../screens/virtualLab/NewtonsLawsLabScreen';
import ThermalExpansionScreen from '../screens/virtualLab/ThermalExpansionScreen';
import WavePropertiesScreen from '../screens/virtualLab/WavePropertiesScreen';
import VirtualLabTemplateScreen from '../screens/virtualLab/VirtualLabTemplateScreen';
import VirtualLabInteractiveScreen from '../screens/virtualLab/VirtualLabInteractiveScreen';

const Stack = createStackNavigator();

const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#1976D2" />
    <Text style={styles.loadingText}>Loading NerdX...</Text>
  </View>
);

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1976D2',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: 'Create Account',
                headerStyle: { backgroundColor: '#1976D2' },
                headerTintColor: '#FFFFFF',
              }}
            />
          </Stack.Group>
        ) : (
          // Main App Stack
          <Stack.Group>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Subjects"
              component={SubjectsScreen}
              options={{
                title: 'Choose Subject',
              }}
            />
            <Stack.Screen
              name="Topics"
              component={TopicsScreen}
              options={{
                title: 'Choose Topic',
              }}
            />
            <Stack.Screen
              name="Quiz"
              component={QuizScreen}
              options={{
                title: 'Quiz',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="Credits"
              component={CreditsScreen}
              options={{
                title: 'Buy Credits',
              }}
            />
            <Stack.Screen
              name="Progress"
              component={ProgressScreen}
              options={{
                title: 'Your Progress',
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="TeacherModeSetup"
              component={TeacherModeSetupScreen}
              options={{
                title: 'Teacher Mode Setup',
              }}
            />
            <Stack.Screen
              name="TeacherMode"
              component={TeacherModeScreen}
              options={{
                title: 'Teacher Mode',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="ProjectAssistantSetup"
              component={ProjectAssistantSetupScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ProjectAssistant"
              component={ProjectAssistantScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ProjectList"
              component={ProjectListScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="GraphPractice"
              component={GraphPracticeScreen}
              options={{
                title: 'Graph Practice',
              }}
            />
            <Stack.Screen
              name="EnglishComprehension"
              component={EnglishComprehensionScreen}
              options={{
                title: 'Comprehension',
              }}
            />
            <Stack.Screen
              name="EnglishEssay"
              component={EnglishEssayScreen}
              options={{
                title: 'Essay Writing',
              }}
            />
            <Stack.Screen
              name="CombinedScienceExam"
              component={CombinedScienceExamScreen}
              options={{
                title: 'Combined Science Exam',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="VirtualLab"
              component={VirtualLabScreen}
              options={{
                headerShown: false,
              }}
            />
            {/* Virtual Lab Simulation Screens */}
            <Stack.Screen
              name="CellExplorer"
              component={CellExplorerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Osmosis"
              component={OsmosisScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AtomBuilder"
              component={AtomBuilderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EquationBalancer"
              component={EquationBalancerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CircuitBuilder"
              component={CircuitBuilderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProjectileMotion"
              component={ProjectileMotionScreen}
              options={{ headerShown: false }}
            />
            {/* Phase 2 Virtual Lab Screens */}
            <Stack.Screen
              name="FoodTestLab"
              component={FoodTestLabScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="pHScaleExplorer"
              component={PHScaleExplorerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WaveProperties"
              component={WavePropertiesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ThermalExpansion"
              component={ThermalExpansionScreen}
              options={{ headerShown: false }}
            />
            {/* Additional Phase 2 Screens */}
            <Stack.Screen
              name="PhotosynthesisReactor"
              component={PhotosynthesisReactorScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EnzymeActionLab"
              component={EnzymeActionLabScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TranspirationTracker"
              component={TranspirationTrackerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HeartPump"
              component={HeartPumpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TitrationMaster"
              component={TitrationMasterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ElectrolysisSimulator"
              component={ElectrolysisSimulatorScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MotionGrapher"
              component={MotionGrapherScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NewtonsLawsLab"
              component={NewtonsLawsLabScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VirtualLabTemplate"
              component={VirtualLabTemplateScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VirtualLabInteractive"
              component={VirtualLabInteractiveScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FormulaSheet"
              component={FormulaSheetScreen}
              options={{
                title: 'Formula Sheet',
              }}
            />
            <Stack.Screen
              name="PastPaper"
              component={PastPaperScreen}
              options={{
                title: 'Past Papers',
              }}
            />
            <Stack.Screen
              name="ScienceNotes"
              component={ScienceNotesScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="TopicNotesDetail"
              component={TopicNotesDetailScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MathSolver"
              component={MathSolverScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MathNotesDetail"
              component={MathNotesDetailScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OfflineSettings"
              component={OfflineSettingsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ModelDownload"
              component={ModelDownloadScreen}
              options={{
                headerShown: false,
              }}
            />
            {/* A Level Physics Screens */}
            <Stack.Screen
              name="ALevelPhysics"
              component={ALevelPhysicsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ALevelPhysicsNotes"
              component={ALevelPhysicsNotesScreen}
              options={{
                headerShown: false,
              }}
            />
            {/* A Level Chemistry Screens */}
            <Stack.Screen
              name="ALevelChemistry"
              component={ALevelChemistryScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ALevelChemistryNotes"
              component={ALevelChemistryNotesScreen}
              options={{
                headerShown: false,
              }}
            />
            {/* A Level Pure Mathematics Screens */}
            <Stack.Screen
              name="ALevelPureMath"
              component={ALevelPureMathScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ALevelPureMathNotes"
              component={ALevelPureMathNotesScreen}
              options={{
                headerShown: false,
              }}
            />
            {/* A Level Biology Screens */}
            <Stack.Screen
              name="ALevelBiology"
              component={ALevelBiologyScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ALevelBiologyNotes"
              component={ALevelBiologyNotesScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
});

export default AppNavigator;
