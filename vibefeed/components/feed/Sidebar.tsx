import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { FeedItem } from '../../types';
import { COLORS } from '../../constants/theme';

interface Props {
  item: FeedItem;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onSave: () => void;
}

function fmt(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

export default function Sidebar({ item, isLiked, isSaved, onLike, onSave }: Props) {
  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLike();
  };

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.action} onPress={handleLike}>
        <View style={[styles.ico, isLiked && styles.icoLiked]}>
          <Svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill={isLiked ? COLORS.pink : 'none'}
            stroke={isLiked ? COLORS.pink : '#fff'}
            strokeWidth={2}
          >
            <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </Svg>
        </View>
        <Text style={styles.lbl}>{fmt(item.likes_count + (isLiked ? 1 : 0))}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action}>
        <View style={styles.ico}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </Svg>
        </View>
        <Text style={styles.lbl}>{fmt(item.comments_count)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action} onPress={onSave}>
        <View style={[styles.ico, isSaved && styles.icoSaved]}>
          <Svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill={isSaved ? COLORS.lime : 'none'}
            stroke={isSaved ? COLORS.lime : '#fff'}
            strokeWidth={2}
          >
            <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </Svg>
        </View>
        <Text style={styles.lbl}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action}>
        <View style={styles.ico}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
            <Circle cx="18" cy="5" r="3" />
            <Circle cx="6" cy="12" r="3" />
            <Circle cx="18" cy="19" r="3" />
            <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </Svg>
        </View>
        <Text style={styles.lbl}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    right: 14,
    bottom: 150,
    zIndex: 10,
    gap: 18,
    alignItems: 'center',
  },
  action: { alignItems: 'center', gap: 4 },
  ico: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoLiked: { backgroundColor: 'rgba(255,45,107,0.25)', borderColor: 'rgba(255,45,107,0.6)' },
  icoSaved: { backgroundColor: 'rgba(212,255,62,0.15)', borderColor: 'rgba(212,255,62,0.5)' },
  lbl: { fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
});
