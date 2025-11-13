import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, List, Switch, Divider} from 'react-native-paper';
import {useTheme} from '../../theme/ThemeContext';

const SettingsScreen = () => {
  const {theme, isDark, toggleTheme} = useTheme();
  const [notifications, setNotifications] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Appearance
          </Text>
          <List.Item
            title="Dark Mode"
            description="Toggle dark theme"
            left={props => <List.Icon {...props} icon="brightness-6" />}
            right={() => (
              <Switch value={isDark} onValueChange={toggleTheme} />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Notifications
          </Text>
          <List.Item
            title="Push Notifications"
            description="Receive notifications about your progress"
            left={props => <List.Icon {...props} icon="notifications" />}
            right={() => (
              <Switch value={notifications} onValueChange={setNotifications} />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            About
          </Text>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="info" />}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="description" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="privacy-tip" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default SettingsScreen;

