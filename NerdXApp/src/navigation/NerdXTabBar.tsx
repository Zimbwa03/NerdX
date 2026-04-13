/**
 * NerdX Bottom Tab Bar — Brand Kit Section 5.4
 *
 * Design rules:
 *  - Height: 60pt + safe area bottom inset
 *  - Background: bgElevated, 1pt top border in borderSubtle
 *  - Active tab: primary-colored icon + label + 32×3pt indicator bar at very top
 *  - Inactive tab: tertiary-colored icon + label
 *  - Icon: 20pt, strokeWidth 2.0 active / 1.5 inactive
 *  - Label: DMSans-Medium, 11pt (navLabel style)
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  GraduationCap,
  TrendingUp,
  Layers,
  Users,
  User,
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { fonts } from '../theme/typography';

/** Icon map — one icon per tab route name */
const TAB_ICONS: Record<string, typeof GraduationCap> = {
  LearnTab:     GraduationCap,
  ProgressTab:  TrendingUp,
  ModesTab:     Layers,
  CommunityTab: Users,
  ProfileTab:   User,
};

/** Human-readable labels */
const TAB_LABELS: Record<string, string> = {
  LearnTab:     'Learn',
  ProgressTab:  'Progress',
  ModesTab:     'Modes',
  CommunityTab: 'Community',
  ProfileTab:   'Profile',
};

export function NerdXTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.borderSubtle,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
      ]}
      accessibilityRole="tablist"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const IconComponent = TAB_ICONS[route.name];
        const label = TAB_LABELS[route.name] ?? route.name;

        const iconColor = isFocused ? colors.primary : colors.textTertiary;
        const labelColor = isFocused ? colors.primary : colors.textTertiary;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            onPress={onPress}
            onLongPress={onLongPress}
            android_ripple={{ color: colors.primarySubtle, borderless: true }}
            style={styles.tabItem}
          >
            {/* Active indicator bar — sits flush at the very top */}
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: isFocused ? colors.primary : 'transparent' },
              ]}
            />

            {/* Icon */}
            {IconComponent ? (
              <IconComponent
                size={20}
                color={iconColor}
                strokeWidth={isFocused ? 2.0 : 1.5}
              />
            ) : null}

            {/* Label */}
            <Text
              style={[styles.tabLabel, { color: labelColor }]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    // Shadow for iOS — subtle lift
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
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
    gap: 3,
    position: 'relative',
    minHeight: 60,
  },
  /** 32×3pt indicator bar pinned to top of each tab item */
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
  },
  tabLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0,
  },
});
