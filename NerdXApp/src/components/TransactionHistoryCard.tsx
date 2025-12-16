// TransactionHistoryCard Component - Display transaction details
// Shows payment history with icons, status badges, and timestamps

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditTransaction } from '../services/api/creditsApi';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';

interface TransactionHistoryCardProps {
    transaction: CreditTransaction;
}

const TRANSACTION_ICONS: Record<string, string> = {
    purchase: '🛒',
    usage: '📝',
    refund: '💰',
    bonus: '🎁',
    reward: '⭐',
    default: '💳',
};

const TRANSACTION_COLORS: Record<string, string> = {
    purchase: Colors.success.main,
    usage: Colors.info.main,
    refund: Colors.warning.main,
    bonus: Colors.secondary.main,
    reward: Colors.primary.main,
    default: Colors.text.secondary,
};

const TransactionHistoryCard: React.FC<TransactionHistoryCardProps> = ({
    transaction,
}) => {
    const themedColors = useThemedColors();
    const [expanded, setExpanded] = useState(false);

    // Get relative time
    const getRelativeTime = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;

            return date.toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    const transactionType = transaction.transaction_type.toLowerCase();
    const icon = TRANSACTION_ICONS[transactionType] || TRANSACTION_ICONS.default;
    const color = TRANSACTION_COLORS[transactionType] || TRANSACTION_COLORS.default;
    const isPositive = transaction.credits_change > 0;

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: themedColors.background.paper }]}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>

                {/* Transaction Info */}
                <View style={styles.transactionInfo}>
                    <Text style={[styles.description, { color: themedColors.text.primary }]}>
                        {transaction.description}
                    </Text>
                    <Text style={[styles.timestamp, { color: themedColors.text.secondary }]}>
                        {getRelativeTime(transaction.transaction_date)}
                    </Text>
                </View>

                {/* Amount */}
                <View style={styles.amountContainer}>
                    <Text
                        style={[
                            styles.amount,
                            { color: isPositive ? Colors.success.main : Colors.error.main },
                        ]}
                    >
                        {isPositive ? '+' : ''}{transaction.credits_change}
                    </Text>
                    <Text style={[styles.creditsLabel, { color: themedColors.text.secondary }]}>
                        credits
                    </Text>
                </View>
            </View>

            {/* Expanded Details */}
            {expanded && (
                <View style={[styles.expandedContent, { borderTopColor: themedColors.border.light }]}>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themedColors.text.secondary }]}>
                            Transaction ID:
                        </Text>
                        <Text style={[styles.detailValue, { color: themedColors.text.primary }]}>
                            {transaction.id}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themedColors.text.secondary }]}>
                            Balance Before:
                        </Text>
                        <Text style={[styles.detailValue, { color: themedColors.text.primary }]}>
                            {transaction.balance_before} credits
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themedColors.text.secondary }]}>
                            Balance After:
                        </Text>
                        <Text style={[styles.detailValue, { color: themedColors.text.primary }]}>
                            {transaction.balance_after} credits
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themedColors.text.secondary }]}>
                            Type:
                        </Text>
                        <View style={[styles.typeBadge, { backgroundColor: color + '20' }]}>
                            <Text style={[styles.typeBadgeText, { color: color }]}>
                                {transaction.transaction_type}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border.light,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icon: {
        fontSize: 24,
    },
    transactionInfo: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 13,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    creditsLabel: {
        fontSize: 11,
        marginTop: 2,
    },
    expandedContent: {
        borderTopWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 13,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '600',
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});

export default TransactionHistoryCard;
