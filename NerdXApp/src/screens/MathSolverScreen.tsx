import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { mathApi, MathSolution } from '../services/api/mathApi';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import VoiceMathInput from '../components/VoiceMathInput';
import MathText from '../components/MathText';

const MathSolverScreen: React.FC = () => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState<MathSolution | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);

    const handleSolve = async () => {
        if (!problem.trim()) {
            Alert.alert('Error', 'Please enter a math problem');
            return;
        }

        try {
            setLoading(true);
            setSolution(null);
            const result = await mathApi.solveProblem(problem);
            setSolution(result);
        } catch (error) {
            Alert.alert('Error', 'Failed to solve problem. Please check the syntax.');
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('Permission Denied', 'Gallery permission is required.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                setImageUri(result.assets[0].uri);
                setLoading(true);
                try {
                    const scanResult = await mathApi.scanProblem(result.assets[0].uri);
                    if (scanResult.success) {
                        setProblem(scanResult.latex);

                        // Show which OCR method was used
                        const methodLabel = scanResult.method === 'offline-mlkit'
                            ? '⚡ Scanned offline with ML Kit'
                            : scanResult.method === 'vertex_gemini_vision' || scanResult.method === 'vertex-vision'
                                ? '☁️ Scanned online (NerdX Cloud OCR)'
                                : '☁️ Scanned online';
                        console.log(methodLabel);

                        // Auto-solve after scan
                        const solveResult = await mathApi.solveProblem(scanResult.latex);
                        setSolution(solveResult);
                    } else {
                        Alert.alert('Scan Failed', 'Could not recognize equation. Try a clearer image.');
                    }
                } catch (error) {
                    Alert.alert('Error', 'Failed to process image. Make sure the math is clearly visible.');
                } finally {
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Scan error:', error);
        }
    };

    const handleClear = () => {
        setProblem('');
        setSolution(null);
        setImageUri(null);
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <LinearGradient
                colors={themedColors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Math Solver</Text>
                <Text style={styles.headerSubtitle}>Scan or type a problem</Text>
            </LinearGradient>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* Input Section */}
                <View style={[styles.inputCard, { backgroundColor: themedColors.background.paper }]}>
                    <View style={[styles.inputRow, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA' }]}>
                        <TextInput
                            style={[styles.input, { color: themedColors.text.primary }]}
                            placeholder="e.g. x^2 + 5x + 6 = 0"
                            placeholderTextColor={themedColors.text.hint}
                            value={problem}
                            onChangeText={setProblem}
                            multiline
                        />
                        {problem.length > 0 && (
                            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                                <Ionicons name="close-circle" size={20} color={themedColors.text.secondary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.actionButtons}>
                        <View style={styles.voiceButtonContainer}>
                            <VoiceMathInput
                                onTranscription={(text) => {
                                    setProblem(prev => prev ? `${prev} ${text}` : text);
                                }}
                                disabled={loading}
                            />
                        </View>

                        <TouchableOpacity style={[styles.scanButton, { backgroundColor: themedColors.secondary.main }]} onPress={handleScan}>
                            <Ionicons name="camera" size={24} color="#FFF" />
                            <Text style={styles.buttonText}>Scan</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.solveButton, { backgroundColor: themedColors.primary.main }, !problem.trim() && styles.disabledButton]}
                            onPress={handleSolve}
                            disabled={!problem.trim() || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Ionicons name="calculator" size={24} color="#FFF" />
                                    <Text style={styles.buttonText}>Solve</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.voiceHintText, { color: themedColors.text.secondary }]}>
                        🎤 Tap mic to speak your equation (e.g., "x squared plus 5x plus 6 equals 0")
                    </Text>
                </View>

                {/* Image Preview */}
                {imageUri && (
                    <View style={styles.imagePreview}>
                        <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    </View>
                )}

                {/* Solution Section */}
                {solution && (
                    <View style={styles.solutionContainer}>
                        <View style={[styles.resultCard, { backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.15)' : '#E8F5E9', borderLeftColor: themedColors.success.main }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={[styles.resultTitle, { color: themedColors.success.main, marginBottom: 0 }]}>Solution</Text>
                                <View style={{
                                    backgroundColor: solution.solvedOffline ? '#4CAF50' : '#2196F3',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderRadius: 12,
                                }}>
                                    <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '600' }}>
                                        {solution.solvedOffline ? '⚡ Offline' : '☁️ Server'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.latexContainer}>
                                <MathText fontSize={22} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    {solution.latex_solutions.join(', ')}
                                </MathText>
                            </View>
                        </View>

                        <Text style={[styles.stepsHeader, { color: themedColors.text.primary }]}>Step-by-Step Explanation</Text>

                        {solution.steps.map((step, index) => (
                            <View key={index} style={[styles.stepCard, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light }]}>
                                <View style={styles.stepHeader}>
                                    <View style={[styles.stepNumber, { backgroundColor: themedColors.primary.light }]}>
                                        <Text style={[styles.stepNumberText, { color: themedColors.primary.main }]}>{step.step}</Text>
                                    </View>
                                    <Text style={[styles.stepDescription, { color: themedColors.text.primary }]}>{step.description}</Text>
                                </View>

                                {step.latex && (
                                    <View style={[styles.stepLatex, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#F5F7FA' }]}>
                                        <MathText fontSize={18} style={{ textAlign: 'center' }}>
                                            {step.latex}
                                        </MathText>
                                    </View>
                                )}

                                {step.explanation && (
                                    <Text style={[styles.stepExplanation, { color: themedColors.text.secondary }]}>{step.explanation}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.default,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    inputCard: {
        backgroundColor: Colors.background.paper,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.subtle,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 18,
        color: Colors.text.primary,
        minHeight: 50,
    },
    clearButton: {
        padding: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    voiceButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    voiceHintText: {
        fontSize: 12,
        marginTop: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    scanButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondary.main,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    solveButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary.main,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    imagePreview: {
        height: 150,
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    solutionContainer: {
        gap: 16,
    },
    resultCard: {
        backgroundColor: Colors.success.light,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.success.main,
    },
    resultTitle: {
        fontSize: 14,
        color: Colors.success.dark,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    latexContainer: {
        alignItems: 'center',
    },
    stepsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginTop: 8,
    },
    stepCard: {
        backgroundColor: Colors.background.paper,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary.light,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        color: Colors.primary.main,
        fontWeight: 'bold',
        fontSize: 14,
    },
    stepDescription: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        flex: 1,
    },
    stepLatex: {
        backgroundColor: Colors.background.subtle,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    stepExplanation: {
        fontSize: 14,
        color: Colors.text.secondary,
        lineHeight: 20,
    },
});

export default MathSolverScreen;
