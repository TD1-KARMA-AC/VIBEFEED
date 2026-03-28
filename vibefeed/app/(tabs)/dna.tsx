import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useDNAStore } from '../../store/dnaStore';

export default function DNAScreen() {
  const { dna } = useDNAStore();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VIBE DNA</Text>
      <Text style={styles.primary}>{dna.primary_vibe}</Text>
      <Text style={styles.sub}>{dna.secondary_vibe} · {dna.hidden_vibe}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  title: { fontFamily: 'BarlowCondensed_800ExtraBold', fontSize: 28, color: COLORS.lime },
  primary: { fontFamily: 'BarlowCondensed_800ExtraBold', fontSize: 22, color: COLORS.text, marginTop: 12 },
  sub: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
});
