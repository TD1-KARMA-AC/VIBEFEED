import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/onboarding');
  }, [router]);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.lime} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
});
