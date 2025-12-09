import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { Icons } from '../components/Icons';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';

interface FormulaCategory {
    id: string;
    title: string;
    icon: string;
    formulas: { name: string; equation: string; description?: string }[];
}

const formulaData: FormulaCategory[] = [
    {
        id: 'algebra',
        title: 'Algebra',
        icon: 'calculate',
        formulas: [
            { name: 'Quadratic Formula', equation: 'x = (-b ± √(b² - 4ac)) / 2a', description: 'For ax² + bx + c = 0' },
            { name: 'Difference of Squares', equation: 'a² - b² = (a - b)(a + b)' },
            { name: 'Perfect Square', equation: '(a + b)² = a² + 2ab + b²' },
        ],
    },
    {
        id: 'geometry',
        title: 'Geometry',
        icon: 'architecture',
        formulas: [
            { name: 'Area of Circle', equation: 'A = πr²' },
            { name: 'Circumference', equation: 'C = 2πr' },
            { name: 'Area of Triangle', equation: 'A = ½bh' },
            { name: 'Pythagoras Theorem', equation: 'a² + b² = c²', description: 'For right-angled triangles' },
        ],
    },
    {
        id: 'trigonometry',
        title: 'Trigonometry',
        icon: 'waves',
        formulas: [
            { name: 'Sine Rule', equation: 'a/sinA = b/sinB = c/sinC' },
            { name: 'Cosine Rule', equation: 'c² = a² + b² - 2ab cosC' },
            { name: 'Area of Triangle', equation: 'Area = ½ab sinC' },
        ],
    },
    {
        id: 'indices',
        title: 'Indices',
        icon: 'functions',
        formulas: [
            { name: 'Multiplication', equation: 'aᵐ × aⁿ = aᵐ⁺ⁿ' },
            { name: 'Division', equation: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ' },
            { name: 'Power of Power', equation: '(aᵐ)ⁿ = aᵐⁿ' },
            { name: 'Negative Index', equation: 'a⁻ⁿ = 1/aⁿ' },
        ],
    },
];

const FormulaSheetScreen: React.FC = () => {
    const { isDarkMode } = useTheme();
    const themedColors = useThemedColors();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.subjects.mathematics} />
            <LinearGradient
                colors={themedColors.gradients.primary}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Formula Sheet</Text>
                <Text style={styles.headerSubtitle}>Essential Math Formulas</Text>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {formulaData.map((category) => (
                    <View key={category.id} style={[styles.cardContainer, { backgroundColor: themedColors.background.paper, borderColor: themedColors.border.light }]}>
                        <TouchableOpacity
                            style={[styles.cardHeader, { backgroundColor: themedColors.background.paper }, expandedId === category.id && [styles.cardHeaderActive, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : Colors.background.subtle, borderBottomColor: themedColors.border.light }]]}
                            onPress={() => toggleExpand(category.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.cardTitleContainer}>
                                <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : Colors.background.subtle }]}>
                                    {/* Placeholder for icon, using text for now if Icons doesn't have specific ones, 
                      but we can use a generic math icon or try to map from Icons */}
                                    <Text style={styles.iconText}>{category.icon === 'calculate' ? '📐' : category.icon === 'architecture' ? '🔷' : category.icon === 'waves' ? '🌊' : '🔢'}</Text>
                                </View>
                                <Text style={[styles.cardTitle, { color: themedColors.text.primary }]}>{category.title}</Text>
                            </View>
                            {Icons.arrowRight(24, expandedId === category.id ? themedColors.primary.main : themedColors.text.secondary)}
                        </TouchableOpacity>

                        {expandedId === category.id && (
                            <View style={[styles.cardContent, { backgroundColor: themedColors.background.paper }]}>
                                {category.formulas.map((formula, index) => (
                                    <View key={index} style={[styles.formulaItem, { borderBottomColor: themedColors.border.light }]}>
                                        <Text style={[styles.formulaName, { color: themedColors.text.secondary }]}>{formula.name}</Text>
                                        <View style={[styles.equationContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : Colors.background.subtle }]}>
                                            <Text style={[styles.equation, { color: themedColors.primary.main }]}>{formula.equation}</Text>
                                        </View>
                                        {formula.description && (
                                            <Text style={[styles.formulaDescription, { color: themedColors.text.secondary }]}>{formula.description}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
                <View style={styles.footerSpacing} />
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
    cardContainer: {
        backgroundColor: Colors.background.paper,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: Colors.background.paper,
    },
    cardHeaderActive: {
        backgroundColor: Colors.background.subtle,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background.subtle,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconText: {
        fontSize: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    cardContent: {
        padding: 16,
        backgroundColor: Colors.background.paper,
    },
    formulaItem: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
        paddingBottom: 16,
    },
    formulaName: {
        fontSize: 14,
        color: Colors.text.secondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    equationContainer: {
        backgroundColor: Colors.background.subtle,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    equation: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.subjects.mathematics,
        fontFamily: 'monospace',
    },
    formulaDescription: {
        marginTop: 8,
        fontSize: 12,
        color: Colors.text.hint,
        fontStyle: 'italic',
    },
    footerSpacing: {
        height: 40,
    },
});

export default FormulaSheetScreen;
