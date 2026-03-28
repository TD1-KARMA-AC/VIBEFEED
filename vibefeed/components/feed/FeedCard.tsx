import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedItem } from '../../types';
import { PALETTES, COLORS } from '../../constants/theme';
import VinylArt from './VinylArt';
import PlayerBar from './PlayerBar';
import Sidebar from './Sidebar';
import { useFeedStore } from '../../store/feedStore';
import { usePlayerStore } from '../../store/playerStore';

interface Props {
  item: FeedItem;
  index: number;
  isActive: boolean;
  cardHeight: number;
}

export default function FeedCard({ item, index, isActive, cardHeight }: Props) {
  const palette = PALETTES[index % PALETTES.length];
  const { likedIds, savedIds, toggleLike, toggleSave } = useFeedStore();
  const { currentTrack, isPlaying, setTrack, setPlaying } = usePlayerStore();
  const isLiked = likedIds.has(item.id);
  const isSaved = savedIds.has(item.id);
  const isCurrentTrack = currentTrack?.id === item.id;

  const handlePlayPause = () => {
    if (!isCurrentTrack) {
      setTrack(item);
      setPlaying(true);
    } else {
      setPlaying(!isPlaying);
    }
  };

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <LinearGradient
        colors={[palette.c3, '#000000']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.blob1, { backgroundColor: palette.c1 }]} />
      <View style={[styles.blob2, { backgroundColor: palette.c2 }]} />

      <LinearGradient
        colors={[
          'rgba(0,0,0,0.45)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.92)',
          'rgba(0,0,0,0.99)',
        ]}
        locations={[0, 0.18, 0.38, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.whyChip}>
        <View style={styles.whyDot} />
        <Text style={styles.whyText} numberOfLines={1}>{item.why_in_feed}</Text>
      </View>

      <VinylArt
        item={item}
        palette={palette}
        isPlaying={isCurrentTrack && isPlaying}
      />

      <View style={styles.lyricsArea} pointerEvents="none">
        {item.analysis.lyrics_preview.slice(0, 5).map((line, i) => (
          <Text
            key={i}
            style={[
              styles.lyricLine,
              i === 0 && styles.lyricCurrent,
              i === 1 && styles.lyricPast,
            ]}
          >
            {line}
          </Text>
        ))}
      </View>

      <Sidebar
        item={item}
        isLiked={isLiked}
        isSaved={isSaved}
        onLike={() => toggleLike(item.id)}
        onSave={() => toggleSave(item.id)}
      />

      <View style={styles.bottom}>
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            <Text style={styles.artistBold}>{item.artist}</Text>
            {' · '}
            {item.album}
          </Text>

          <View style={styles.pills}>
            <View style={[styles.pill, styles.pillBpm]}>
              <Text style={[styles.pillText, { color: COLORS.lime }]}>{item.bpm} BPM</Text>
            </View>
            <View style={[styles.pill, styles.pillKey]}>
              <Text style={[styles.pillText, { color: COLORS.cyan }]}>{item.key}</Text>
            </View>
            <View style={[styles.pill, styles.pillNrg]}>
              <Text style={[styles.pillText, { color: COLORS.amber }]}>
                E {item.energy.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.pill, styles.pillGnr]}>
              <Text style={[styles.pillText, { color: 'rgba(255,255,255,0.6)' }]}>
                {item.genre}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.vibeRow}>
          {item.analysis.vibe.map((v, i) => (
            <View key={i} style={styles.vibeTag}>
              <Text style={styles.vibeTagText}>{v}</Text>
            </View>
          ))}
        </View>

        <PlayerBar
          item={item}
          palette={palette}
          isPlaying={isCurrentTrack && isPlaying}
          onPlayPause={handlePlayPause}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', overflow: 'hidden', backgroundColor: '#000' },
  blob1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: '15%',
    left: '-10%',
    opacity: 0.45,
  },
  blob2: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    top: '30%',
    right: '-5%',
    opacity: 0.35,
  },
  whyChip: {
    position: 'absolute',
    top: 68,
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  whyDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.lime },
  whyText: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  lyricsArea: {
    position: 'absolute',
    bottom: 290,
    left: 22,
    right: 80,
    zIndex: 3,
  },
  lyricLine: {
    fontFamily: 'BarlowCondensed_800ExtraBold',
    fontSize: 21,
    lineHeight: 31,
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: 0.3,
  },
  lyricCurrent: { color: 'rgba(255,255,255,0.92)' },
  lyricPast: { color: 'rgba(255,255,255,0.45)' },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 20,
    zIndex: 5,
  },
  meta: { marginBottom: 10 },
  title: {
    fontFamily: 'BarlowCondensed_800ExtraBold',
    fontSize: 34,
    color: '#fff',
    lineHeight: 34,
  },
  artist: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  artistBold: { fontWeight: '600', color: 'rgba(255,255,255,0.85)' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 8 },
  pill: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  pillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  pillBpm: { borderColor: 'rgba(212,255,62,0.45)', backgroundColor: 'rgba(212,255,62,0.1)' },
  pillKey: { borderColor: 'rgba(45,255,240,0.45)', backgroundColor: 'rgba(45,255,240,0.1)' },
  pillNrg: { borderColor: 'rgba(255,184,45,0.45)', backgroundColor: 'rgba(255,184,45,0.1)' },
  pillGnr: { borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.06)' },
  vibeRow: { flexDirection: 'row', gap: 5, marginBottom: 10 },
  vibeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(212,255,62,0.3)',
    backgroundColor: 'rgba(212,255,62,0.07)',
  },
  vibeTagText: { fontSize: 11, color: COLORS.lime },
});
