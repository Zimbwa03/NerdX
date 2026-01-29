// Exam Setup Screen - Full-screen page (not a pop-up) for configuring exam parameters
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExamSetupModal from '../components/ExamSetupModal';
import { useAuth } from '../context/AuthContext';
import { ExamConfig, TimeInfo } from '../services/api/examApi';

type ExamSetupRouteParams = {
    initialSubject?: string;
    userCredits?: number;
    availableTopics?: string[];
    csBoard?: 'zimsec' | 'cambridge';
};

const ExamSetupScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<RouteProp<{ params: ExamSetupRouteParams }, 'params'>>();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const params = route.params ?? {};
    const initialSubject = params.initialSubject ?? 'mathematics';
    const userCredits = params.userCredits ?? user?.credits ?? 0;
    const availableTopics = params.availableTopics ?? [];
    const csBoard = params.csBoard;

    const handleClose = () => {
        navigation.goBack();
    };

    const handleStartExam = (config: ExamConfig, timeInfo: TimeInfo) => {
        navigation.navigate('ExamSession', {
            examConfig: config,
            timeInfo,
        });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ExamSetupModal
                visible={true}
                onClose={handleClose}
                onStartExam={handleStartExam}
                initialSubject={initialSubject}
                userCredits={userCredits}
                availableTopics={availableTopics}
                csBoard={csBoard}
                asPage={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ExamSetupScreen;
