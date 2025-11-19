// Graph Practice Screen Component - Enhanced with all bot features
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { graphApi, GraphData } from '../services/api/graphApi';
import { useAuth } from '../context/AuthContext';

type Mode = 'generate' | 'custom' | 'upload' | 'linear';

const GraphPracticeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [graphType, setGraphType] = useState('linear');
  const [mode, setMode] = useState<Mode>('generate');
  
  // Custom equation input
  const [customEquation, setCustomEquation] = useState('');
  
  // Linear programming inputs
  const [constraints, setConstraints] = useState<string[]>(['', '']);
  const [objective, setObjective] = useState('');
  const [imageSolution, setImageSolution] = useState<{ processed_text: string; solution: string; analysis?: string } | null>(null);

  const graphTypes = [
    { id: 'linear', name: 'Linear', icon: '📈' },
    { id: 'quadratic', name: 'Quadratic', icon: '📊' },
    { id: 'exponential', name: 'Exponential', icon: '📉' },
    { id: 'trigonometric', name: 'Trigonometric', icon: '🌊' },
  ];

  const creditCost = 3; // Graph practice cost

  const handleGenerate = async () => {
    if ((user?.credits || 0) < creditCost) {
      Alert.alert(
        'Insufficient Credits',
        `Graph Practice requires ${creditCost} credits. Please buy credits first.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      setShowSolution(false);
      setAnswer('');
      setImageSolution(null);
      const data = await graphApi.generateGraph(graphType);
      if (data) {
        setGraphData(data);
        if (user) {
          const newCredits = (user.credits || 0) - creditCost;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate graph');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGraph = async () => {
    if (!customEquation.trim()) {
      Alert.alert('Error', 'Please enter an equation');
      return;
    }

    if ((user?.credits || 0) < creditCost) {
      Alert.alert(
        'Insufficient Credits',
        `Graph Practice requires ${creditCost} credits. Please buy credits first.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      setShowSolution(false);
      setAnswer('');
      setImageSolution(null);
      const data = await graphApi.generateCustomGraph(customEquation.trim());
      if (data) {
        setGraphData(data);
        if (user) {
          const newCredits = (user.credits || 0) - creditCost;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate graph');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permission to upload images');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const imageUri = result.assets[0].uri;

      if ((user?.credits || 0) < creditCost) {
        Alert.alert(
          'Insufficient Credits',
          `Image solving requires ${creditCost} credits. Please buy credits first.`,
          [{ text: 'OK' }]
        );
        return;
      }

      setLoading(true);
      setGraphData(null);
      setImageSolution(null);
      
      const solution = await graphApi.solveGraphFromImage(imageUri);
      if (solution) {
        setImageSolution(solution);
        if (user) {
          const newCredits = (user.credits || 0) - creditCost;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleLinearProgramming = async () => {
    const validConstraints = constraints.filter(c => c.trim().length > 0);
    if (validConstraints.length < 2) {
      Alert.alert('Error', 'Please enter at least 2 constraints');
      return;
    }

    if ((user?.credits || 0) < creditCost) {
      Alert.alert(
        'Insufficient Credits',
        `Linear Programming requires ${creditCost} credits. Please buy credits first.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      setShowSolution(false);
      setAnswer('');
      setImageSolution(null);
      const data = await graphApi.generateLinearProgrammingGraph(
        validConstraints,
        objective.trim() || undefined
      );
      if (data) {
        setGraphData(data);
        if (user) {
          const newCredits = (user.credits || 0) - creditCost;
          updateUser({ credits: newCredits });
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to generate graph');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      Alert.alert('Error', 'Please enter your answer');
      return;
    }
    setShowSolution(true);
  };

  const resetView = () => {
    setGraphData(null);
    setAnswer('');
    setShowSolution(false);
    setImageSolution(null);
    setCustomEquation('');
    setConstraints(['', '']);
    setObjective('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Graph Practice</Text>
        <Text style={styles.subtitle}>Practice reading and analyzing graphs</Text>
        <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
      </View>

      {/* Mode Selection */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'generate' && styles.modeButtonActive]}
          onPress={() => { setMode('generate'); resetView(); }}
        >
          <Text style={[styles.modeButtonText, mode === 'generate' && styles.modeButtonTextActive]}>
            📈 Generate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'custom' && styles.modeButtonActive]}
          onPress={() => { setMode('custom'); resetView(); }}
        >
          <Text style={[styles.modeButtonText, mode === 'custom' && styles.modeButtonTextActive]}>
            ✏️ Custom
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'upload' && styles.modeButtonActive]}
          onPress={() => { setMode('upload'); resetView(); }}
        >
          <Text style={[styles.modeButtonText, mode === 'upload' && styles.modeButtonTextActive]}>
            📷 Upload
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'linear' && styles.modeButtonActive]}
          onPress={() => { setMode('linear'); resetView(); }}
        >
          <Text style={[styles.modeButtonText, mode === 'linear' && styles.modeButtonTextActive]}>
            ⭐ Linear Prog
          </Text>
        </TouchableOpacity>
      </View>

      {/* Generate Mode */}
      {mode === 'generate' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Graph Type</Text>
          <View style={styles.graphTypesContainer}>
            {graphTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.graphTypeButton,
                  graphType === type.id && styles.graphTypeButtonSelected,
                ]}
                onPress={() => setGraphType(type.id)}
              >
                <Text style={styles.graphTypeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.graphTypeText,
                    graphType === type.id && styles.graphTypeTextSelected,
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Graph ({creditCost} credits)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Custom Equation Mode */}
      {mode === 'custom' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Custom Equation</Text>
          <Text style={styles.hintText}>
            Examples: y = 2x + 3, y = x^2, y = sin(x), y = 2^x
          </Text>
          <TextInput
            style={styles.equationInput}
            value={customEquation}
            onChangeText={setCustomEquation}
            placeholder="e.g., y = 2x + 3"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleCustomGraph}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Graph ({creditCost} credits)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Image Upload Mode */}
      {mode === 'upload' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Graph Image</Text>
          <Text style={styles.hintText}>
            Upload an image of a graph problem to get AI-powered solution
          </Text>
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleImageUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Select Image ({creditCost} credits)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Linear Programming Mode */}
      {mode === 'linear' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linear Programming</Text>
          <Text style={styles.hintText}>
            Enter constraints (e.g., "2x + 3y ≤ 12", "x + y ≤ 8")
          </Text>
          
          {constraints.map((constraint, index) => (
            <TextInput
              key={index}
              style={styles.constraintInput}
              value={constraint}
              onChangeText={(text) => {
                const newConstraints = [...constraints];
                newConstraints[index] = text;
                setConstraints(newConstraints);
              }}
              placeholder={`Constraint ${index + 1} (e.g., 2x + 3y ≤ 12)`}
              autoCapitalize="none"
            />
          ))}
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setConstraints([...constraints, ''])}
          >
            <Text style={styles.addButtonText}>+ Add Constraint</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Objective Function (Optional)</Text>
          <TextInput
            style={styles.equationInput}
            value={objective}
            onChangeText={setObjective}
            placeholder="e.g., maximize 3x + 2y"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleLinearProgramming}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Graph ({creditCost} credits)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Graph Display */}
      {graphData && (
        <View style={styles.graphSection}>
          {graphData.graph_url && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: graphData.graph_url }}
                style={styles.graphImage}
                resizeMode="contain"
                onError={(error) => {
                  console.warn('Failed to load graph image:', error.nativeEvent.error);
                }}
              />
            </View>
          )}

          <View style={styles.questionContainer}>
            <Text style={styles.questionLabel}>Equation:</Text>
            <Text style={styles.equation}>{graphData.equation}</Text>

            {graphData.constraints && graphData.constraints.length > 0 && (
              <>
                <Text style={styles.questionLabel}>Constraints:</Text>
                {graphData.constraints.map((c, i) => (
                  <Text key={i} style={styles.equation}>{c}</Text>
                ))}
              </>
            )}

            {graphData.corner_points && graphData.corner_points.length > 0 && (
              <>
                <Text style={styles.questionLabel}>Corner Points:</Text>
                <Text style={styles.equation}>
                  {graphData.corner_points.map((p, i) => `(${p[0]}, ${p[1]})`).join(', ')}
                </Text>
              </>
            )}

            <Text style={styles.questionLabel}>Question:</Text>
            <Text style={styles.question}>{graphData.question}</Text>

            {!showSolution && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>Your Answer:</Text>
                <TextInput
                  style={styles.answerInput}
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Enter your answer..."
                  multiline
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitAnswer}
                >
                  <Text style={styles.submitButtonText}>Submit Answer</Text>
                </TouchableOpacity>
              </View>
            )}

            {showSolution && (
              <View style={styles.solutionContainer}>
                <Text style={styles.solutionLabel}>Solution:</Text>
                <Text style={styles.solution}>{graphData.solution}</Text>
                <TouchableOpacity
                  style={styles.newGraphButton}
                  onPress={resetView}
                >
                  <Text style={styles.newGraphButtonText}>Generate New Graph</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Image Solution Display */}
      {imageSolution && (
        <View style={styles.graphSection}>
          <View style={styles.solutionContainer}>
            <Text style={styles.solutionLabel}>Processed Text:</Text>
            <Text style={styles.solution}>{imageSolution.processed_text}</Text>
            
            <Text style={[styles.solutionLabel, { marginTop: 15 }]}>Solution:</Text>
            <Text style={styles.solution}>{imageSolution.solution}</Text>
            
            {imageSolution.analysis && (
              <>
                <Text style={[styles.solutionLabel, { marginTop: 15 }]}>Analysis:</Text>
                <Text style={styles.solution}>{imageSolution.analysis}</Text>
              </>
            )}
            
            <TouchableOpacity
              style={styles.newGraphButton}
              onPress={resetView}
            >
              <Text style={styles.newGraphButtonText}>Try Another Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 5,
  },
  credits: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  modeContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: '#FFFFFF',
  },
  modeButtonActive: {
    backgroundColor: '#2196F3',
  },
  modeButtonText: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  graphTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  graphTypeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  graphTypeButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  graphTypeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  graphTypeText: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  graphTypeTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
  equationInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  constraintInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  generateButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  graphSection: {
    padding: 20,
  },
  imageContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  graphImage: {
    width: '100%',
    height: 300,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginTop: 10,
    marginBottom: 5,
  },
  equation: {
    fontSize: 18,
    fontFamily: 'monospace',
    color: '#1976D2',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  question: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
    marginBottom: 20,
  },
  answerContainer: {
    marginTop: 20,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 10,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  solutionContainer: {
    marginTop: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
  },
  solutionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  solution: {
    fontSize: 16,
    color: '#212121',
    lineHeight: 24,
    marginBottom: 15,
  },
  newGraphButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  newGraphButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GraphPracticeScreen;
