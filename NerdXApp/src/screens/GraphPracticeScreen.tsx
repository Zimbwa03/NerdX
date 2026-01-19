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
import * as FileSystem from 'expo-file-system';
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

type Mode = 'generate' | 'custom' | 'upload' | 'linear';

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

  // Zoom Modal State
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Create video player when videoUrl changes
  const videoPlayer = useVideoPlayer(videoUrl || '', (player) => {
    player.loop = true;
    if (videoUrl) {
      // Small delay before playing to allow video to buffer
      setTimeout(() => {
        try {
          player.play();
        } catch (e) {
          console.warn('Video play failed:', e);
        }
      }, 500);
    }
  });

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
  ];

  const graphCreditCost = 1; // Graph generation cost (1 credit per graph)
  const imageSolveCreditCost = 3; // Image solving cost (3 credits per image)

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
      setVideoError(null);
      setVideoLoading(false);

      // Generate static graph
      const data = await graphApi.generateGraph(graphType);
      if (data) {
        setGraphData(data);
        // Backend handles credit deduction - update from response if available
        // For now, deduct locally for immediate UI feedback (backend also deducts)
        if (user && data.credits_remaining !== undefined) {
          updateUser({ credits: data.credits_remaining });
        } else if (user) {
          const newCredits = (user.credits || 0) - graphCreditCost;
          updateUser({ credits: newCredits });
        }
      }

      // Generate Animation (Manim) if supported
      const spec = data?.graph_spec;
      const specType = spec?.graph_type || graphType;
      const coeffs = spec?.coefficients;
      const xRange = spec?.x_range;
      const yRange = spec?.y_range;

      // Animate using the same deterministic graph_spec the server used for the Matplotlib image.
      if (
        (specType === 'quadratic' || specType === 'linear') ||
        (specType === 'trigonometric' || specType === 'exponential')
      ) {
        try {
          setVideoLoading(true);
          let animResult = null;
          if (specType === 'quadratic' && coeffs) {
            const a = coeffs.a ?? 1;
            const b = coeffs.b ?? 0;
            const c = coeffs.c ?? 0;
            animResult = await graphApi.generateQuadraticAnimation(a, b, c, xRange, yRange);
          } else if (specType === 'linear' && coeffs) {
            const m = coeffs.m ?? 1;
            const c = coeffs.c ?? 0;
            animResult = await graphApi.generateLinearAnimation(m, c, xRange, yRange);
          } else if (spec?.clean_expression) {
            // Trig/exponential (and any non-polynomial) uses expression-based animation
            animResult = await graphApi.generateExpressionAnimation(spec.clean_expression, xRange, yRange);
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
            } else {
              console.warn('Video URL not accessible after retries');
              setVideoError('Animation video is not available. The server may still be generating it.');
            }
          } else {
            console.log('Animation not available for this graph type');
            // Don't show error for animation not available - it's optional
          }
        } catch (animError: any) {
          console.warn('Animation generation failed:', animError);
          setVideoError('Animation service is currently unavailable. Graph image is still available above.');
        } finally {
          setVideoLoading(false);
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
        if (user) {
          const newCredits = (user.credits || 0) - graphCreditCost;
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
        if (user) {
          const newCredits = (user.credits || 0) - imageSolveCreditCost;
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
        // Backend handles credit deduction - update from response if available
        if (user && data.credits_remaining !== undefined) {
          updateUser({ credits: data.credits_remaining });
        } else if (user) {
          const newCredits = (user.credits || 0) - graphCreditCost;
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
    <ScrollView style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <View style={[styles.header, { backgroundColor: themedColors.primary.main }]}>
        <Text style={styles.title}>📊 Graph Practice</Text>
        <Text style={styles.subtitle}>Practice reading and analyzing graphs</Text>
        <Text style={styles.credits}>Credits: {user?.credits || 0}</Text>
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
          {graphData.graph_url && (
            <TouchableOpacity
              style={[styles.imageContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]}
              onPress={() => {
                setZoomImage(graphData.graph_url);
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
          )}

          {(videoUrl || videoError || videoLoading) && (
            <View style={styles.videoContainer}>
              <Text style={[styles.questionLabel, { color: themedColors.text.primary }]}>Visualization:</Text>

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

              {!videoError && videoUrl && (
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

                        // Request permissions
                        const { status } = await MediaLibrary.requestPermissionsAsync();
                        if (status !== 'granted') {
                          Alert.alert('Permission Required', 'Please grant permission to save videos.');
                          return;
                        }

                        // Download video to local storage
                        const filename = `graph_animation_${Date.now()}.mp4`;
                        const localUri = FileSystem.documentDirectory + filename;

                        const downloadResult = await FileSystem.downloadAsync(videoUrl, localUri);

                        if (downloadResult.status === 200) {
                          // Save to media library
                          const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
                          await MediaLibrary.createAlbumAsync('NerdX', asset, false);

                          Alert.alert('Success', 'Video saved to your gallery in the NerdX album!');
                        } else {
                          // Fallback to sharing
                          if (await Sharing.isAvailableAsync()) {
                            await Sharing.shareAsync(downloadResult.uri);
                          } else {
                            Alert.alert('Error', 'Could not save video. Sharing not available.');
                          }
                        }
                      } catch (error) {
                        console.error('Save video error:', error);
                        Alert.alert('Error', 'Failed to save video. Please try again.');
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

          <View style={[styles.questionContainer, { backgroundColor: themedColors.background.paper }]}>
            <Text style={[styles.questionLabel, { color: themedColors.text.primary }]}>Equation:</Text>
            <Text style={[styles.equation, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#F5F5F5', color: themedColors.secondary.main }]}>{graphData.equation}</Text>

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
            <Text style={[styles.question, { color: themedColors.text.primary }]}>{graphData.question}</Text>

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
                <Text style={[styles.solution, { color: themedColors.text.primary }]}>{graphData.solution}</Text>
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
