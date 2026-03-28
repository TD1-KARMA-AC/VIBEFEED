import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Polygon, Rect } from 'react-native-svg';
import { usePlayerStore } from '../../store/playerStore';
import { COLORS, NAV_HEIGHT, MINI_PLAYER_HEIGHT } from '../../constants/theme';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, setPlaying } = usePlayerStore();
  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.disc, { backgroundColor: 'rgba(123,63,255,0.4)' }]} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
            <Polygon points="19,20 9,12 19,4" />
            <Rect x="4" y="4" width="2" height="16" fill="rgba(255,255,255,0.6)" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={() => setPlaying(!isPlaying)}>
          {isPlaying ? (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="#000">
              <Rect x="6" y="4" width="4" height="16" />
              <Rect x="14" y="4" width="4" height="16" />
            </Svg>
          ) : (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="#000">
              <Polygon points="5,3 19,12 5,21" />
            </Svg>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
            <Polygon points="5,4 15,12 5,20" />
            <Rect x="18" y="4" width="2" height="16" fill="rgba(255,255,255,0.6)" />
          </Svg>
        </TouchableOpacity>
      </View>
      <View style={styles.progBar}>
        <View style={[styles.progFill, { width: '0%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: NAV_HEIGHT,
    left: 0,
    right: 0,
    height: MINI_PLAYER_HEIGHT,
    backgroundColor: 'rgba(10,10,18,0.97)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    zIndex: 49,
  },
  disc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  info: { flex: 1, minWidth: 0 },
  title: { fontFamily: 'BarlowCondensed_800ExtraBold', fontSize: 16, color: '#fff' },
  artist: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: { padding: 6 },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  progFill: { height: '100%', backgroundColor: COLORS.lime },
});
