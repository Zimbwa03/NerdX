import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Card, TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {WebView} from 'react-native-webview';
import {useTheme} from '../../theme/ThemeContext';
import {mathApi} from '../../services/api';

const MathGraphScreen = () => {
  const {theme} = useTheme();
  const [functionText, setFunctionText] = useState('');
  const [graphUrl, setGraphUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!functionText.trim()) {
      Alert.alert('Error', 'Please enter a function');
      return;
    }

    setLoading(true);
    try {
      const result = await mathApi.generateGraph(functionText);
      setGraphUrl(result.graph_url || result.image_url);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate graph');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Math Graph Generator
          </Text>
          <TextInput
            label="Enter Function (e.g., y = x^2)"
            value={functionText}
            onChangeText={setFunctionText}
            mode="outlined"
            style={styles.input}
            placeholder="y = x^2 + 2x + 1"
          />
          <Button
            mode="contained"
            onPress={handleGenerate}
            loading={loading}
            disabled={loading}
            style={styles.button}>
            Generate Graph
          </Button>
        </Card.Content>
      </Card>

      {graphUrl && (
        <Card style={styles.graphCard}>
          <Card.Content>
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <WebView
                source={{uri: graphUrl}}
                style={styles.webview}
                scalesPageToFit
              />
            )}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  graphCard: {
    elevation: 4,
  },
  webview: {
    width: '100%',
    height: 400,
  },
});

export default MathGraphScreen;

