import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Svg, { Path, Polygon, Rect, Line, Polyline } from 'react-native-svg';
import { FeedItem } from '../../types';
import { Palette } from '../../types';

interface Props {
  item: FeedItem;
  palette: Palette;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function PlayerBar({ item, palette, isPlaying, onPlayPause }: Props) {
  return (
    <View style={styles.player}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { backgroundColor: palette.c1, width: '0%' }]} />
      </View>
      <View style={styles.times}>
        <Text style={styles.timeText}>0:00</Text>
        <Text style={styles.timeText}>3:28</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={2}>
            <Polyline points="1 4 1 10 7 10" />
            <Path d="M3.51 15a9 9 0 1 0 .49-3.18" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="rgba(255,255,255,0.55)">
            <Polygon points="19,20 9,12 19,4" />
            <Rect x="4" y="4" width="2" height="16" fill="rgba(255,255,255,0.55)" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: palette.c1, shadowColor: palette.c1 }]}
          onPress={onPlayPause}
        >
          {isPlaying ? (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="#000">
              <Rect x="6" y="4" width="4" height="16" />
              <Rect x="14" y="4" width="4" height="16" />
            </Svg>
          ) : (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="#000">
              <Polygon points="5,3 19,12 5,21" />
            </Svg>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="rgba(255,255,255,0.55)">
            <Polygon points="5,4 15,12 5,20" />
            <Rect x="18" y="4" width="2" height="16" fill="rgba(255,255,255,0.55)" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={2}>
            <Polyline points="16 3 21 3 21 8" />
            <Line x1="4" y1="20" x2="21" y2="3" />
            <Polyline points="21 16 21 21 16 21" />
            <Line x1="15" y1="15" x2="21" y2="21" />
            <Line x1="4" y1="4" x2="9" y2="9" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  player: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: { height: '100%', borderRadius: 2 },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  timeText: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctrlBtn: { padding: 6 },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
});
