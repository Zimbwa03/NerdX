// History Notes Screen – ZIMSEC O-Level History (flat topic list)
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../theme/colors';
import { useThemedColors } from '../theme/useThemedStyles';
import { Card } from '../components/Card';
import {
  historyFormLevels,
  getHistoryTopicsByForm,
  type HistoryTopic,
  type HistoryFormLevel,
} from '../data/history';

const historyColors = {
  primary: ['#4E342E', '#5D4037', '#6D4C41'],
  light: 'rgba(93, 64, 55, 0.1)',
};

const HistoryNotesScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const initialForm = ((route.params as any)?.formLevel as HistoryFormLevel) || 'Form 1';
  const [selectedForm, setSelectedForm] = useState<HistoryFormLevel>(initialForm);
  const filteredTopics = getHistoryTopicsByForm(selectedForm);

  const handleTopicPress = (topic: HistoryTopic) => {
    if (expandedTopic === topic.id) setExpandedTopic(null);
    else setExpandedTopic(topic.id);
  };

  const handleViewNotes = (topic: HistoryTopic) => {
    if (!topic.hasNotes) return;
    navigation.navigate('TopicNotesDetail' as never, {
      topic: topic.name,
      subject: 'History',
      isALevel: false,
      topicData: topic,
      index: filteredTopics.indexOf(topic),
    } as never);
  };

  const getTopicIcon = (topicId: string): string => {
    const iconMap: Record<string, string> = {
      conceptualisation_of_history: 'book',
      origins_of_humankind: 'people',
      ancient_civilisations_egypt: 'business',
      development_of_zimbabwean_societies: 'home',
      slavery_and_the_slave_trade: 'alert-circle',
      early_european_contacts: 'boat',
      colonisation: 'flag',
      colonial_administration: 'document-text',
      nationalism: 'heart',
      armed_struggle: 'flash',
      post_independence: 'star',
      regional_cooperation: 'globe',
      sources_of_history: 'library',
      zimbabwean_societies: 'business',
      european_contacts: 'boat',
      world_wars: 'flash',
      international_cooperation: 'people',
      socialism_and_communism: 'people',
      constitution_democracy_and_human_rights: 'document-text',
    };
    return iconMap[topicId] || 'book';
  };

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background.default }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={historyColors.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>History Notes</Text>
            <Text style={styles.subtitle}>ZIMSEC O-Level History</Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="book-open-variant" size={40} color="rgba(255,255,255,0.9)" />
          </View>
        </View>
      </LinearGradient>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.topicsContainer}>
          <Text style={[styles.sectionTitle, { color: themedColors.text.primary }]}>Topics</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.formSelector}>
            {historyFormLevels.map((form) => {
              const active = form === selectedForm;
              return (
                <TouchableOpacity
                  key={form}
                  style={[styles.formChip, active && styles.formChipActive]}
                  onPress={() => {
                    setExpandedTopic(null);
                    setSelectedForm(form);
                  }}
                >
                  <Text style={[styles.formChipText, active && styles.formChipTextActive]}>{form}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <Text style={[styles.sectionSubtitle, { color: themedColors.text.secondary }]}>
            Tap a topic to see description and open detailed notes
          </Text>
          {filteredTopics.map((topic, index) => (
            <View key={topic.id}>
              <Card variant="elevated" onPress={() => handleTopicPress(topic)} style={styles.topicCard}>
                <View style={styles.topicHeader}>
                  <View style={[styles.topicIcon, { backgroundColor: historyColors.light }]}>
                    <MaterialCommunityIcons name={getTopicIcon(topic.id) as any} size={24} color="#5D4037" />
                  </View>
                  <View style={styles.topicTitleContainer}>
                    <Text style={[styles.topicName, { color: themedColors.text.primary }]}>
                      {index + 1}. {topic.name}
                    </Text>
                    <View style={styles.topicMetaRow}>
                      {topic.hasNotes && (
                        <Text style={[styles.practicalBadge, { color: '#5D4037' }]}>📖 Notes</Text>
                      )}
                    </View>
                  </View>
                  <Ionicons name={expandedTopic === topic.id ? 'chevron-up' : 'chevron-down'} size={24} color={themedColors.text.secondary} />
                </View>
              </Card>
              {expandedTopic === topic.id && (
                <View style={[styles.expandedContent, { backgroundColor: isDarkMode ? 'rgba(93, 64, 55, 0.05)' : 'rgba(93, 64, 55, 0.03)' }]}>
                  <Text style={[styles.expandedDescription, { color: themedColors.text.primary }]}>
                    {topic.description}
                  </Text>
                  {topic.hasNotes && (
                    <TouchableOpacity
                      style={[styles.detailButton, { backgroundColor: '#5D4037' }]}
                      onPress={() => handleViewNotes(topic)}
                    >
                      <Text style={styles.detailButtonText}>View Detailed Notes</Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
          {filteredTopics.length === 0 && (
            <Text style={[styles.sectionSubtitle, { color: themedColors.text.secondary }]}>
              No notes available for {selectedForm} yet.
            </Text>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { marginBottom: 8 },
  backButtonText: { color: 'rgba(255,255,255,0.9)', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicsContainer: { padding: 20 },
  formSelector: { marginBottom: 8 },
  formChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(93, 64, 55, 0.25)',
    marginRight: 8,
    backgroundColor: 'rgba(93, 64, 55, 0.05)',
  },
  formChipActive: {
    backgroundColor: '#5D4037',
    borderColor: '#5D4037',
  },
  formChipText: { fontSize: 13, fontWeight: '600', color: '#5D4037' },
  formChipTextActive: { color: '#FFFFFF' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, marginBottom: 16 },
  topicCard: { marginBottom: 8, borderColor: Colors.border.light, borderWidth: 1 },
  topicHeader: { flexDirection: 'row', alignItems: 'center', padding: 4, gap: 12 },
  topicIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  topicTitleContainer: { flex: 1 },
  topicName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  topicMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  practicalBadge: { fontSize: 12, fontWeight: '500' },
  expandedContent: {
    marginHorizontal: 4,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  expandedDescription: { fontSize: 14, lineHeight: 22, marginBottom: 16, fontStyle: 'italic' },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  detailButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});

export default HistoryNotesScreen;
