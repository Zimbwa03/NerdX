// Security Center Screen - Password, sessions, and login history
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    ImageBackground,
    RefreshControl,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';
import Colors from '../theme/colors';
import FloatingParticles from '../components/FloatingParticles';
import { accountApi, LoginSession } from '../services/api/accountApi';

const SecurityCenterScreen: React.FC = () => {
    const navigation = useNavigation();
    const themedColors = useThemedColors();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<LoginSession[]>([]);
    const [loginHistory, setLoginHistory] = useState<LoginSession[]>([]);
    const [activeTab, setActiveTab] = useState<'password' | 'sessions' | 'history'>('password');

    // Password change state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [sessionsData, historyData] = await Promise.all([
                accountApi.getActiveSessions(),
                accountApi.getLoginHistory(20)
            ]);
            setSessions(sessionsData || []);
            setLoginHistory(historyData || []);
        } catch (error) {
            console.error('Failed to load security data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setPasswordLoading(true);
        const result = await accountApi.changePassword(oldPassword, newPassword);
        setPasswordLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Password changed successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            Alert.alert('Error', result.message);
        }
    };

    const handleLogoutSession = async (sessionId: number) => {
        Alert.alert(
            'Logout Session',
            'Are you sure you want to log out this session?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await accountApi.logoutSession(sessionId);
                        if (success) {
                            setSessions(sessions.filter(s => s.id !== sessionId));
                        } else {
                            Alert.alert('Error', 'Failed to logout session');
                        }
                    }
                }
            ]
        );
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getDeviceDescription = (deviceInfo: any) => {
        if (!deviceInfo) return 'Unknown Device';
        const parts = [];
        if (deviceInfo.platform) parts.push(deviceInfo.platform);
        if (deviceInfo.model) parts.push(deviceInfo.model);
        if (deviceInfo.os_version) parts.push(`v${deviceInfo.os_version}`);
        return parts.length > 0 ? parts.join(' • ') : 'Unknown Device';
    };

    const renderPasswordTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.passwordCard}>
                <View style={styles.passwordHeader}>
                    <Text style={styles.passwordIcon}>🔐</Text>
                    <Text style={styles.passwordTitle}>Change Password</Text>
                </View>
                <Text style={styles.passwordSubtitle}>
                    Keep your account secure by using a strong password
                </Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <View style={styles.passwordInput}>
                        <TextInput
                            style={styles.input}
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry={!showOldPassword}
                            placeholder="Enter current password"
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        />
                        <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                            <Text style={styles.eyeIcon}>{showOldPassword ? '👁️' : '👁️‍🗨️'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <View style={styles.passwordInput}>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPassword}
                            placeholder="Enter new password"
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                            <Text style={styles.eyeIcon}>{showNewPassword ? '👁️' : '👁️‍🗨️'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                    <TextInput
                        style={[styles.input, styles.fullInput]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholder="Confirm new password"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.changePasswordButton, passwordLoading && styles.buttonDisabled]}
                    onPress={handleChangePassword}
                    disabled={passwordLoading}
                >
                    {passwordLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.changePasswordText}>Update Password</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Security Tips */}
            <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>🛡️ Security Tips</Text>
                <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Use at least 8 characters with letters, numbers, and symbols</Text>
                </View>
                <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Don't reuse passwords from other accounts</Text>
                </View>
                <View style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>Never share your password with anyone</Text>
                </View>
            </View>
        </View>
    );

    const renderSessionsTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>📱 Active Sessions</Text>
            <Text style={styles.sectionSubtitle}>
                Devices currently logged into your account
            </Text>

            {sessions.length > 0 ? (
                sessions.map((session) => (
                    <View key={session.id} style={styles.sessionItem}>
                        <View style={styles.sessionIcon}>
                            <Text style={styles.sessionEmoji}>📱</Text>
                        </View>
                        <View style={styles.sessionInfo}>
                            <Text style={styles.sessionDevice}>{getDeviceDescription(session.device_info)}</Text>
                            <Text style={styles.sessionDetails}>
                                {session.ip_address || 'Unknown IP'} • {formatDate(session.login_at)}
                            </Text>
                            {session.is_current && (
                                <View style={styles.currentBadge}>
                                    <Text style={styles.currentBadgeText}>Current Session</Text>
                                </View>
                            )}
                        </View>
                        {!session.is_current && (
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={() => handleLogoutSession(session.id)}
                            >
                                <Text style={styles.logoutButtonText}>Logout</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>✅</Text>
                    <Text style={styles.emptyText}>No active sessions found</Text>
                </View>
            )}
        </View>
    );

    const renderHistoryTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>📜 Login History</Text>
            <Text style={styles.sectionSubtitle}>
                Recent login activity on your account
            </Text>

            {loginHistory.length > 0 ? (
                loginHistory.map((entry, index) => (
                    <View key={entry.id || index} style={styles.historyItem}>
                        <View style={[
                            styles.historyIcon,
                            { backgroundColor: entry.is_active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)' }
                        ]}>
                            <Text style={styles.historyEmoji}>{entry.is_active ? '🟢' : '⚪'}</Text>
                        </View>
                        <View style={styles.historyInfo}>
                            <Text style={styles.historyDevice}>{getDeviceDescription(entry.device_info)}</Text>
                            <Text style={styles.historyDetails}>
                                {entry.ip_address || 'Unknown IP'}
                            </Text>
                            <Text style={styles.historyTime}>
                                Login: {formatDate(entry.login_at)}
                                {entry.logout_at && ` • Logout: ${formatDate(entry.logout_at)}`}
                            </Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>📜</Text>
                    <Text style={styles.emptyText}>No login history available</Text>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themedColors.background.default }]}>
                <ActivityIndicator size="large" color={Colors.primary.main} />
                <Text style={[styles.loadingText, { color: themedColors.text.secondary }]}>
                    Loading security settings...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
            <ImageBackground
                source={require('../../assets/images/default_background.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <FloatingParticles count={10} />
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary.main]} />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Security Center</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'password' && styles.tabActive]}
                            onPress={() => setActiveTab('password')}
                        >
                            <Text style={[styles.tabText, activeTab === 'password' && styles.tabTextActive]}>
                                Password
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'sessions' && styles.tabActive]}
                            onPress={() => setActiveTab('sessions')}
                        >
                            <Text style={[styles.tabText, activeTab === 'sessions' && styles.tabTextActive]}>
                                Sessions
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
                            onPress={() => setActiveTab('history')}
                        >
                            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                                History
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tab Content */}
                    {activeTab === 'password' && renderPasswordTab()}
                    {activeTab === 'sessions' && renderSessionsTab()}
                    {activeTab === 'history' && renderHistoryTab()}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1, width: '100%', height: '100%' },
    scrollView: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: { fontSize: 24, color: '#FFFFFF' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabActive: { backgroundColor: Colors.primary.main },
    tabText: { fontSize: 14, fontWeight: '600', color: 'rgba(255, 255, 255, 0.6)' },
    tabTextActive: { color: '#FFFFFF' },
    tabContent: { marginHorizontal: 20 },
    passwordCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
    },
    passwordHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    passwordIcon: { fontSize: 24, marginRight: 10 },
    passwordTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
    passwordSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 20 },
    inputContainer: { marginBottom: 16 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },
    fullInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    eyeIcon: { fontSize: 20, paddingRight: 16 },
    changePasswordButton: {
        backgroundColor: Colors.primary.main,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    changePasswordText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
    tipsCard: {
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    tipsTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
    tipItem: { flexDirection: 'row', marginBottom: 8 },
    tipBullet: { fontSize: 14, color: Colors.primary.light, marginRight: 8 },
    tipText: { flex: 1, fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
    sectionSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', marginBottom: 16 },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    sessionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(124, 77, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionEmoji: { fontSize: 22 },
    sessionInfo: { flex: 1, marginLeft: 12 },
    sessionDevice: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
    sessionDetails: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginTop: 4 },
    currentBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 6,
    },
    currentBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.success.main },
    logoutButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    logoutButtonText: { fontSize: 13, fontWeight: '600', color: Colors.error.main },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    historyIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyEmoji: { fontSize: 16 },
    historyInfo: { flex: 1, marginLeft: 12 },
    historyDevice: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    historyDetails: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginTop: 2 },
    historyTime: { fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', marginTop: 4 },
    emptyState: { alignItems: 'center', paddingVertical: 40 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default SecurityCenterScreen;
