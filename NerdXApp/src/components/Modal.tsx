// Modal Component - Professional Modal for selections (Theme Aware)
import React, { useMemo } from 'react';
import {
    View,
    Text,
    Modal as RNModal,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Animated,
} from 'react-native';
import { useThemedColors } from '../theme/useThemedStyles';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ visible, onClose, title, children }) => {
    const colors = useThemedColors();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            opacity: fadeAnim,
                            transform: [
                                {
                                    scale: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.9, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{title}</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>{children}</View>
                        </View>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </RNModal>
    );
};

interface ModalOptionCardProps {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    color?: string;
}

export const ModalOptionCard: React.FC<ModalOptionCardProps> = ({
    icon,
    title,
    description,
    onPress,
    color,
}) => {
    const colors = useThemedColors();
    const accentColor = color || colors.primary.main;
    const styles = useMemo(() => createStyles(colors), [colors]);

    return (
        <TouchableOpacity
            style={[styles.optionCard, { borderLeftColor: accentColor }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.optionIconContainer}>
                <Text style={styles.optionIcon}>{icon}</Text>
            </View>
            <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{title}</Text>
                <Text style={styles.optionDescription}>{description}</Text>
            </View>
            <Text style={styles.optionArrow}>→</Text>
        </TouchableOpacity>
    );
};

const createStyles = (colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        maxWidth: 400,
    },
    modalContent: {
        backgroundColor: colors.background.paper,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border.light,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.background.subtle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 20,
        color: colors.text.secondary,
        fontWeight: '600',
    },
    modalBody: {
        padding: 20,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.paper,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border.light,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    optionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.background.subtle,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionIcon: {
        fontSize: 24,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 18,
    },
    optionArrow: {
        fontSize: 20,
        color: colors.text.secondary,
        marginLeft: 8,
    },
});
