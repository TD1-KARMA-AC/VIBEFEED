import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.sub}>Track, artist, genre — coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  title: { fontFamily: 'BarlowCondensed_800ExtraBold', fontSize: 28, color: COLORS.text },
  sub: { fontSize: 14, color: COLORS.muted, marginTop: 8 },
});
