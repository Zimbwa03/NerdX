// Graph Practice Screen Component - Enhanced with all bot features
import React, { useState, useRef } from 'react';
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
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import { graphApi, GraphData } from '../services/api/graphApi';
import { API_BASE_URL } from '../services/api/config';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import { Colors } from '../theme/colors';
import VoiceMathInput from '../components/VoiceMathInput';
import ZoomableImageModal from '../components/ZoomableImageModal';
import MathRenderer from '../components/MathRenderer';
import { formatQuestionParts } from '../utils/formatQuestionText';

type Mode = 'generate' | 'custom' | 'upload' | 'linear';
type GraphLevel = 'o_level' | 'a_level';

const GraphPracticeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [graphType, setGraphType] = useState('linear');
  const [mode, setMode] = useState<Mode>('generate');
  const [level, setLevel] = useState<GraphLevel>('o_level');

  // Answer images (upload/capture) for Vertex AI analysis
  const [answerImages, setAnswerImages] = useState<string[]>([]);
  const [analyzingImages, setAnalyzingImages] = useState(false);

  // Custom equation input
  const [customEquation, setCustomEquation] = useState('');

  // Linear programming inputs
  const [constraints, setConstraints] = useState<string[]>(['', '']);
  const [objective, setObjective] = useState('');
  const [imageSolution, setImageSolution] = useState<{ processed_text: string; solution: string; analysis?: string } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [savingVideo, setSavingVideo] = useState(false);
  const [cachedVideoUrl, setCachedVideoUrl] = useState<string | null>(null);

  // Zoom Modal State
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Create video player - initialize with empty source, will be updated when URL is available
  const videoPlayer = useVideoPlayer('', (player) => {
    player.loop = true;
  });

  // Update video player source when videoUrl or cachedVideoUrl changes
  React.useEffect(() => {
    const videoSource = cachedVideoUrl || videoUrl;
    if (videoSource) {
      console.log('🎥 Updating video player with source:', videoSource);
      // Use replaceAsync to update the player source
      videoPlayer.replaceAsync({
        uri: videoSource,
        contentType: 'progressive',
      }).then(() => {
        // Small delay before playing to allow video to buffer
        setTimeout(() => {
          try {
            videoPlayer.play();
          } catch (e) {
            console.warn('Video play failed:', e);
          }
        }, 500);
      }).catch((err) => {
        console.error('Failed to replace video source:', err);
      });
    }
  }, [videoUrl, cachedVideoUrl, videoPlayer]);

  // Track video player status for error handling
  const { isPlaying } = useEvent(videoPlayer, 'playingChange', { isPlaying: videoPlayer.playing });
  const { status } = useEvent(videoPlayer, 'statusChange', { status: videoPlayer.status });

  // Handle video player errors - only trigger once per video URL
  const [errorShown, setErrorShown] = React.useState(false);
  React.useEffect(() => {
    if (status === 'error' && videoUrl && !errorShown) {
      console.warn('Video player error detected for:', videoUrl);
      setVideoError('Animation failed to load. The Manim server may not be available.');
      setErrorShown(true);
    } else if (status === 'readyToPlay') {
      // Clear error if video becomes ready
      setVideoError(null);
      setErrorShown(false);
    }
  }, [status, videoUrl, errorShown]);

  const graphTypes = [
    { id: 'linear', name: 'Linear', icon: '📈' },
    { id: 'quadratic', name: 'Quadratic', icon: '📊' },
    { id: 'exponential', name: 'Exponential', icon: '📉' },
    { id: 'trigonometric', name: 'Trigonometric', icon: '🌊' },
    { id: 'statistics', name: 'Statistics', icon: '📋' },
  ];

  const graphCreditCost = 1; // Graph generation cost (1 credit per graph)
  const imageSolveCreditCost = 3; // Image solving cost (3 credits per image)

  const cacheVideoForPlayback = async (url: string): Promise<string | null> => {
    try {
      const filename = url.split('/').pop()?.split('?')[0] || `graph_animation_${Date.now()}.mp4`;
      const cacheBase = FileSystem.cacheDirectory || FileSystem.documentDirectory;
      if (!cacheBase) {
        return null;
      }
      const localUri = `${cacheBase}${filename}`;
      const existingFile = await FileSystem.getInfoAsync(localUri);
      if (!existingFile.exists) {
        const downloadResult = await FileSystem.downloadAsync(url, localUri);
        if (downloadResult.status !== 200) {
          return null;
        }
      }
      return localUri;
    } catch (error) {
      console.warn('Failed to cache video for playback:', error);
      return null;
    }
  };

  const handleGenerate = async () => {
    if ((user?.credits || 0) < graphCreditCost) {
      Alert.alert(
        'Insufficient Credits',
        `Graph Practice requires ${graphCreditCost} credit per graph. Please buy credits first.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      setShowSolution(false);
      setAnswer('');
      setImageSolution(null);
      setVideoUrl(null);
      setCachedVideoUrl(null);
      setVideoError(null);
      setVideoLoading(false);

      // Generate static graph (pass level for O-Level / A-Level question templates)
      const data = await graphApi.generateGraph(graphType, undefined, level);
      if (data) {
        setGraphData(data);
        // Update credits from server response
        if (user && data.credits_remaining !== undefined) {
          updateUser({ credits: data.credits_remaining });
        }
      }

      // Generate Animation (Manim) if supported
      // Use graph_spec as the single source of truth for consistency with graph and question
      const spec = data?.graph_spec;
      if (!spec) {
        console.warn('graph_spec missing from response, skipping animation');
      } else {
        const specType = spec.graph_type || graphType;
        const coeffs = spec.coefficients;
        const xRange = spec.x_range;
        const yRange = spec.y_range;
        const cleanExpression = spec.clean_expression || spec.equation;

        // Animate using the same deterministic graph_spec the server used for the Matplotlib image.
        // This ensures the video matches the graph exactly
        if (
          specType === 'quadratic' || 
          specType === 'linear' || 
          specType === 'trigonometric' || 
          specType === 'exponential' ||
          cleanExpression  // Try expression-based if we have an expression
        ) {
          try {
            setVideoLoading(true);
            let animResult = null;
            
            // Try coefficient-based animation first (more accurate for linear/quadratic)
            if (specType === 'quadratic' && coeffs && coeffs.a !== undefined) {
              const a = coeffs.a ?? 1;
              const b = coeffs.b ?? 0;
              const c = coeffs.c ?? 0;
              console.log(`Generating quadratic animation: a=${a}, b=${b}, c=${c}`, { xRange, yRange });
              animResult = await graphApi.generateQuadraticAnimation(a, b, c, xRange, yRange);
            } else if (specType === 'linear' && coeffs && coeffs.m !== undefined) {
              const m = coeffs.m ?? 1;
              const c = coeffs.c ?? 0;
              console.log(`Generating linear animation: m=${m}, c=${c}`, { xRange, yRange });
              animResult = await graphApi.generateLinearAnimation(m, c, xRange, yRange);
            } else if (cleanExpression) {
              // Trig/exponential/other uses expression-based animation
              // Use clean_expression (normalized) for best compatibility
              console.log(`Generating expression animation: ${cleanExpression}`, { xRange, yRange });
              animResult = await graphApi.generateExpressionAnimation(cleanExpression, xRange, yRange);
            }

            if (animResult && animResult.video_path) {
              // Construct full URL - backend returns "/static/..."
              const baseUrl = API_BASE_URL;
              const videoPath = animResult.video_path.startsWith('/')
                ? animResult.video_path
                : '/' + animResult.video_path;
              const fullVideoUrl = baseUrl + videoPath;

              // Validate the video URL with retry logic (server may still be writing file)
              const validateVideoUrl = async (url: string, retries: number = 2): Promise<boolean> => {
                for (let attempt = 0; attempt < retries; attempt++) {
                  try {
                    // Wait a bit before each attempt (let server finish writing)
                    if (attempt > 0) {
                      await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    const response = await fetch(url, { method: 'HEAD' });
                    if (response.ok) {
                      return true;
                    }
                    console.warn(`Video URL validation attempt ${attempt + 1}/${retries} failed:`, response.status);
                  } catch (e) {
                    console.warn(`Video URL fetch attempt ${attempt + 1}/${retries} error:`, e);
                  }
                }
                return false;
              };

              const isAccessible = await validateVideoUrl(fullVideoUrl);
              if (isAccessible) {
                // Reset error state and set URL
                setErrorShown(false);
                setVideoError(null);
                setVideoUrl(fullVideoUrl);
                const localUri = await cacheVideoForPlayback(fullVideoUrl);
                setCachedVideoUrl(localUri);
                console.log('Video loaded successfully:', fullVideoUrl);
              } else {
                console.warn('Video URL not accessible after retries');
                setVideoError('Animation video is not available. The server may still be generating it.');
              }
            } else {
              console.log('Animation not available for this graph type or missing parameters');
              // Don't show error for animation not available - it's optional
            }
            if (animResult && !animResult.video_path) {
              console.warn('Animation generation returned no video_path:', animResult);
              setVideoError('Animation generation completed but no video was returned.');
            }
          } catch (animError: any) {
            console.warn('Animation generation failed:', animError);
            setVideoError('Animation service is currently unavailable. Graph image is still available above.');
          } finally {
            setVideoLoading(false);
          }
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

    if ((user?.credits || 0) < graphCreditCost) {
      Alert.alert(
        'Insufficient Credits',
        `Graph Practice requires ${graphCreditCost} credit per graph. Please buy credits first.`,
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
        // Update credits from server response
        if (user && data.credits_remaining !== undefined) {
          updateUser({ credits: data.credits_remaining });
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

      if ((user?.credits || 0) < imageSolveCreditCost) {
        Alert.alert(
          'Insufficient Credits',
          `Image solving requires ${imageSolveCreditCost} credits. Please buy credits first.`,
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
        // Update credits from server response
        if (user && (solution as any).credits_remaining !== undefined) {
          updateUser({ credits: (solution as any).credits_remaining });
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

    if ((user?.credits || 0) < graphCreditCost) {
      Alert.alert(
        'Insufficient Credits',
        `Linear Programming requires ${graphCreditCost} credit per graph. Please buy credits first.`,
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
        // Update credits from server response
        if (user && data.credits_remaining !== undefined) {
          updateUser({ credits: data.credits_remaining });
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
    setAnswerImages([]);
    setCustomEquation('');
    setConstraints(['', '']);
    setObjective('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <View style={[styles.header, { backgroundColor: themedColors.primary.main }]}>
        <Text style={styles.title}>📊 Graph Practice</Text>
        <Text style={styles.subtitle}>Practice reading and analyzing graphs</Text>
        <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
        {/* O-Level / A-Level toggle */}
        <View style={styles.levelRow}>
          <TouchableOpacity
            style={[styles.levelButton, level === 'o_level' && styles.levelButtonActive]}
            onPress={() => setLevel('o_level')}
          >
            <Text style={[styles.levelButtonText, level === 'o_level' && styles.levelButtonTextActive]}>O-Level</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.levelButton, level === 'a_level' && styles.levelButtonActive]}
            onPress={() => setLevel('a_level')}
          >
            <Text style={[styles.levelButtonText, level === 'a_level' && styles.levelButtonTextActive]}>A-Level</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode Selection */}
      <View style={[styles.modeContainer, { backgroundColor: themedColors.background.paper, borderBottomColor: themedColors.border.light }]}>
        <TouchableOpacity
          style={[styles.modeButton, { backgroundColor: themedColors.background.paper }, mode === 'generate' && { backgroundColor: themedColors.primary.main }]}
          onPress={() => { setMode('generate'); resetView(); }}
        >
          <Text style={[styles.modeButtonText, { color: themedColors.text.primary }, mode === 'generate' && { color: '#FFFFFF', fontWeight: 'bold' }]}>
            📈 Generate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, { backgroundColor: themedColors.background.paper }, mode === 'custom' && { backgroundColor: themedColors.primary.main }]}
          onPress={() => { setMode('custom'); resetView(); }}
        >
          <Text style={[styles.modeButtonText, { color: themedColors.text.primary }, mode === 'custom' && { color: '#FFFFFF', fontWeight: 'bold' }]}>
            ✏️ Custom
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, { backgroundColor: themedColors.background.paper }, mode === 'upload' && { backgroundColor: themedColors.primary.main }]}
          onPress={() => { setMode('upload'); resetView(); }}
        >
          <Text style={[styles.modeButtonText, { color: themedColors.text.primary }, mode === 'upload' && { color: '#FFFFFF', fontWeight: 'bold' }]}>
            📷 Upload
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, { backgroundColor: themedColors.background.paper }, mode === 'linear' && { backgroundColor: themedColors.primary.main }]}
          onPress={() => { setMode('linear'); resetView(); }}
        >
          <Text style={[styles.modeButtonText, { color: themedColors.text.primary }, mode === 'linear' && { color: '#FFFFFF', fontWeight: 'bold' }]}>
            ⭐ Linear Prog
          </Text>
        </TouchableOpacity>
      </View>

      {/* Generate Mode */}
      {mode === 'generate' && (
        <View style={[styles.section, { borderBottomColor: themedColors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Select Graph Type</Text>
          <View style={styles.graphTypesContainer}>
            {graphTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.graphTypeButton,
                  { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F5F5', borderColor: themedColors.border.light },
                  graphType === type.id && { backgroundColor: isDarkMode ? 'rgba(0, 229, 255, 0.2)' : '#E3F2FD', borderColor: themedColors.primary.main },
                ]}
                onPress={() => setGraphType(type.id)}
              >
                <Text style={styles.graphTypeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.graphTypeText,
                    { color: themedColors.text.primary },
                    graphType === type.id && { color: themedColors.primary.main, fontWeight: '600' },
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: themedColors.primary.main }, loading && styles.generateButtonDisabled]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Graph ({graphCreditCost} credit)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Custom Equation Mode */}
      {mode === 'custom' && (
        <View style={[styles.section, { borderBottomColor: themedColors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Enter Custom Equation</Text>
          <Text style={[styles.hintText, { color: themedColors.text.secondary }]}>
            Examples: y = 2x + 3, y = x^2, y = sin(x), y = 2^x
          </Text>
          <View style={styles.inputWithVoice}>
            <TextInput
              style={[styles.equationInput, styles.inputFlex, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light, color: themedColors.text.primary }]}
              value={customEquation}
              onChangeText={setCustomEquation}
              placeholder="e.g., y = 2x + 3"
              placeholderTextColor={themedColors.text.hint}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <VoiceMathInput
              onTranscription={(text) => setCustomEquation(prev => prev ? `${prev} ${text}` : text)}
              disabled={loading}
            />
          </View>
          <Text style={[styles.voiceHintText, { color: themedColors.text.secondary }]}>
            🎤 Tap mic to speak equation (e.g., "y equals 2x squared plus 3")
          </Text>
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: themedColors.primary.main }, loading && styles.generateButtonDisabled]}
            onPress={handleCustomGraph}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Graph ({graphCreditCost} credit)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Image Upload Mode */}
      {mode === 'upload' && (
        <View style={[styles.section, { borderBottomColor: themedColors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Upload Graph Image</Text>
          <Text style={[styles.hintText, { color: themedColors.text.secondary }]}>
            Upload an image of a graph problem to get AI-powered solution
          </Text>
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: themedColors.primary.main }, loading && styles.generateButtonDisabled]}
            onPress={handleImageUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Select Image ({imageSolveCreditCost} credits)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Linear Programming Mode */}
      {mode === 'linear' && (
        <View style={[styles.section, { borderBottomColor: themedColors.border.light }]}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Linear Programming</Text>
          <Text style={[styles.hintText, { color: themedColors.text.secondary }]}>
            Enter constraints (e.g., "2x + 3y ≤ 12", "x + y ≤ 8")
          </Text>

          {constraints.map((constraint, index) => (
            <TextInput
              key={index}
              style={[styles.constraintInput, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light, color: themedColors.text.primary }]}
              value={constraint}
              onChangeText={(text) => {
                const newConstraints = [...constraints];
                newConstraints[index] = text;
                setConstraints(newConstraints);
              }}
              placeholder={`Constraint ${index + 1} (e.g., 2x + 3y ≤ 12)`}
              placeholderTextColor={themedColors.text.hint}
              autoCapitalize="none"
            />
          ))}

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: themedColors.success.main }]}
            onPress={() => setConstraints([...constraints, ''])}
          >
            <Text style={styles.addButtonText}>+ Add Constraint</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 20, color: themedColors.text.primary }]}>Objective Function (Optional)</Text>
          <TextInput
            style={[styles.equationInput, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light, color: themedColors.text.primary }]}
            value={objective}
            onChangeText={setObjective}
            placeholder="e.g., maximize 3x + 2y"
            placeholderTextColor={themedColors.text.hint}
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: themedColors.primary.main }, loading && styles.generateButtonDisabled]}
            onPress={handleLinearProgramming}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Graph ({graphCreditCost} credit)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Graph Display */}
      {graphData && (
        <View style={styles.graphSection}>
          {graphData.graph_url ? (
            <TouchableOpacity
              style={[styles.imageContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]}
              onPress={() => {
                setZoomImage(graphData.graph_url!);
                setZoomVisible(true);
              }}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: graphData.graph_url }}
                style={styles.graphImage}
                resizeMode="contain"
                onError={(error) => {
                  console.warn('Failed to load graph image:', error.nativeEvent.error);
                }}
              />
              <View style={styles.magnifyIconContainer}>
                <Text style={{ fontSize: 20 }}>🔍</Text>
              </View>
            </TouchableOpacity>
          ) : (graphData.no_plot || graphData.graph_type?.toLowerCase() === 'statistics') ? (
            <View style={[styles.imageContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F5F5', justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
              <Text style={[styles.sectionTitle, { color: themedColors.text.secondary, textAlign: 'center', marginBottom: 8 }]}>📋 Statistics / Statistical Graphs</Text>
              <Text style={[styles.questionLabel, { color: themedColors.text.primary, textAlign: 'center', marginBottom: 4 }]}>
                Draw your graph on paper (bar chart, pie chart, histogram, etc.).
              </Text>
              <Text style={[styles.videoLoadingText, { color: themedColors.text.hint, textAlign: 'center' }]}>
                You can upload a photo of your work below for AI feedback.
              </Text>
            </View>
          ) : null}

          {(videoUrl || videoError || videoLoading || graphData?.graph_spec) && (
            <View style={styles.videoContainer}>
              <Text style={[styles.questionLabel, { color: themedColors.text.primary }]}>Visualization:</Text>

              {!videoUrl && !videoError && !videoLoading && graphData?.graph_spec && (
                <Text style={[styles.videoLoadingText, { color: themedColors.text.secondary, marginVertical: 12 }]}>Animation not available for this graph.</Text>
              )}

              {videoLoading && !videoError && (
                <View style={styles.videoLoadingContainer}>
                  <ActivityIndicator size="large" color={themedColors.primary.main} />
                  <Text style={[styles.videoLoadingText, { color: themedColors.text.secondary }]}>Generating animation...</Text>
                </View>
              )}

              {videoError && (
                <View style={[styles.videoErrorContainer, { backgroundColor: isDarkMode ? 'rgba(244,67,54,0.2)' : '#FFEBEE', padding: 15, borderRadius: 8 }]}>
                  <Text style={[styles.videoErrorText, { color: '#F44336', textAlign: 'center', marginBottom: 10 }]}>⚠️ {videoError}</Text>
                  <Text style={[{ color: themedColors.text.secondary, fontSize: 12, textAlign: 'center', marginBottom: 10 }]}>
                    The animation requires Manim to be running on the server. The graph image above is still available.
                  </Text>
                  <TouchableOpacity
                    style={[styles.retryButton, { backgroundColor: themedColors.primary.main }]}
                    onPress={handleGenerate}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!videoError && (videoUrl || cachedVideoUrl) && (
                <>
                  {/* Show loading overlay while video loads */}
                  {status !== 'readyToPlay' && !videoError && (
                    <View style={[styles.videoLoadingContainer, { position: 'absolute', zIndex: 1 }]}>
                      <ActivityIndicator size="large" color={themedColors.primary.main} />
                      <Text style={[styles.videoLoadingText, { color: themedColors.text.secondary }]}>Loading animation...</Text>
                    </View>
                  )}
                  <VideoView
                    player={videoPlayer}
                    style={[styles.video, status !== 'readyToPlay' && { opacity: 0.3 }]}
                    contentFit="contain"
                    nativeControls
                  />

                  {/* Save Video Button */}
                  <TouchableOpacity
                    style={[styles.saveVideoButton, { backgroundColor: themedColors.success.main }]}
                    onPress={async () => {
                      try {
                        setSavingVideo(true);

                        // Check permission first, then request if needed (recommended flow for expo-media-library)
                        let { status } = await MediaLibrary.getPermissionsAsync();
                        if (status !== 'granted') {
                          const { status: requested } = await MediaLibrary.requestPermissionsAsync();
                          status = requested;
                        }
                        if (status !== 'granted') {
                          const canShare = await Sharing.isAvailableAsync();
                          Alert.alert(
                            'Permission denied',
                            'Permission to save to gallery was denied. You can still share the video.',
                            canShare
                              ? [
                                  { text: 'OK' },
                                  { text: 'Share', onPress: async () => {
                                    try {
                                      const filename = `graph_animation_${Date.now()}.mp4`;
                                      const localUri = (FileSystem.documentDirectory || '') + filename;
                                      const dl = await FileSystem.downloadAsync(videoUrl!, localUri);
                                      if (dl.status === 200 && (await Sharing.isAvailableAsync())) {
                                        await Sharing.shareAsync(dl.uri);
                                      }
                                    } catch (e) {
                                      console.warn('Share fallback failed:', e);
                                    }
                                  } },
                                ]
                              : [{ text: 'OK' }]
                          );
                          return;
                        }

                        const existingCache = cachedVideoUrl && (await FileSystem.getInfoAsync(cachedVideoUrl));
                        const saveUri = existingCache?.exists ? cachedVideoUrl : null;

                        if (saveUri) {
                          const asset = await MediaLibrary.createAssetAsync(saveUri);
                          await MediaLibrary.createAlbumAsync('NerdX', asset, false);
                          Alert.alert('Success', 'Video saved to your gallery in the NerdX album!');
                          return;
                        }

                        // Download video to local storage
                        const filename = `graph_animation_${Date.now()}.mp4`;
                        const localUri = (FileSystem.documentDirectory || '') + filename;

                        const downloadResult = await FileSystem.downloadAsync(videoUrl!, localUri);

                        if (downloadResult.status === 200) {
                          const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
                          await MediaLibrary.createAlbumAsync('NerdX', asset, false);
                          Alert.alert('Success', 'Video saved to your gallery in the NerdX album!');
                        } else {
                          if (await Sharing.isAvailableAsync()) {
                            await Sharing.shareAsync(downloadResult.uri);
                          } else {
                            Alert.alert('Error', 'Could not save video. Sharing not available.');
                          }
                        }
                      } catch (error: any) {
                        console.error('Save video error:', error);
                        const msg = (error?.message || '').toLowerCase();
                        const permissionDenied = msg.includes('permission') || msg.includes('denied') || msg.includes('rejected');
                        if (permissionDenied && (await Sharing.isAvailableAsync())) {
                          Alert.alert(
                            'Could not save to gallery',
                            'Permission was denied or unavailable. You can share the video instead.',
                            [
                              { text: 'OK' },
                              { text: 'Share', onPress: async () => {
                                try {
                                  const filename = `graph_animation_${Date.now()}.mp4`;
                                  const localUri = (FileSystem.documentDirectory || '') + filename;
                                  const dl = await FileSystem.downloadAsync(videoUrl!, localUri);
                                  if (dl.status === 200) await Sharing.shareAsync(dl.uri);
                                } catch (e) {
                                  console.warn('Share fallback failed:', e);
                                }
                              } },
                            ]
                          );
                        } else {
                          Alert.alert('Error', 'Failed to save video. You can try sharing it instead.');
                        }
                      } finally {
                        setSavingVideo(false);
                      }
                    }}
                    disabled={savingVideo || videoLoading}
                  >
                    {savingVideo ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveVideoButtonText}>📥 Save Video to Gallery</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          <View style={[
            styles.questionContainer,
            {
              backgroundColor: themedColors.background.paper,
              borderColor: themedColors.border.light || 'rgba(0,0,0,0.06)',
            },
          ]}>
            {!(graphData.no_plot || graphData.graph_type?.toLowerCase() === 'statistics') && (
              <>
                <Text style={[styles.questionLabel, { color: themedColors.text.primary }]}>Equation (same as graph & question):</Text>
                <Text style={[styles.equation, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#F5F5F5', color: themedColors.secondary.main }]}>
                  {graphData.equation_display ?? (graphData.equation && !['linear', 'quadratic', 'exponential', 'trigonometric'].includes(String(graphData.equation).trim().toLowerCase()) ? graphData.equation : null) ?? '—'}
                </Text>
              </>
            )}

            {graphData.constraints && graphData.constraints.length > 0 && (
              <>
                <Text style={[styles.questionLabel, { color: themedColors.text.primary }]}>Constraints:</Text>
                {graphData.constraints.map((c, i) => (
                  <Text key={i} style={[styles.equation, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#F5F5F5', color: themedColors.secondary.main }]}>{c}</Text>
                ))}
              </>
            )}

            {graphData.corner_points && graphData.corner_points.length > 0 && (
              <>
                <Text style={[styles.questionLabel, { color: themedColors.text.primary }]}>Corner Points:</Text>
                <Text style={[styles.equation, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#F5F5F5', color: themedColors.secondary.main }]}>
                  {graphData.corner_points.map((p, i) => `(${p[0]}, ${p[1]})`).join(', ')}
                </Text>
              </>
            )}

            <Text style={[styles.questionLabel, { color: themedColors.text.primary }]}>Question:</Text>
            {/\\\(|\\\[|\$/.test(graphData.question || '') ? (
              <MathRenderer
                content={formatQuestionParts(graphData.question || 'Describe what you observe from the graph.')}
                fontSize={16}
                style={{ marginBottom: 20 }}
                minHeight={24}
              />
            ) : (
              <Text style={[styles.question, { color: themedColors.text.primary }]}>{formatQuestionParts(graphData.question || 'Describe what you observe from the graph.')}</Text>
            )}

            {!showSolution && (
              <View style={styles.answerContainer}>
                <Text style={[styles.answerLabel, { color: themedColors.text.primary }]}>Your Answer:</Text>
                <View style={styles.inputWithVoice}>
                  <TextInput
                    style={[styles.answerInput, styles.inputFlex, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light, color: themedColors.text.primary }]}
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder="Enter your answer..."
                    placeholderTextColor={themedColors.text.hint}
                    multiline
                  />
                  <VoiceMathInput
                    onTranscription={(text) => setAnswer(prev => prev ? `${prev} ${text}` : text)}
                    disabled={showSolution}
                  />
                </View>
                <Text style={[styles.voiceHintText, { color: themedColors.text.secondary }]}>
                  🎤 Tap mic to speak your answer
                </Text>

                {/* Upload / Capture images for Vertex AI analysis */}
                <Text style={[styles.answerLabel, { marginTop: 12, color: themedColors.text.primary }]}>Or submit images of your work (analyzed by AI):</Text>
                <View style={styles.answerImageButtonsRow}>
                  <TouchableOpacity
                    style={[styles.answerImageButton, { backgroundColor: themedColors.primary.main }]}
                    onPress={async () => {
                      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Permission', 'Grant camera roll access to upload images.');
                        return;
                      }
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsMultipleSelection: true,
                        quality: 0.8,
                      });
                      if (!result.canceled && result.assets?.length) {
                        setAnswerImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
                      }
                    }}
                  >
                    <Text style={styles.answerImageButtonText}>📷 Upload image</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.answerImageButton, { backgroundColor: themedColors.secondary.main }]}
                    onPress={async () => {
                      const { status } = await ImagePicker.requestCameraPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Permission', 'Grant camera access to capture images.');
                        return;
                      }
                      const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        quality: 0.8,
                      });
                      if (!result.canceled && result.assets?.[0]?.uri) {
                        setAnswerImages(prev => [...prev, result.assets[0].uri]);
                      }
                    }}
                  >
                    <Text style={styles.answerImageButtonText}>📸 Capture image</Text>
                  </TouchableOpacity>
                </View>
                {answerImages.length > 0 && (
                  <View style={styles.answerThumbnailsRow}>
                    {answerImages.map((uri, idx) => (
                      <View key={idx} style={styles.answerThumbnailWrap}>
                        <Image source={{ uri }} style={styles.answerThumbnail} resizeMode="cover" />
                        <TouchableOpacity
                          style={styles.answerThumbnailRemove}
                          onPress={() => setAnswerImages(prev => prev.filter((_, i) => i !== idx))}
                        >
                          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                {answerImages.length > 0 && (
                  <TouchableOpacity
                    style={[styles.analyzeImagesButton, { backgroundColor: themedColors.success.main }]}
                    onPress={async () => {
                      if (!graphData?.question) return;
                      setAnalyzingImages(true);
                      try {
                        const result = await graphApi.submitAnswerImages(graphData.question, answerImages);
                        if (result) {
                          setImageSolution({
                            processed_text: result.processed_text || 'Images analyzed.',
                            solution: result.solution || result.feedback || 'See analysis above.',
                            analysis: result.analysis,
                          });
                          setShowSolution(true);
                          if (user && (result as any).credits_remaining !== undefined) {
                            updateUser({ credits: (result as any).credits_remaining });
                          }
                        }
                      } catch (e: any) {
                        Alert.alert('Error', e.response?.data?.message || 'Failed to analyze images.');
                      } finally {
                        setAnalyzingImages(false);
                      }
                    }}
                    disabled={analyzingImages}
                  >
                    {analyzingImages ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.analyzeImagesButtonText}>Submit images for AI analysis</Text>
                    )}
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: themedColors.success.main }]}
                  onPress={handleSubmitAnswer}
                >
                  <Text style={styles.submitButtonText}>Submit Answer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modeButton, { marginTop: 10, padding: 15, backgroundColor: 'transparent', borderWidth: 1, borderColor: themedColors.border.light }]}
                  onPress={() => {
                    if (mode === 'generate') {
                      handleGenerate();
                    } else {
                      resetView();
                    }
                  }}
                >
                  <Text style={[styles.submitButtonText, { color: themedColors.text.primary }]}>Skip / Next</Text>
                </TouchableOpacity>
              </View>
            )}

            {showSolution && (
              <View style={[styles.solutionContainer, { backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.15)' : '#E8F5E9' }]}>
                <Text style={[styles.solutionLabel, { color: themedColors.success.main }]}>Solution:</Text>
                {/\\\(|\\\[|\$/.test(graphData.solution || '') ? (
                  <MathRenderer
                    content={graphData.solution || 'See explanation above.'}
                    fontSize={15}
                    style={{ marginBottom: 15 }}
                    minHeight={20}
                  />
                ) : (
                  <Text style={[styles.solution, { color: themedColors.text.primary }]}>{graphData.solution || 'See explanation above.'}</Text>
                )}
                <TouchableOpacity
                  style={[styles.newGraphButton, { backgroundColor: themedColors.primary.main }]}
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
          <View style={[styles.solutionContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]}>
            <Text style={[styles.solutionLabel, { color: themedColors.text.primary }]}>Processed Text:</Text>
            <Text style={[styles.solution, { color: themedColors.text.secondary }]}>{imageSolution.processed_text}</Text>

            <Text style={[styles.solutionLabel, { marginTop: 15, color: themedColors.text.primary }]}>Solution:</Text>
            <Text style={[styles.solution, { color: themedColors.text.secondary }]}>{imageSolution.solution}</Text>

            {imageSolution.analysis && (
              <>
                <Text style={[styles.solutionLabel, { marginTop: 15, color: themedColors.text.primary }]}>Analysis:</Text>
                <Text style={[styles.solution, { color: themedColors.text.secondary }]}>{imageSolution.analysis}</Text>
              </>
            )}

            <TouchableOpacity
              style={[styles.newGraphButton, { backgroundColor: themedColors.primary.main }]}
              onPress={resetView}
            >
              <Text style={styles.newGraphButtonText}>Try Another Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Zoom Modal */}
      <ZoomableImageModal
        visible={zoomVisible}
        imageUrl={zoomImage}
        onClose={() => setZoomVisible(false)}
      />
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
  levelRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  levelButtonText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  levelButtonTextActive: {
    color: '#2196F3',
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
  // graphImage: { ... } - Duplicate removed/merged
  questionContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
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
  questionFallback: {
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  questionMathWrap: {
    marginBottom: 20,
    minHeight: 24,
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
  inputWithVoice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputFlex: {
    flex: 1,
  },
  voiceHintText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
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
  answerImageButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  answerImageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  answerImageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  answerThumbnailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  answerThumbnailWrap: {
    position: 'relative',
  },
  answerThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  answerThumbnailRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeImagesButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  analyzeImagesButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
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
  videoContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  videoLoadingContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  videoLoadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  videoErrorContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  videoErrorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveVideoButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  saveVideoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  graphSection: {
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  magnifyIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  graphImage: {
    width: '100%',
    height: '100%',
  },
});

export default GraphPracticeScreen;
