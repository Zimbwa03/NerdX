// Virtual Lab Screen - Interactive Science Simulations
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Icons, IconCircle } from '../components/Icons';
import { Card } from '../components/Card';

const { width } = Dimensions.get('window');

const VirtualLabScreen: React.FC = () => {
    const navigation = useNavigation();
    const [activeLab, setActiveLab] = useState<'physics' | 'chemistry' | 'biology'>('physics');

    // Physics State (Pendulum)
    const [length, setLength] = useState(1.0); // meters
    const [angle, setAngle] = useState(0);
    const pendulumAnim = useRef(new Animated.Value(0)).current;
    const [isOscillating, setIsOscillating] = useState(false);

    // Chemistry State (Titration)
    const [titrantVolume, setTitrantVolume] = useState(0);
    const [ph, setPh] = useState(1); // Acidic start
    const [solutionColor, setSolutionColor] = useState('#FFCDD2'); // Pinkish red (acid with indicator?) or clear? Let's say Phenolphthalein: Clear in acid, Pink in base.
    // Let's model Strong Acid (HCl) + Strong Base (NaOH) with Phenolphthalein.
    // Start: Acid (Clear). End: Base (Pink).

    // Biology State (Photosynthesis)
    const [lightIntensity, setLightIntensity] = useState(50);
    const [bubbleCount, setBubbleCount] = useState(0);

    // --- Physics Logic ---
    useEffect(() => {
        if (activeLab === 'physics' && isOscillating) {
            const period = 2 * Math.PI * Math.sqrt(length / 9.8); // T = 2*pi*sqrt(L/g)
            const duration = period * 1000; // ms

            Animated.loop(
                Animated.sequence([
                    Animated.timing(pendulumAnim, {
                        toValue: 1,
                        duration: duration / 4,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pendulumAnim, {
                        toValue: -1,
                        duration: duration / 2,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pendulumAnim, {
                        toValue: 0,
                        duration: duration / 4,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pendulumAnim.setValue(0);
        }
    }, [length, isOscillating, activeLab]);

    const pendulumRotation = pendulumAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-30deg', '30deg'],
    });

    // --- Chemistry Logic ---
    const addTitrant = () => {
        const newVol = titrantVolume + 1;
        setTitrantVolume(newVol);

        // Simple simulation: Equivalence point at 25ml
        // pH curve approximation
        let newPh = ph;
        if (newVol < 20) newPh = 1 + (newVol * 0.1);
        else if (newVol < 25) newPh = 3 + (newVol - 20); // Steep rise
        else if (newVol === 25) newPh = 7;
        else newPh = 11 + ((newVol - 25) * 0.1);

        setPh(Math.min(14, newPh));

        // Color change (Phenolphthalein)
        if (newPh >= 8.2) {
            setSolutionColor('#F48FB1'); // Pink
        } else {
            setSolutionColor('#E0F7FA'); // Clear/Watery
        }
    };

    const resetTitration = () => {
        setTitrantVolume(0);
        setPh(1);
        setSolutionColor('#E0F7FA');
    };

    // --- Biology Logic ---
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeLab === 'biology') {
            // Rate of photosynthesis proportional to light intensity (simplified)
            // Bubbles per second
            const rate = lightIntensity / 20; // Max 5 bubbles/sec approx
            if (rate > 0) {
                interval = setInterval(() => {
                    setBubbleCount(c => c + 1);
                }, 1000 / rate);
            }
        }
        return () => clearInterval(interval);
    }, [lightIntensity, activeLab]);


    const renderPhysicsLab = () => (
        <View style={styles.labContainer}>
            <Text style={styles.labTitle}>Simple Pendulum</Text>
            <Text style={styles.labDescription}>
                Investigate how length affects the period of oscillation.
            </Text>

            <View style={styles.simulationArea}>
                <View style={styles.pendulumSupport} />
                <Animated.View style={[styles.pendulumString, { height: length * 150, transform: [{ rotate: pendulumRotation }] }]}>
                    <View style={styles.pendulumBob} />
                </Animated.View>
            </View>

            <View style={styles.controls}>
                <Text style={styles.controlLabel}>String Length: {length.toFixed(1)}m</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={() => setLength(Math.max(0.1, length - 0.1))} style={styles.controlBtn}>
                        <Text style={styles.btnText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setLength(Math.min(2.0, length + 0.1))} style={styles.controlBtn}>
                        <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.actionBtn, isOscillating ? styles.stopBtn : styles.startBtn]}
                    onPress={() => setIsOscillating(!isOscillating)}
                >
                    <Text style={styles.actionBtnText}>{isOscillating ? 'Stop' : 'Start Oscillation'}</Text>
                </TouchableOpacity>

                <View style={styles.readout}>
                    <Text style={styles.readoutText}>Period (T): {(2 * Math.PI * Math.sqrt(length / 9.8)).toFixed(2)}s</Text>
                </View>
            </View>
        </View>
    );

    const renderChemistryLab = () => (
        <View style={styles.labContainer}>
            <Text style={styles.labTitle}>Acid-Base Titration</Text>
            <Text style={styles.labDescription}>
                Neutralize the acid by adding base. Watch for the color change!
            </Text>

            <View style={styles.simulationArea}>
                <View style={styles.burette}>
                    <View style={[styles.buretteLiquid, { height: `${100 - (titrantVolume * 2)}%` }]} />
                </View>
                <View style={[styles.flask, { backgroundColor: solutionColor }]}>
                    <Text style={styles.flaskLabel}>{titrantVolume}mL added</Text>
                </View>
            </View>

            <View style={styles.controls}>
                <Text style={styles.controlLabel}>pH Level: {ph.toFixed(1)}</Text>

                <TouchableOpacity style={styles.actionBtn} onPress={addTitrant}>
                    <Text style={styles.actionBtnText}>Add 1mL Base (NaOH)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, styles.resetBtn]} onPress={resetTitration}>
                    <Text style={styles.actionBtnText}>Reset Experiment</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderBiologyLab = () => (
        <View style={styles.labContainer}>
            <Text style={styles.labTitle}>Photosynthesis Rate</Text>
            <Text style={styles.labDescription}>
                Observe how light intensity affects oxygen production (bubbles).
            </Text>

            <View style={styles.simulationArea}>
                <View style={[styles.lamp, { opacity: lightIntensity / 100 }]} />
                <View style={styles.beaker}>
                    <View style={styles.plant} />
                    {/* Animated bubbles would go here, simplified as a counter for now */}
                    <View style={styles.bubblesContainer}>
                        {Array.from({ length: Math.min(10, bubbleCount % 15) }).map((_, i) => (
                            <View key={i} style={[styles.bubble, { bottom: i * 15, left: Math.random() * 40 }]} />
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.controls}>
                <Text style={styles.controlLabel}>Light Intensity: {lightIntensity}%</Text>
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={() => setLightIntensity(Math.max(0, lightIntensity - 10))} style={styles.controlBtn}>
                        <Text style={styles.btnText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setLightIntensity(Math.min(100, lightIntensity + 10))} style={styles.controlBtn}>
                        <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.readout}>
                    <Text style={styles.readoutText}>Bubbles Counted: {bubbleCount}</Text>
                    <Text style={styles.readoutSubText}>Rate: {(lightIntensity / 20).toFixed(1)} bubbles/sec</Text>
                </View>

                <TouchableOpacity style={[styles.actionBtn, styles.resetBtn]} onPress={() => setBubbleCount(0)}>
                    <Text style={styles.actionBtnText}>Reset Count</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background.default} />

            <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Virtual Labs</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeLab === 'physics' && styles.activeTab]}
                    onPress={() => setActiveLab('physics')}
                >
                    <Text style={[styles.tabText, activeLab === 'physics' && styles.activeTabText]}>Physics</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeLab === 'chemistry' && styles.activeTab]}
                    onPress={() => setActiveLab('chemistry')}
                >
                    <Text style={[styles.tabText, activeLab === 'chemistry' && styles.activeTabText]}>Chemistry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeLab === 'biology' && styles.activeTab]}
                    onPress={() => setActiveLab('biology')}
                >
                    <Text style={[styles.tabText, activeLab === 'biology' && styles.activeTabText]}>Biology</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeLab === 'physics' && renderPhysicsLab()}
                {activeLab === 'chemistry' && renderChemistryLab()}
                {activeLab === 'biology' && renderBiologyLab()}
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
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text.white,
    },
    backButton: {
        fontSize: 16,
        color: Colors.text.white,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.background.paper,
        padding: 10,
        justifyContent: 'space-around',
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: Colors.primary.main,
    },
    tabText: {
        color: Colors.text.secondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: Colors.text.white,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    labContainer: {
        backgroundColor: Colors.background.paper,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    labTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text.primary,
        marginBottom: 8,
    },
    labDescription: {
        fontSize: 14,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    simulationArea: {
        width: '100%',
        height: 300,
        backgroundColor: '#E0E0E0', // Light bg for contrast
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    // Physics Styles
    pendulumSupport: {
        width: 100,
        height: 4,
        backgroundColor: '#333',
        position: 'absolute',
        top: 20,
    },
    pendulumString: {
        width: 2,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 20,
        transformOrigin: 'top center', // Note: React Native might need anchor point workaround
    },
    pendulumBob: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.primary.main,
    },
    // Chemistry Styles
    burette: {
        width: 20,
        height: 150,
        borderWidth: 2,
        borderColor: '#333',
        position: 'absolute',
        top: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'flex-end',
    },
    buretteLiquid: {
        width: '100%',
        backgroundColor: Colors.secondary.main,
    },
    flask: {
        width: 80,
        height: 100,
        borderWidth: 2,
        borderColor: '#333',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flaskLabel: {
        fontSize: 10,
        color: '#333',
    },
    // Biology Styles
    lamp: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFD700', // Sun yellow
        position: 'absolute',
        top: 20,
        right: 20,
        shadowColor: '#FFD700',
        shadowRadius: 20,
        shadowOpacity: 1,
    },
    beaker: {
        width: 100,
        height: 150,
        borderWidth: 2,
        borderColor: '#333',
        backgroundColor: 'rgba(173, 216, 230, 0.3)', // Light blue water
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    plant: {
        width: 40,
        height: 80,
        backgroundColor: 'green',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bubblesContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    bubble: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.7)',
        position: 'absolute',
    },
    controls: {
        width: '100%',
        alignItems: 'center',
    },
    controlLabel: {
        fontSize: 16,
        color: Colors.text.primary,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    controlBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.background.subtle,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: 24,
        color: Colors.text.white,
    },
    actionBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: Colors.primary.main,
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    startBtn: {
        backgroundColor: Colors.success.main,
    },
    stopBtn: {
        backgroundColor: Colors.error.main,
    },
    resetBtn: {
        backgroundColor: Colors.warning.dark,
    },
    actionBtnText: {
        color: Colors.text.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    readout: {
        marginTop: 10,
        alignItems: 'center',
    },
    readoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.secondary.main,
    },
    readoutSubText: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
});

export default VirtualLabScreen;
