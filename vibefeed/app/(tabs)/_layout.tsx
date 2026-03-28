import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, NAV_HEIGHT } from '../../constants/theme';
import Svg, { Path, Circle } from 'react-native-svg';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const color = focused ? COLORS.lime : COLORS.muted;
  const size = 22;
  const icons: Record<string, React.ReactElement> = {
    feed: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </Svg>
    ),
    search: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
        <Circle cx="11" cy="11" r="8" />
        <Path d="m21 21-4.35-4.35" />
      </Svg>
    ),
    dna: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
        <Path d="M2 12h20M2 12c0-5.5 4.5-10 10-10M2 12c0 5.5 4.5 10 10 10M22 12c0-5.5-4.5-10-10-10M22 12c0 5.5-4.5 10-10 10M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10M12 2c-2.5 2.5-4 6-4 10s1.5 7.5 4 10" />
      </Svg>
    ),
    profile: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <Circle cx="12" cy="7" r="4" />
      </Svg>
    ),
  };
  return (
    <View style={styles.tabIcon}>
      {icons[name] ?? null}
      <Text style={[styles.tabLabel, { color }]}>{name.toUpperCase()}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.lime,
        tabBarInactiveTintColor: COLORS.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ focused }) => <TabIcon name="feed" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="dna"
        options={{
          title: 'DNA',
          tabBarIcon: ({ focused }) => <TabIcon name="dna" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(5,5,8,0.97)',
    borderTopColor: 'rgba(255,255,255,0.07)',
    borderTopWidth: 1,
    height: NAV_HEIGHT,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabIcon: { alignItems: 'center', gap: 3 },
  tabLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 0.6 },
});
