# Dashboard Knowledge Map Integration Guide

## Overview
Add the Knowledge Map widget to DashboardScreen to show students their mastery across all skills.

---

## Step 1: Add Imports

**File**: `NerdXApp/src/screens/DashboardScreen.tsx`

**Add these imports at the top**:
```typescript
import { dktService, KnowledgeMap } from '../services/api/dktApi';
import { KnowledgeMapWidget } from '../components/KnowledgeMapWidget';
```

---

## Step 2: Add State Variables

**Location**: After existing state variables in DashboardScreen

```typescript
const [knowledgeMap, setKnowledgeMap] = useState<KnowledgeMap | null>(null);
const [loadingKnowledgeMap, setLoadingKnowledgeMap] = useState(false);
```

---

## Step 3: Load Knowledge Map on Mount

**Location**: In a `useEffect` hook

```typescript
useEffect(() => {
  loadKnowledgeMap();
}, []);

const loadKnowledgeMap = async () => {
  try {
    setLoadingKnowledgeMap(true);
    const map = await dktService.getKnowledgeMap();
    setKnowledgeMap(map);
  } catch (error) {
    console.error('Failed to load knowledge map:', error);
  } finally {
    setLoadingKnowledgeMap(false);
  }
};
```

---

## Step 4: Add Widget to Dashboard

**Location**: In the ScrollView, after other dashboard sections (e.g., after subjects section)

```typescript
{/* Knowledge Map Widget */}
<KnowledgeMapWidget
  knowledgeMap={knowledgeMap}
  loading={loadingKnowledgeMap}
  onSkillPress={(skillId) => {
    console.log('Skill pressed:', skillId);
    // TODO: Navigate to practice this skill
  }}
/>
```

---

## Alternative: Quick Test Version

If you want to test immediately without modifying DashboardScreen, create a new screen:

**File**: `NerdXApp/src/screens/KnowledgeMapScreen.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { dktService, KnowledgeMap } from '../services/api/dktApi';
import { KnowledgeMapWidget } from '../components/KnowledgeMapWidget';
import { Colors } from '../theme/colors';

export const KnowledgeMapScreen: React.FC = () => {
  const [knowledgeMap, setKnowledgeMap] = useState<KnowledgeMap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKnowledgeMap();
  }, []);

  const loadKnowledgeMap = async () => {
    try {
      const map = await dktService.getKnowledgeMap();
      setKnowledgeMap(map);
    } catch (error) {
      console.error('Failed to load knowledge map:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <KnowledgeMapWidget
          knowledgeMap={knowledgeMap}
          loading={loading}
          onSkillPress={(skillId) => {
            console.log('Navigate to practice:', skillId);
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});
```

---

## ✅ Verification

After integration, you should see:

1. **Summary Stats**: Mastered, Learning, Practice counts
2. **Skill Cards**: Horizontal scroll showing top 5 skills needing attention
3. **Progress Bars**: Visual representation of mastery (0-100%)
4. **Status Badges**: Color-coded labels (Mastered, Proficient, Learning, Needs Practice)

---

##  🎨 What It Looks Like

- **Mastered (80%+)**: Green 🌟
- **Proficient (60-80%)**: Blue 💪  
- **Learning (40-60%)**: Orange 📈
- **Needs Practice (<40%)**: Red 🎯

---

## 🔄 Refresh Knowledge Map

To refresh after completing quizzes, call `loadKnowledgeMap()` again:

```typescript
// After quiz completion or navigation back to dashboard
useFocusEffect(
  React.useCallback(() => {
    loadKnowledgeMap();
  }, [])
);
```

---

## 🚀 Ready to Use!

The Knowledge Map Widget is now ready. It will automatically:
- Show student progress across all skills
- Highlight areas needing attention
- Update in real-time as students practice
- Provide visual motivation with progress bars

**Next**: Test by answering some quiz questions, then viewing the dashboard!
