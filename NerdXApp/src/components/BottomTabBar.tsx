/**
 * NerdX Brand Kit — Bottom Tab Bar (Section 5.4)
 * Design spec: 60px height + safe area inset
 * Active tab: brand indigo icon + label + top indicator line
 * Inactive: tertiary color
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { textStyles } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

export type TabId = 'learn' | 'progress' | 'modes' | 'community' | 'profile';

export interface TabItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface BottomTabBarProps {
  tabs: TabItem[];
  activeTab: TabId;
  onTabPress: (id: TabId) => void;
}

export function BottomTabBar({ tabs, activeTab, onTabPress }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.borderSubtle,
          paddingBottom: insets.bottom,
        },
      ]}
      accessibilityRole="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            activeOpacity={0.7}
          >
            {/* Active indicator — top line */}
            {isActive ? (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: colors.primary },
                ]}
              />
            ) : null}

            {/* Icon */}
            <View
              style={[
                styles.iconWrap,
                isActive && {
                  backgroundColor: colors.primarySubtle,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              {isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
            </View>

            {/* Label */}
            <Text
              style={[
                textStyles.navLabel,
                {
                  color: isActive ? colors.primary : colors.textTertiary,
                  fontWeight: isActive ? '600' : '500',
                  marginTop: 3,
                },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60, // + safe area handled via paddingBottom
    borderTopWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
