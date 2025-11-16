// Graph Practice Screen Component
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
import { useNavigation } from '@react-navigation/native';
import { graphApi, GraphData } from '../services/api/graphApi';
import { useAuth } from '../context/AuthContext';

const GraphPracticeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [graphType, setGraphType] = useState('linear');

  const graphTypes = [
    { id: 'linear', name: 'Linear', icon: '📈' },
    { id: 'quadratic', name: 'Quadratic', icon: '📊' },
    { id: 'exponential', name: 'Exponential', icon: '📉' },
    { id: 'trigonometric', name: 'Trigonometric', icon: '🌊' },
  ];

  const handleGenerate = async () => {
    if ((user?.credits || 0) < 3) {
      Alert.alert(
        'Insufficient Credits',
        'Graph Practice requires 3 credits. Please buy credits first.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      setShowSolution(false);
      setAnswer('');
      const data = await graphApi.generateGraph(graphType);
      if (data) {
        setGraphData(data);
        // Update credits
        if (user) {
          const newCredits = (user.credits || 0) - 3;
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Graph Practice</Text>
        <Text style={styles.subtitle}>Practice reading and analyzing graphs</Text>
        <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
      </View>

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
            <Text style={styles.generateButtonText}>Generate Graph (3 credits)</Text>
          )}
        </TouchableOpacity>
      </View>

      {graphData && (
        <View style={styles.graphSection}>
          {graphData.graph_url && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: graphData.graph_url }}
                style={styles.graphImage}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.questionContainer}>
            <Text style={styles.questionLabel}>Equation:</Text>
            <Text style={styles.equation}>{graphData.equation}</Text>

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
                  onPress={() => {
                    setGraphData(null);
                    setAnswer('');
                    setShowSolution(false);
                  }}
                >
                  <Text style={styles.newGraphButtonText}>Generate New Graph</Text>
                </TouchableOpacity>
              </View>
            )}
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
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 15,
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
