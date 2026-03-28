import { useRef, useCallback, useState, useEffect } from 'react';
import { FlatList, Dimensions, View, StyleSheet, ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { feedAPI } from '../../lib/api';
import FeedCard from '../../components/feed/FeedCard';
import MiniPlayer from '../../components/ui/MiniPlayer';
import { useFeedStore } from '../../store/feedStore';
import { COLORS, NAV_HEIGHT } from '../../constants/theme';
import { FeedItem } from '../../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MOCK_FEED: FeedItem[] = [
  {
    id: '1',
    spotify_id: 'sp1',
    title: 'Never Be Like You',
    artist: 'Flume ft. Kai',
    album: 'Skin',
    album_art_url: '',
    preview_url: null,
    bpm: 122,
    key: 'B min',
    energy: 0.68,
    genre: 'Future Bass',
    likes_count: 4821,
    comments_count: 392,
    created_at: new Date().toISOString(),
    is_liked: false,
    is_saved: false,
    why_in_feed: 'Based on your Innerbloom save · 91% match',
    analysis: {
      track_id: '1',
      vibe: ['nostalgic', 'euphoric', 'late night'],
      scenes: ['neon city drive', 'rainy window'],
      dna: ['future bass', 'emotional EDM'],
      dj_mix: ['Innerbloom – RÜFÜS DU SOL', 'Opus – Eric Prydz'],
      lyrics_preview: [
        "You're everything that I need",
        'The only one I want to believe',
        'Never be like you',
        'I wish I knew how',
        'To make it all disappear',
        'Never be like you',
      ],
      dropmatch_ids: [],
      cached_at: new Date().toISOString(),
    },
  },
  {
    id: '2',
    spotify_id: 'sp2',
    title: 'Innerbloom',
    artist: 'RÜFÜS DU SOL',
    album: 'Bloom',
    album_art_url: '',
    preview_url: null,
    bpm: 120,
    key: 'F# maj',
    energy: 0.61,
    genre: 'Melodic House',
    likes_count: 7103,
    comments_count: 541,
    created_at: new Date().toISOString(),
    is_liked: false,
    is_saved: false,
    why_in_feed: '94% energy match to your DNA',
    analysis: {
      track_id: '2',
      vibe: ['transcendent', 'hypnotic', 'journey'],
      scenes: ['desert sunrise', 'open highway'],
      dna: ['melodic house', 'progressive'],
      dj_mix: ['Opus – Eric Prydz', 'Strobe – deadmau5'],
      lyrics_preview: [
        'So slowly now',
        'All the lights go dim',
        'I feel so alive',
        'In the current within',
        'All the world around',
        'Falls into place',
      ],
      dropmatch_ids: [],
      cached_at: new Date().toISOString(),
    },
  },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { items, setItems, setCurrentIndex } = useFeedStore();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const live = await feedAPI.getFeed(0, 10);
        if (mounted && Array.isArray(live) && live.length > 0) {
          setItems(live);
        } else if (mounted) {
          setItems(MOCK_FEED);
        }
      } catch {
        if (mounted) setItems(MOCK_FEED);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [setItems]);

  const CARD_HEIGHT = SCREEN_HEIGHT - NAV_HEIGHT - insets.bottom;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0] != null) {
        const idx = viewableItems[0].index ?? 0;
        setActiveIndex(idx);
        setCurrentIndex(idx);
      }
    },
    [setCurrentIndex]
  );

  const viewabilityConfig = { itemVisiblePercentThreshold: 60 };

  const renderItem = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => (
      <FeedCard
        item={item}
        index={index}
        isActive={index === activeIndex}
        cardHeight={CARD_HEIGHT}
      />
    ),
    [activeIndex, CARD_HEIGHT]
  );

  return (
    <View style={[styles.container, { backgroundColor: COLORS.bg }]}>
      <FlatList
        ref={flatListRef}
        data={items.length ? items : MOCK_FEED}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={CARD_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT,
          offset: CARD_HEIGHT * index,
          index,
        })}
      />
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
