import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

export default function Onboarding() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>VIBE<Text style={styles.logoEm}>FEED</Text></Text>
      <Text style={styles.tagline}>Discover music that matches your vibe.</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace('/(tabs)')}
        activeOpacity={0.9}
      >
        <Text style={styles.btnText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 24,
    paddingBottom: 48,
    justifyContent: 'flex-end',
  },
  logo: {
    fontFamily: 'BarlowCondensed_800ExtraBold',
    fontSize: 56,
    color: COLORS.text,
    letterSpacing: -1,
  },
  logoEm: { color: COLORS.lime },
  tagline: {
    fontSize: 15,
    color: COLORS.muted2,
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 24,
  },
  btn: {
    backgroundColor: COLORS.lime,
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'BarlowCondensed_800ExtraBold',
    fontSize: 22,
    color: COLORS.bg,
    letterSpacing: 0.5,
  },
});
