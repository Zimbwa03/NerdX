import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Icons } from '../components/Icons';

const years = ['2023', '2022', '2021', '2020', '2019'];
const papers = ['Paper 1 (Multiple Choice)', 'Paper 2 (Structured)'];

const PastPaperScreen: React.FC = () => {
    const navigation = useNavigation();
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedPaper, setSelectedPaper] = useState<string | null>(null);

    const handleStartExam = () => {
        if (!selectedYear || !selectedPaper) {
            Alert.alert('Selection Required', 'Please select both a year and a paper type.');
            return;
        }
        // TODO: Implement navigation to exam screen
        console.log('Starting exam:', selectedYear, selectedPaper);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.subjects.mathematics} />
            <LinearGradient
                colors={[Colors.subjects.mathematics, '#1565C0']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Past Papers</Text>
                <Text style={styles.headerSubtitle}>Practice with real exam questions</Text>
            </LinearGradient>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Year</Text>
                    <View style={styles.grid}>
                        {years.map((year) => (
                            <TouchableOpacity
                                key={year}
                                style={[
                                    styles.yearButton,
                                    selectedYear === year && styles.selectedButton,
                                ]}
                                onPress={() => setSelectedYear(year)}
                            >
                                <Text
                                    style={[
                                        styles.yearText,
                                        selectedYear === year && styles.selectedText,
                                    ]}
                                >
                                    {year}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Paper</Text>
                    {papers.map((paper) => (
                        <TouchableOpacity
                            key={paper}
                            style={[
                                styles.paperButton,
                                selectedPaper === paper && styles.selectedButton,
                            ]}
                            onPress={() => setSelectedPaper(paper)}
                        >
                            <View style={styles.paperIcon}>
                                <Text style={{ fontSize: 20 }}>📝</Text>
                            </View>
                            <Text
                                style={[
                                    styles.paperText,
                                    selectedPaper === paper && styles.selectedText,
                                ]}
                            >
                                {paper}
                            </Text>
                            {selectedPaper === paper && (
                                <View style={styles.checkIcon}>
                                    {Icons.check(20, '#FFFFFF')}
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Exam Mode Info</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>⏱️</Text>
                        <Text style={styles.infoText}>Timed practice session</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📊</Text>
                        <Text style={styles.infoText}>Detailed results analysis</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>🤖</Text>
                        <Text style={styles.infoText}>AI explanations for corrections</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.startButton,
                        (!selectedYear || !selectedPaper) && styles.disabledButton,
                    ]}
                    onPress={handleStartExam}
                    disabled={!selectedYear || !selectedPaper}
                >
                    <Text style={styles.startButtonText}>Start Exam</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background.default,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    yearButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: Colors.background.paper,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border.light,
        minWidth: '30%',
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: Colors.subjects.mathematics,
        borderColor: Colors.subjects.mathematics,
    },
    yearText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text.primary,
    },
    selectedText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    paperButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.background.paper,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border.light,
        marginBottom: 10,
    },
    paperIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background.subtle,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    paperText: {
        fontSize: 16,
        color: Colors.text.primary,
        flex: 1,
    },
    checkIcon: {
        marginLeft: 10,
    },
    infoCard: {
        backgroundColor: '#E3F2FD',
        borderRadius: 16,
        padding: 20,
        marginBottom: 100, // Space for footer
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#1976D2',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: Colors.background.default,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
    },
    startButton: {
        backgroundColor: Colors.subjects.mathematics,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: Colors.subjects.mathematics,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    disabledButton: {
        backgroundColor: Colors.text.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PastPaperScreen;
